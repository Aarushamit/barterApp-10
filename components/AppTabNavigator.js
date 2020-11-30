import React, {Component} from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {AppStackNavigator} from '../components/AppStackNavigator';
import RequestScreen from '../screens/RequestScreen';
import {Image} from 'react-native';

export const AppTabNavigator = createBottomTabNavigator({
  Donate : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarLabel : "Donate Items",
      tabBarIcon : <Image source={require("../assets/donate.jpg")} style={{width:30, height:30}}/>,
    }
  },
  Request: {
    screen: RequestScreen,
    navigationOptions :{
      tabBarLabel : "Request an Item",
      tabBarIcon : <Image source={require("../assets/request.jpg")} style={{width:30, height:30}}/>,
    }
  }
});
