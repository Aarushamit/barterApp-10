import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import DonateScreen from '../screens/DonateScreen';
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen';

export const AppStackNavigator = createStackNavigator({
    DonateScreen: {
        screen: DonateScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    ReceiverDetails: {
        screen: ReceiverDetailsScreen,
        navigationOptions: {
            headerShown: false
        }
    }
},
    {
        initialRouteName: "DonateScreen"
    }
)