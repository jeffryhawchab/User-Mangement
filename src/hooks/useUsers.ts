import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import axios from 'axios'

interface User {
  id: string
  firstName: string
  lastName?: string
  email: string
  status: 'active' | 'locked'
  dateOfBirth: string
}

export const useUsers = (search = '') => {
  return useQuery<User[]>({
    queryKey: ['users', search],
    queryFn: async () => {
      const response = await axios.get('/api/users', {
        params: { search },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return response.data.data.users
    },
    // Error handling can be done globally or within the queryFn
  })
}

export const useUser = (id: string) => {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return response.data.data.user
    },
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userData: Omit<User, 'id'>) => {
      const response = await axios.post('/api/users', userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return response.data.data.user
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...userData }: { id: string } & Omit<User, 'id'>) => {
      const response = await axios.put(`/api/users/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return response.data.data.user
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}