import React, { useEffect } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import * as Sentry from 'sentry-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_NATIVE_SENTRY_DSN } from 'react-native-dotenv';
import _ from 'lodash';
import axios from 'axios';
import { getRootUrl, registerForPushNotificationsAsync } from './src/helpers/helpers';

import MainView from './src/components/mainView/MainView';

import './i18n';

const rootUrl = getRootUrl();

// sentry
Sentry.init({
  dsn: REACT_NATIVE_SENTRY_DSN || (process.env.REACT_NATIVE_SENTRY_DSN ? process.env.REACT_NATIVE_SENTRY_DSN : ''),
  enableInExpoDevelopment: true,
  debug: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? true : false, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ed1f30',
    accent: '#2b76f0',
  },
};

function App(): JSX.Element {
  useEffect(() => {
    getPushNotificationToken();
  }, []);

  const getPushNotificationToken = async () => {
    const pushNotificationToken = await registerForPushNotificationsAsync();
    console.log('pushNotificationToken = ', pushNotificationToken);
    storeAsyncStorageData('@pushNotificationToken', pushNotificationToken);
    addPushNotificationTokenToServer(pushNotificationToken);
  };

  const storeAsyncStorageData = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log('error = ', e.message);
    }
  };

  const addPushNotificationTokenToServer = async (pushNotificationToken: string) => {
    const response = await axios.post(
      `${rootUrl}/expo/add-push-notification-token-to-server`,
      {
        pushNotificationToken: pushNotificationToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!_.isEmpty(response)) {
      console.log('response = ', response);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <MainView />
    </PaperProvider>
  );
}

export default App;
