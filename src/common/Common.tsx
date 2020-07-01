import { REACT_NATIVE_STRIPE_TEST_API_KEY, REACT_NATIVE_STRIPE_API_KEY } from 'react-native-dotenv';

export const getRootUrl = () => {
  let ROOT_URL = '';
  if (process.env.NODE_ENV === 'development') {
    ROOT_URL = 'http://192.168.1.119:3000/api';
  } else {
    ROOT_URL = 'https://lunch-picker-api.herokuapp.com/api';
  }

  return ROOT_URL;
};

export const getStripeApiKey = () => {
  let result = '';

  if (process.env.NODE_ENV === 'development') {
    result = REACT_NATIVE_STRIPE_TEST_API_KEY;
  } else {
    result = REACT_NATIVE_STRIPE_API_KEY;
  }

  return result;
};

export const log = (message: string, item: any) => {
  console.log(message, item);
};
