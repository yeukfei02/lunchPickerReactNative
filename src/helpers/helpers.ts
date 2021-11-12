import Constants from 'expo-constants';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';

import { REACT_NATIVE_STRIPE_TEST_API_KEY, REACT_NATIVE_STRIPE_API_KEY } from 'react-native-dotenv';

export const getRootUrl = (): string => {
  let rootUrl = '';

  if (process.env.NODE_ENV === 'development') {
    rootUrl = 'http://192.168.1.119:3000/api';
  } else {
    rootUrl = 'https://www.lunch-picker-api.com/api';
  }

  return rootUrl;
};

export const registerForPushNotificationsAsync = async (): Promise<string> => {
  let token = '';

  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
    }

    token = await Notifications.getExpoPushTokenAsync();
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.createChannelAndroidAsync('default', {
      name: 'default',
      sound: true,
      priority: 'max',
      vibrate: [0, 250, 250, 250],
    });
  }

  return token;
};

export const getStripeApiKey = (): string => {
  let result = '';

  if (process.env.NODE_ENV === 'development') {
    result = REACT_NATIVE_STRIPE_TEST_API_KEY;
  } else {
    result = REACT_NATIVE_STRIPE_API_KEY;
  }

  return result;
};
