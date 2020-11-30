import React, {Component} from 'react';
import {Text, View, StyleSheet, Input, 
TouchableOpacity,KeyboardAvoidingView, Alert} from 'react-native';
import db from '../config';
import {Header,Icon,Card} from 'react-native-elements';
import firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontsize';

export default class ReceiverDetailsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            userID: firebase.auth().currentUser.email,
            receiverId: this.props.navigation.getParam("details")["userID"],
            requestID: this.props.navigation.getParam("details")["requestID"],
            itemName: this.props.navigation.getParam("details")["itemName"],
            reasonForRequesting: this.props.navigation.getParam("details")["reasonToRequest"],
            receiverName: "",
            receiverContact: "",
            receiverAddress: "",
            receiverRequestDocId: "",
            userName: ""
        }
    }

    getReceiverDetails=()=>{
        db.collection("users").where("emailID","==",this.state.receiverId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiverName: doc.data().firstName,
                    receiverContact: doc.data().contact,
                    receiverAddress: doc.data().address,
                })
            })
        })
        db.collection("users").where("emailID","==",this.state.userID).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    userName: doc.data().firstName,
                })
            })
        })
    }

    componentDidMount(){
        this.getReceiverDetails();
    }

    updateitemStatus=()=>{
        db.collection("allBarters").add({
            itemName: this.state.itemName,
            requestID: this.state.requestID,
            requestedBy: this.state.receiverName,
            donorID: this.state.receiverId,
            isRequestStatusActive: "Donor Interested"
        })
    }

    addNotification=()=>{
        var message = this.state.userName + " has shown interest in donating the item";
        db.collection("allNotifications").add({
            "requesterID": this.state.receiverId,
            "donorID": this.state.userID,
            "requestID": this.state.requestID,
            "itemName": this.state.itemName,
            "date": firebase.firestore.FieldValue.serverTimestamp(),
            "notificationStatus": "unread",
            "message": message,
            "receiverName": this.state.receiverName,
            "donorName": this.state.userName
        })
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={{flex: 0.1}}>
                    <Header 
                    leftComponent={<Icon name="arrow-left" type="feather"
                                    color="#696969" 
                                    onPress={()=>this.props.navigation.goBack()}/>}
                    centerComponent={{text: "DONATE ITEMS",
                                    style: {color: "white", fontSize: RFValue(20), fontWeight: "bold"}}}
                    backgroundColor = "darkblue"/>
                </View>

                <View style={{flex: 0.8, 
                                marginTop: RFValue(80), 
                                backgroundColor: "lightblue", 
                                borderWidth: 3,
                                margin: 10,
                                borderRadius: 10}}>
                    <Text style={{fontWeight: "bold", fontSize: RFValue(18), textAlign: "center"}}>
                        ITEM DESCRIPTION
                    </Text>
                    <Card>
                        <Text style={{fontWeight: "bold"}}>NAME: {this.state.itemName}</Text>
                    </Card>
                    <Card>
                        <Text style={{fontWeight: "bold"}}>REASON: {this.state.reasonForRequesting}</Text>
                    </Card>
                </View>

                <View 
                style={styles.box}>
                    <Text 
                    style={{fontWeight: "bold", fontSize: RFValue(18), textAlign: "center"}}>
                        RECEIVER INFORMATION
                    </Text>
                    <Card>
                            <Text style={{fontWeight: "bold"}}>NAME: {this.state.receiverName}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight: "bold"}}>CONTACT: {this.state.receiverContact}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight: "bold"}}>ADDRESS: {this.state.receiverAddress}</Text>
                        </Card>
                </View>

                <View style={styles.buttonContainer}>
                    {
                        this.state.receiverId !== this.state.userID
                        ? (
                            <TouchableOpacity style={styles.button}
                            onPress={()=>{
                            this.updateitemStatus();
                            this.addNotification();
                            this.props.navigation.navigate("MyBarters");
                            }}>
                                <Text style={{fontWeight: "bold", color: "white", textAlign: "center"}}>
                                    I WANT TO DONATE THIS
                                </Text>
                            </TouchableOpacity>
                        )
                        : null
                    }
                    
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    buttonContainer : {
      flex:0.3,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:200,
      height:50,
      marginTop: RFValue(5),
      justifyContent:'center',
      alignItems : 'center',
      borderRadius: 15,
      backgroundColor: 'darkblue',
    },
    box: {
        flex: 1, 
        marginTop: RFValue(40), 
        backgroundColor: "lightblue", 
        borderWidth: 3,
        margin: 10,
        borderRadius: 10
    }
  })