import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

import Home from '../home/Home';
import RandomFood from '../randomFood/RandomFood';
import Favourites from '../favourites/Favourites';
import Settings from '../settings/Settings';
import ContactUs from '../contactUs/ContactUs';

import RestaurantDetails from '../restaurantDetails/RestaurantDetails';

function TabView() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon = null;

          switch (route.name) {
            case 'Home':
            case '主頁':
              icon = focused ? (
                <MaterialIcons name={'home'} size={size} color={color} />
              ) : (
                <MaterialIcons name={'home'} size={size} color={color} />
              );
              break;
            case 'Random food':
            case '隨機食物':
              icon = focused ? (
                <MaterialCommunityIcons name={'food'} size={size} color={color} />
              ) : (
                <MaterialCommunityIcons name={'food'} size={size} color={color} />
              );
              break;
            case 'Favourites':
            case '我的最愛':
              icon = focused ? (
                <MaterialIcons name={'favorite'} size={size} color={color} />
              ) : (
                <MaterialIcons name={'favorite'} size={size} color={color} />
              );
              break;
            case 'Settings':
            case '設定':
              icon = focused ? (
                <MaterialIcons name={'settings'} size={size} color={color} />
              ) : (
                <MaterialIcons name={'settings'} size={size} color={color} />
              );
              break;
            case 'Contact us':
            case '聯繫我們':
              icon = focused ? (
                <AntDesign name={'questioncircle'} size={size} color={color} />
              ) : (
                <AntDesign name={'questioncircleo'} size={size} color={color} />
              );
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
  );
}

function StackView() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
    </Stack.Navigator>
  );
}

function MainView() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator drawerStyle={{ width: 0 }}>
        <Drawer.Screen name="TabView" component={TabView} />
        <Drawer.Screen name="StackView" component={StackView} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default MainView;
