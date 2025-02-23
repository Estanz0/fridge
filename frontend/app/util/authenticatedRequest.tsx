/// <reference types="vite/client" />
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const authenticatedGetRequest = async (
  path: string,
  params: any = {},
  options: AxiosRequestConfig = {},
): Promise<AxiosResponse> => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }
  params.token = token;

  const config: AxiosRequestConfig = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
    params: params,
  };

  const url = `${backendUrl}${path}`;

  try {
    const response = await axios(url, config);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Request failed: ${error.message}`);
    } else {
      throw new Error("Request failed");
    }
  }
};

const authenticatedPostRequest = async (
  path: string,
  data: any,
  params: any = {},
  options: AxiosRequestConfig = {},
): Promise<AxiosResponse> => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }
  params.token = token;

  const config: AxiosRequestConfig = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
    params: params,
  };

  const url = `${backendUrl}${path}`;

  try {
    const response = await axios.post(url, data, config);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Request failed: ${error.message}`);
    } else {
      throw new Error("Request failed");
    }
  }
};

const unauthenticatedGetRequest = async (
  path: string,
  options: AxiosRequestConfig = {},
): Promise<AxiosResponse> => {
  const url = `${backendUrl}${path}`;
  try {
    const response = await axios(url, options);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Request failed: ${error.message}`);
    } else {
      throw new Error("Request failed");
    }
  }
};

const unauthenticatedPostRequest = async (
  path: string,
  data: any,
  options: AxiosRequestConfig = {},
): Promise<AxiosResponse> => {
  const url = `${backendUrl}${path}`;
  try {
    const response = await axios.post(url, data, options);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Request failed: ${error.message}`);
    } else {
      throw new Error("Request failed");
    }
  }
};

export default {
  authenticatedGetRequest,
  authenticatedPostRequest,
  unauthenticatedGetRequest,
  unauthenticatedPostRequest,
};
