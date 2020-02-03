/**
 * Application REST Central Service Class.
 * It handle all communication with the Backend EndPoints.
 * Requests and Response
 * interceptors to
 */
import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { createHashHistory } from 'history';

import { getBearerToken } from '../store/auth/AuthContext';

// Generic Query object to set multiple request parameters
export interface QueryParams {
  params: { [k: string]: string | number | boolean };
}

/**
 * Default format how data will be send from backend
 */
export interface DataResponse {
  data: object;
  messages: string[];
  errors: string[];
}

const ERROR_403 = [
  'Operation not allowed in the Server anymore.',
  'Your user lost the necessary permissions to perform this operation.',
  'Contact the System Administrator.',
];

/**
 * REST API Service class
 * @author Leonardo Otoni
 */
class Service {
  private readonly service: AxiosInstance;

  constructor() {
    this.service = axios.create({
      baseURL: `http://${process.env.REACT_APP_BACKEND_HOST}`,
    });
    this.service.interceptors.response.use(this.successHandler, this.errorHandler);
    this.service.interceptors.request.use(this.requestHandler, this.errorHandler);
  }

  successHandler = async (response: AxiosResponse) => response;

  /**
   * Default error handler interceptor
   * Http errors 500, 401, 403 and 404 are managed from here.
   * All other errors are send back to the application.
   */
  errorHandler = async (error: AxiosError) => {
    const { response } = error;
    if (response) {
      const { status } = response;
      switch (status) {
        case 401:
          createHashHistory().push('/logout');
          break;
        case 403:
          response.data = { ...response.data, errors: ERROR_403 };
          break;
        case 404:
          createHashHistory().push('/404');
          break;
        case 500:
          createHashHistory().push('/500');
          break;
        default:
          break;
      }

      return Promise.reject(response.data);
    }

    return Promise.reject(error);
  };

  /**
   * Set Authenticatipon Token by default if exists for all outcoming Requests
   */
  requestHandler = (config: AxiosRequestConfig) => {
    const token = getBearerToken();
    const newConfig = { ...config };
    if (token) {
      newConfig.headers = { ...newConfig.headers, authorization: `Bearer ${token}` };
    }

    return newConfig;
  };

  // Default Get Service function
  async get(url: string, params?: QueryParams): Promise<DataResponse> {
    const response = params ? await this.service.get(url, params) : await this.service.get(url);
    return response.data;
  }

  // Default Post Service function
  async post(url: string, bodyData: object): Promise<DataResponse> {
    const response = await this.service.post(url, bodyData);
    return response.data as DataResponse;
  }

  // Default Put Service function
  async put(url: string, bodyData: object): Promise<DataResponse> {
    const response = await this.service.put(url, bodyData);
    return response.data;
  }

  // Default Delete Service function
  async delete(url: string): Promise<void> {
    await this.service.delete(url);
  }
}

export default new Service();
