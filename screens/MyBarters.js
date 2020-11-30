import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Input,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert} from 'react-native';
import {Card,Listitem,Icon} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontsize';

export default class MyBarters extends Component {
  constructor(){
    super()
    this.state = {
      donorId : firebase.auth().currentUser.email,
      donorName : "",
      allDonations : []
    }
    this.requestRef= null
  }

  static navigationOptions = { header: null };

  getDonorDetails=(donorId)=>{
    db.collection("users").where("emailID","==", donorId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        this.setState({
          "donorName" : doc.data().firstName + " " + doc.data().lastName
        })
      });
    })
  }

  getAllDonations =()=>{
    this.requestRef = db.collection("allBarters").where("donorID" ,'==', this.state.donorId)
    .onSnapshot((snapshot)=>{
      var allDonations = []
      snapshot.docs.map((doc) =>{
        var donation = doc.data()
        donation["docID"] = doc.id
        allDonations.push(donation)
      });
      this.setState({
        allBarters : allDonations
      });
    })
  }

  senditem=(itemDetails)=>{
    if(itemDetails.isRequestStatusActive === "item Sent"){
      var isRequestStatusActive = "Donor Interested"
      db.collection("allBarters").doc(itemDetails.docID).update({
        "isRequestStatusActive" : "Donor Interested"
      })
      this.sendNotification(itemDetails,isRequestStatusActive)
    }
    else{
      var isRequestStatusActive = "item Sent"
      db.collection("allBarters").doc(itemDetails.docID).update({
        "isRequestStatusActive" : "item Sent"
      })
      this.sendNotification(itemDetails,isRequestStatusActive)
    }
  }

  sendNotification=(itemDetails,isRequestStatusActive)=>{
    var requestId = itemDetails.requestID
    var donorId = itemDetails.donorID
    db.collection("allNotifications")
    .where("requestID","==", requestId)
    .where("donorID","==",donorId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        var message = ""
        if(isRequestStatusActive === "item Sent"){
          message = this.state.donorName + " sent you item"
        }else{
           message =  this.state.donorName  + " has shown interest in donating the item"
        }
        db.collection("allNotifications").doc(doc.id).update({
          "message": message,
          "notificationStatus" : "unread",
          "date"                : firebase.firestore.FieldValue.serverTimestamp()
        })
      });
    })
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>(
    <Listitem
      key={i}
      title={item.itemName}
      subtitle={"Requested By : " + item.receiverName +"\nStatus : " + item.notificationStatus}
      leftElement={<Icon name="item" type="font-awesome" color ='#696969'/>}
      titleStyle={{ color: 'black', fontWeight: 'bold' }}
      rightElement={
          <TouchableOpacity
           style={[
             styles.button,
             {
               backgroundColor : item.notificationStatus === "unread" ? "green" : "#ff5722"
             }
           ]}
           onPress = {()=>{
             this.senditem(item)
           }}
          >
            <Text style={{color:'#ffff'}}>{
              item.notificationStatus === "unread" ? "item Sent" : "Send item"
            }</Text>
          </TouchableOpacity>
        }
      bottomDivider
    />
  )


  componentDidMount(){
    this.getDonorDetails(this.state.donorId)
    this.getAllDonations()
  }

  componentWillUnmount(){
    this.requestRef();
  }

    render(){
        return(
          <View style={{flex:1}}>
            <MyHeader navigation={this.props.navigation} title="My Barters"/>
            <View style={{flex:1}}>
              {
                this.state.allDonations.length === 0
                ?(
                  <View style={styles.subtitle}>
                    <Text style={{ fontSize: RFValue(20),}}>List of all Barters</Text>
                  </View>
                )
                :(
                  <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.allDonations}
                    renderItem={this.renderItem}
                  />
                )
              }
            </View>
          </View>
        )
      }   
}

const styles = StyleSheet.create({
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       },
      elevation : 16
    },
    subtitle :{
      flex:1,
      fontSize: RFValue(20),
      justifyContent:'center',
      alignItems:'center'
    }
  })
  