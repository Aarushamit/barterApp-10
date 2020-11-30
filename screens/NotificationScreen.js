import React, { Component } from 'react';
import { StyleSheet, View, FlatList,Text } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import SwipeableFlatList from '../components/SwipeableFlatList';
import db from '../config';
import {RFValue} from 'react-native-responsive-fontsize';

export default class NotificationScreen extends Component{
  constructor(props) {
    super(props);

    this.state = {
      userID :  firebase.auth().currentUser.email,
      allNotifications : []
    };

    this.notificationRef = null
  }

  getNotifications=()=>{
    console.log("Getnotifications of Notificationscreen")
    this.requestRef = db.collection("allNotifications")
    .where("notificationStatus", "==", "unread")
    .where("requesterID",'==',this.state.userID)
    .onSnapshot((snapshot)=>{
      var allNotifications =  []
      snapshot.docs.map((doc) =>{
        var notification = doc.data()
        notification["docID"] = doc.id
        allNotifications.push(notification)
      });
      this.setState({
          allNotifications : allNotifications
      });
    })
    console.log("All notifications " + this.state.allNotifications)
  }

  componentDidMount(){
    this.getNotifications()
  }

  componentWillUnmount(){
    this.notificationRef
  }

  keyExtractor = (item, index) => index.toString()

  renderitem = ({item,index}) =>{
      return (
        <ListItem
          key={index}
          leftElement={<Icon name="gift" type="font-awesome" color ='#696969'/>}
          title={item.itemName}
          titleStyle={{ color: 'black', fontWeight: 'bold' }}
          subtitle={item.message}
          bottomDivider
        />
      )
 }

  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <MyHeader title={"NOTIFICATIONS"} navigation={this.props.navigation} />
        </View>
        <View style={{flex:0.9}}>
          {
            this.state.allNotifications.length === 0
            ?(
              <View style={{flex:1, justifyContent:'center', alignitems:'center'}}>
                <Text style={{fontSize:25}}>You have no notifications</Text>
              </View>
            )
            :(<SwipeableFlatList allNotifications={this.state.allNotifications}/>)
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1
  }
})
