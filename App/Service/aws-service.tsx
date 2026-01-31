/*
 *   File : aws.js
 *   Author Author URI : https://evoqins.com
 *   Description : aws file upload service
 *   Integrations : axios
 *   Version : v1.1
 */
import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';

type AWSParams = Record<string, string | number>; // key-value pairs for AWS form params
type FileType = {
  uri: string;
  name: string;
  type: string;
};

type AWSResponse = {
  status: 'ok' | false;
  message?: string;
};

const awsService = async (params: AWSParams, file: FileType, url: string): Promise<AWSResponse> => {
  try {
    const AWS_BASE_URL = url;
    const formData = new FormData();

    // append params
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    // append file
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any); // FormData typing in RN needs this cast
    formData.append('Content-Type', file.type);

    // Axios config
    const config = {
      method: 'post',
      url: AWS_BASE_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        'cache-control': 'no-cache',
      },
      data: formData,
      timeout: 60000,
      transformRequest: (data: any) => data,
    };

    const response: AxiosResponse = await axios(config);

    console.log('response:', response);
    return { status: 'ok' };
  } catch (err: any) {
    console.log('AWS ERR:', err);
    return {
      status: false,
      message: 'We are facing issues with our third-party service providers. Please try later.',
    };
  }
};

export default awsService;
