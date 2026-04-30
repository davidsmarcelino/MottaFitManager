import { useState } from 'react';
import { api } from '../services';
import { handleApiError, isUnauthorizedError } from '../utils/errorHandler';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const execute = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError('');
      const result = await apiCall();
      return result;
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const apiCall = async (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any) => {
    const response = await api[method](url, data);
    return response.data;
  };

  const showSuccess = (message: string, duration = 3000) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), duration);
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return {
    loading,
    error,
    success,
    execute,
    apiCall,
    showSuccess,
    clearMessages
  };
};