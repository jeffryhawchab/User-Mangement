// src/components/UserForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../auth/authstore';


// Zod schema for form validation
const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  status: z.enum(['active', 'locked']),
});

type UserFormData = z.infer<typeof userSchema>;

export const UserForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mode = id ? 'edit' : 'add';

  // Initialize form with react-hook-form and Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  // Fetch user data for edit mode
  const { data: existingUser } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id || !accessToken) return null;
      
      const response = await fetch(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      return data.data.user;
    },
    enabled: mode === 'edit' && !!id,
  });

  // Set form values when in edit mode
  useEffect(() => {
    if (mode === 'edit' && existingUser) {
      reset({
        firstName: existingUser.firstName,
        lastName: existingUser.lastName || '',
        email: existingUser.email,
        dateOfBirth: existingUser.dateOfBirth,
        status: existingUser.status,
      });
    }
  }, [existingUser, mode, reset]);

  // Create or update user mutation
  const userMutation = useMutation({
    mutationFn: async (formData: UserFormData) => {
      const url = mode === 'edit' 
        ? `/api/users/${id}?${searchParams.toString()}`
        : `/api/users?${searchParams.toString()}`;

      const response = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    },
    onSuccess: () => {
      const successMessage = mode === 'edit' 
        ? 'User updated successfully' 
        : 'User created successfully';
      
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Navigate back to dashboard with current search params
      navigate(`/dashboard?${searchParams.toString()}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Operation failed');
    },
  });

  const onSubmit = (data: UserFormData) => {
    userMutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {mode === 'edit' ? 'Edit User' : 'Add New User'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name*</label>
          <input
            {...register('firstName')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            {...register('lastName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email*</label>
          <input
            {...register('email')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth*</label>
          <input
            type="date"
            {...register('dateOfBirth')}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status*</label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="active">Active</option>
            <option value="locked">Locked</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/dashboard?${searchParams.toString()}`)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={userMutation.isPending}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {userMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};