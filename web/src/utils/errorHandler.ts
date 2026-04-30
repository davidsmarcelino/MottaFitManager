export interface ApiError {
  message: string;
  statusCode?: number;
}

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Erro inesperado. Tente novamente.';
};

export const isUnauthorizedError = (error: any): boolean => {
  return error.response?.status === 401 || error.response?.status === 403;
};