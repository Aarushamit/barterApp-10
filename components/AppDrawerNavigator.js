import React, {Component} from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import {Image} from 'react-native'; 
import SettingsScreen from '../screens/SettingsScreen';
import MyBarters from '../screens/MyBarters';
import NotificationsScreen from '../screens/NotificationScreen';
import MyReceivedItemsScreen from '../screens/MyReceivedItemsScreen';
import {Icon} from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: AppTabNavigator,
        navigationOptions: {
        title: "HOME ACTIVITY",
        drawerIcon: <Icon name="home" type="font-awesome" />
    }},
    MyBarters: {
        screen: MyBarters,
        navigationOptions: {
        title: "MY BARTERS",
        drawerIcon: <Icon name="gift" type="font-awesome" />
    }},
    Notifications: {
        screen: NotificationsScreen,
        navigationOptions: {
            title: "NOTIFICATIONS TO",
            drawerIcon: <Icon name="bell" type="font-awesome" />
    }},
    MyItems: {
        screen: MyReceivedItemsScreen,
        navigationOptions: {
            title: "MY RECEIVED ITEMS DUH",
            drawerIcon: <Icon name="gift" type="font-awesome" />
    }},
    Settings: {
        screen: SettingsScreen,
        navigationOptions: {
            title: "SETTINGS",
            drawerIcon: <Icon name="settings" type="ant-design" />
    }},
},
{
    contentComponent: CustomSideBarMenu
},
{
    initialRouteName: "Home ",
}
)