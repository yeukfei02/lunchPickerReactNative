import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import Home from './src/components/home/Home';
import RandomFood from './src/components/randomFood/RandomFood';
import Favourites from './src/components/favourites/Favourites';
import Settings from './src/components/settings/Settings';
import ContactUs from './src/components/contactUs/ContactUs';

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
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let icon = null;

              switch (route.name) {
                case 'Home':
                  icon = focused ? <MaterialIcons name={'home'} size={size} color={color} /> : <MaterialIcons name={'home'} size={size} color={color} />;
                  break;
                case 'Random food':
                  icon = focused ? <MaterialCommunityIcons name={'food'} size={size} color={color} /> : <MaterialCommunityIcons name={'food'} size={size} color={color} />;
                  break;
                case 'Favourites':
                  icon = focused ? <MaterialIcons name={'favorite'} size={size} color={color} /> : <MaterialIcons name={'favorite'} size={size} color={color} />;
                  break;
                case 'Settings':
                  icon = focused ? <MaterialIcons name={'settings'} size={size} color={color} /> : <MaterialIcons name={'settings'} size={size} color={color} />;
                  break;
                case 'Contact us':
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
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Random food" component={RandomFood} />
          <Tab.Screen name="Favourites" component={Favourites} />
          <Tab.Screen name="Settings" component={Settings} />
          <Tab.Screen name="Contact us" component={ContactUs} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
