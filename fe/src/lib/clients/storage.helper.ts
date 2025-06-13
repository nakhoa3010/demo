const isClient = typeof window !== 'undefined';

export const setAccessTokenToLocal = (token: string) => {
  if (isClient) {
    localStorage.setItem('accessToken', token);
  }
};

export const getAccessTokenFromLocal = () => {
  if (isClient) {
    return localStorage.getItem('accessToken');
  }
  return '';
};

export const deleteAccessTokenFromLocal = () => {
  if (isClient) {
    localStorage.removeItem('accessToken');
  }
};
