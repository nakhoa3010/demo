import axios from 'axios';
import queryString from 'query-string';
import { getAccessTokenFromLocal } from '../clients/storage.helper';

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: 'application/json',
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
  Authorization: `Bearer ${getAccessTokenFromLocal()}`,
};

const axiosUploadClientInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_UPLOAD_API_URL,
  headers,
  paramsSerializer: {
    serialize: (params) => {
      return queryString.stringify(params);
    },
  },
});

axiosUploadClientInstance.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data?.data) {
      return data.data;
    }
    return response.data;
  },
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong'),
);

export { axiosUploadClientInstance };
