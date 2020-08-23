import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import * as Sentry from 'sentry-expo';
import { REACT_NATIVE_SENTRY_DSN } from 'react-native-dotenv';

import MainView from './src/components/mainView/MainView';

import './i18n';

Sentry.init({
  dsn: REACT_NATIVE_SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: true,
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
  return (
    <PaperProvider theme={theme}>
      <MainView />
    </PaperProvider>
  );
}

export default App;
