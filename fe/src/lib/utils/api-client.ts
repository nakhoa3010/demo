import axios from 'axios';
import queryString from 'query-string';
import { getAccessTokenFromLocal } from '../clients/storage.helper';

export const headers: Readonly<Record<string, string | boolean>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
  Authorization: `Bearer ${getAccessTokenFromLocal()}`,
};

const axiosClientInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers,
  paramsSerializer: {
    serialize: (params) => {
      return queryString.stringify(params);
    },
  },
});

axiosClientInstance.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data?.data) {
      return data.data;
    }
    return response.data;
  },
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong'),
);

export { axiosClientInstance };
