import { auth, signOut } from '../lib/auth';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { signOut as logout } from 'next-auth/react';

export default function setupAxiosInterceptor(token?: string) {
  const TIMEOUT = 1 * 60 * 1000;
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_APP_SERVER_URL;
  axios.defaults.timeout = TIMEOUT;

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const onResponseSuccess = (response: AxiosResponse): AxiosResponse =>
    response;
  const onResponseError = (err: AxiosError): Promise<AxiosError> => {
    const status = err.status || (err.response ? err.response.status : 0);
    if (status === 403 || status === 401 || status === 0) {
      if (logout) {
        logout();
      }
    }
    return Promise.reject(err);
  };

  const onRequestSuccess = (config: any) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
}

// Axios to run for server side APIs

export const AXIOS_CLIENT = async () => {
  const TIMEOUT = 1 * 60 * 1000;
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_APP_SERVER_URL;
  axios.defaults.timeout = TIMEOUT;
  const session: any = await auth();

  const onResponseSuccess = (response: AxiosResponse): AxiosResponse =>
    response;
  const onResponseError = (err: AxiosError): Promise<AxiosError> => {
    const status = err.status || (err.response ? err.response.status : 0);
    if (status === 403 || status === 401 || status === 0) {
      signOut();
    }
    return Promise.reject(err);
  };
  if (session && session?.user?.accessToken) {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${session?.user?.accessToken}`;
    const onRequestSuccess = (config: any) => {
      config.headers.Authorization = `Bearer ${session?.user?.accessToken}`;
      return config;
    };
    axios.interceptors.request.use(onRequestSuccess);
  }

  axios.interceptors.response.use(onResponseSuccess, onResponseError);
  return axios;
};
