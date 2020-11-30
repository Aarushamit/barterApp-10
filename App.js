import React, {Component} from 'react';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {AppDrawerNavigator} from './components/AppDrawerNavigator';
import SignUpLoginScreen from './screens/SignUpLoginScreen';

export default function App() {
  return (
    <AppContainer/>
  );
}


const switchNavigator = createSwitchNavigator({
  SignUpLoginScreen:{screen: SignUpLoginScreen},
  Drawer: {screen: AppDrawerNavigator},
})

const AppContainer =  createAppContainer(switchNavigator);

