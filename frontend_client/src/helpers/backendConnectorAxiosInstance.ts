import type { AxiosRequestConfig, AxiosError } from 'axios';
import Axios from 'axios';

// Should base off of some url...
export const AXIOS_INSTANCE = Axios.create({ baseURL: 'http://100.102.249.33:8080' });

export const backendConnectorAxiosInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {

  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default backendConnectorAxiosInstance;
