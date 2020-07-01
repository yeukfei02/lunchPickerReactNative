import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import * as Sentry from 'sentry-expo';
import { REACT_NATIVE_SENTRY_DSN } from 'react-native-dotenv';
import { useTranslation } from 'react-i18next';

import Home from './src/components/home/Home';
import RandomFood from './src/components/randomFood/RandomFood';
import Favourites from './src/components/favourites/Favourites';
import Settings from './src/components/settings/Settings';
import ContactUs from './src/components/contactUs/ContactUs';

import './i18n';

Sentry.init({
  dsn: REACT_NATIVE_SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: true,
});

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ed1f30',
    accent: '#2b76f0',
  },
};

function App() {
  const { t } = useTranslation();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let icon = null;

              switch (route.name) {
                case 'Home':
                case '主頁':
                  icon = focused ? <MaterialIcons name={'home'} size={size} color={color} /> : <MaterialIcons name={'home'} size={size} color={color} />;
                  break;
                case 'Random food':
                case '隨機食物':
                  icon = focused ? <MaterialCommunityIcons name={'food'} size={size} color={color} /> : <MaterialCommunityIcons name={'food'} size={size} color={color} />;
                  break;
                case 'Favourites':
                case '我的最愛':
                  icon = focused ? <MaterialIcons name={'favorite'} size={size} color={color} /> : <MaterialIcons name={'favorite'} size={size} color={color} />;
                  break;
                case 'Settings':
                case '設定':
                  icon = focused ? <MaterialIcons name={'settings'} size={size} color={color} /> : <MaterialIcons name={'settings'} size={size} color={color} />;
                  break;
                case 'Contact us':
                case '聯繫我們':
                  icon = focused ? <AntDesign name={'questioncircle'} size={size} color={color} /> : <AntDesign name={'questioncircleo'} size={size} color={color} />;
                  break;
                default:

              }

              return icon;
            },
          })}
          tabBarOptions={{
            activeTintColor: '#ed1f30',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name={t('home')} component={Home} />
          <Tab.Screen name={t('randomFood')} component={RandomFood} />
          <Tab.Screen name={t('favourites')} component={Favourites} />
          <Tab.Screen name={t('settings')} component={Settings} />
          <Tab.Screen name={t('contactUs')} component={ContactUs} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
