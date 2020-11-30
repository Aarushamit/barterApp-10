import React, {Component} from 'react';
import {Text, View, StyleSheet,
TouchableOpacity,KeyboardAvoidingView, Alert} from 'react-native';
import db from '../config';
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import {Input} from 'react-native-elements';
import {RFValue} from 'react-native-responsive-fontsize';

export default class RequestScreen extends Component {

    constructor(){
        super();
        this.state = {
            userID: firebase.auth().currentUser.email,
            itemName: "",
            reasonToRequest: '',
            userName: '',
            isRequestStatusActive: false,
            requestedItemName: "",
            requestID: "",
            docID: "",
            userDocID: "",
            itemStatus: ""
        }
    }

    

    getisRequestStatusActive=()=>{
        db.collection("users").where("emailID","==",this.state.userID)
        .get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    isRequestStatusActive:doc.data().isRequestStatusActive,
                    userDocId : doc.id
                  })
            })
        })
    }

    getRequest =()=>{
      db.collection('requestedItems')
        .where('userID','==',this.state.userID)
        .get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            if(doc.data().itemStatus !== "received"){
              this.setState({
                requestID : doc.data().requestID,
                requestedItemName: doc.data().itemName,
                itemStatus: doc.data().itemStatus,
                docID: doc.id
              })
            }
          })
      })}

      componentDidMount(){
        this.getRequest()
        this.getisRequestStatusActive()
      }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }
    
    updateItemisRequestStatusActive=()=>{
        db.collection('requestedItems').doc(this.state.docID)
        .update({
          "itemStatus" : 'received'
        })
   
        db.collection('users').where('emailID','==',this.state.userID).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            db.collection('users').doc(doc.id).update({
              "isRequestStatusActive": false
            })
          })
        })
      }

      sendNotification=()=>{
        db.collection('users').where('emailID','==',this.state.userID).get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            var name = doc.data().firstName
            var lastName = doc.data().lastName
 
            db.collection('allNotifications')
              .where('requestID','==',this.state.requestID).get()
            .then((snapshot)=>{
              snapshot.forEach((doc) => {
                var donorId  = doc.data().donorID
                var itemName =  doc.data().itemName

                db.collection('all_notifications').add({
                  "targetedUserID" : donorId,
                  "message" : name + " " + lastName + " received the book " + bookName ,
                  "notificationStatus" : "unread",
                  "itemName" : itemName
                })
              })
            })
          })
        })
      }
      

      addRequest =async(itemName,reasonToRequest)=>{
        var userID = this.state.userID;
        var randomrequestID = this.createUniqueId();

        db.collection("users").where("emailID","==",this.state.userID).get()
        .then(data=>{
            data.forEach(doc=>{
                this.setState({userName: doc.data().firstName})
            })
        })

        db.collection('requestedItems').add({
            "userID": userID,
            "itemName":itemName,
            "reasonToRequest":reasonToRequest,
            "requestID"  : randomrequestID,
            "userName": this.state.userName,
            "itemStatus" : "requested",
            "date" : firebase.firestore.FieldValue.serverTimestamp()
        })
    
        await  this.getItemRequest()
            db.collection('users').where("emailID","==",userID).get()
            .then()
            .then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    db.collection('users').doc(doc.id).update({
                        isRequestStatusActive: true
                })
                })
            })
            this.setState({
                itemName :'',
                reasonToRequest : '',
                requestID: randomRequestId
            })
            return Alert.alert("Item Requested Successfully")
      }

      receivedItems=(itemName)=>{
        var userId = this.state.userID
        var requestId = this.state.requestID
        db.collection('receivedItems').add({
            "userID": userId,
            "itemName":itemName,
            "requestID"  : requestId,
            "itemStatus"  : "received",
      
        })
      }

    render(){
        if(this.state.isRequestStatusActive !== false){
            return(        
                <View style={{flex: 1, backgroundColor: "lightblue"}}>
                    <MyHeader title="REQUEST  AN  ITEM"  navigation={this.props.navigation}/>

                    <View style={{flex: 1, alignItems: "center"}}>
                          <View style={styles.box}>
                              <Text style={styles.heading}>Item Name</Text>
                              <Text style={styles.text}>{this.state.requestedItemName}</Text>
                          </View>

                          <View style={styles.box}>
                              <Text style={styles.heading}> Item Value </Text>        
                              <Text style={styles.text}>{Math.random().toString(2).substring(7)}</Text>
                        </View>
                        
                        <View style={styles.box}>
                          <Text style={styles.heading}> Item Status </Text>        
                          <Text style={styles.text}>{this.state.itemStatus}</Text>
                        </View>
                    </View>

                  <TouchableOpacity 
                  style={styles.receivedButton}
                  onPress={()=>{
                    this.sendNotification()
                    this.updateItemisRequestStatusActive();
                    this.receivedItems(this.state.requestedItemName)
                  }}>
                  <Text style={{fontWeight: "bold", color: "white", fontSize: RFValue(20), marginTop: 10}}>
                    I received the item!!! jut 
                  </Text>
                  </TouchableOpacity>
                </View>
              )
        }
        
        else {
            return (
                <View style={{flex: 0.8}}>
                    <MyHeader title="REQUEST  AN  ITEM"  navigation={this.props.navigation}/>
                    
                    <KeyboardAvoidingView behavior="margin" enabled style={styles.keyBoardStyle}>
                        <Input containerStyle={styles.inputBox}
                        onChangeText={(text)=>{
                            this.setState({itemName: text});
                        }}
                        value = {this.state.itemName}
                        placeholder="Enter name of the item here" 
                        />
    
                        <Input
                            containerStyle =
                            {[styles.inputBox,{height:300, marginBottom: 10, marginTop: 50}]}
                            multiline = {true}
                            placeholder={"Why do you need the item??"}
                            onChangeText ={(text)=>{
                                this.setState({
                                    reasonToRequest:text
                                })
                            }}
                            value ={this.state.reasonToRequest}
                        />
    
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={()=>{
                                if(this.state.itemName===""){
                                    Alert.alert("Please enter the name of the item");
                                }
                        
                                else if(this.state.reasonToRequest==""){
                                    Alert.alert("Please enter the reason to request");
                                }
                                else {
                                    this.addRequest(this.state.itemName,this.state.reasonToRequest);
                                    this.setState({
                                      itemName :'',
                                      reasonToRequest : '',
                                  })
                                  return Alert.alert("Item Requested Successfully")
                                }
                            }}>
                            <Text style={{fontWeight: "bold", color: "white", fontSize: RFValue(18),}}>REQUEST  </Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    keyBoardStyle : {
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: "lightblue"
      },
      inputBox:{
        width:"75%",
        height:"10%",
        alignSelf:'center',
        borderColor:'grey',
        borderRadius:10,
        borderWidth: 3,
        marginTop: RFValue(100),
        textAlign: "center",
        backgroundColor: "white",
        color: "blue",
        fontWeight: "bold",
        fontSize: RFValue(19),
        marginBottom: RFValue(1),
      },
      button:{
        width:"75%",
        height:50,
        justifyContent:'center',
        alignItems:'center',
        marginBottom: RFValue(200),
        borderRadius: 15,
        backgroundColor:"darkblue",
        marginTop:RFValue(20)
        },
    receivedButton: {
        backgroundColor:"blue",
        width:"60%",
        alignSelf:'center',
        alignItems:'center',
        height:"8%",
        borderRadius: 13,
        marginBottom: 70,
    },
    heading: {
      textDecorationLine: "underline",
      fontWeight: "bold",
      fontSize: RFValue(20),
      textAlign: "center"
    },
    text: {
      fontSize: RFValue(20),
      textAlign: "center",
      marginTop: RFValue(10)
    },
    box: {
      // flex: 0.2, 
      borderColor: "blue", 
      borderWidth: 3, 
      marginTop: RFValue(50),
      width: "70%"
    }
})