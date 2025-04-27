import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../auth/authstore';

const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format'),
  status: z.enum(['active', 'locked']),
});

type UserFormData = z.infer<typeof userSchema>;

export const EditUser = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  // Fetch user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      return data.data.user;
    },
    enabled: !!id,
  });

  // Set form values when data loads
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName || '',
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        status: user.status,
      });
    }
  }, [user, reset]);

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: UserFormData) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate(`/dashboard?${searchParams.toString()}`);
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });

  const onSubmit = (data: UserFormData) => {
    updateUserMutation.mutate(data);
  };

  if (isLoading) return <div className="text-center py-8">Loading user data...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit User</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name*</label>
          <input
            {...register('firstName')}
            className={`mt-1 block w-full rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            {...register('lastName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email*</label>
          <input
            type="email"
            {...register('email')}
            className={`mt-1 block w-full rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
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
            className={`mt-1 block w-full rounded-md ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status*</label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            disabled={updateUserMutation.isPending}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;