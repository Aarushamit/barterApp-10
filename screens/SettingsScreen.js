import React,{Component} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {RFValue} from 'react-native-responsive-fontsize';

export default class SettingsScreen extends Component {
    constructor(){
      super();
      this.state={
        emailID   : '',
        firstName : '',
        lastName  : '',
        address   : '',
        contact   : '',
        docId     : ''
      }
    }
  
    getData=()=>{
      var email = firebase.auth().currentUser.email;
      db.collection('users').where('emailID','==',email).get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
        var data = doc.data()
          this.setState({
            emailID   : data.emailID,
            firstName : data.firstName,
            lastName  : data.lastName,
            address   : data.address,
            contact   : data.contact,
            docId     : doc.id
          })
        })
      })
    }
  
    updateData=()=>{
      db.collection('users').doc(this.state.docId)
      .update({
        "firstName": this.state.firstName,
        "lastName" : this.state.lastName,
        "address"   : this.state.address,
        "contact"   : this.state.contact,
        "emailID": this.state.emailID
      })
  
      return Alert.alert("Profile Updated Successfully!!");
    }
  
    componentDidMount(){
      this.getData();
    } 
  
    render(){
      return(
        <View style={styles.container} >
          <MyHeader title="SETTINGS"  navigation={this.props.navigation}/>
          <KeyboardAvoidingView behavior="margin" enabled style={styles.formContainer}>
              <Text style={styles.header}>
                  FIRST NAME ENTER
              </Text>
              <TextInput
                style={styles.inputBox}
                placeholder ={"First Name"}
                maxLength ={8}
                onChangeText={(text)=>{
                  this.setState({
                    firstName: text
                  })
                }}
                value ={this.state.firstName}
              />

            <Text style={styles.header}>
                  LAST NAME
              </Text>
              <TextInput
                style={styles.inputBox}
                placeholder ={"Last Name"}
                maxLength ={8}
                onChangeText={(text)=>{
                  this.setState({
                    lastName: text
                  })
                }}
                  value ={this.state.lastName}
              />

                <Text style={styles.header}>
                  CONTACT ENTER 
              </Text>
              <TextInput
                style={styles.inputBox}
                maxLength ={10}
                placeholder="Contact"
                keyboardType={'numeric'}
                onChangeText={(text)=>{
                  this.setState({
                    contact: text
                  })
                }}
                  value ={this.state.contact}
              />

                <Text style={styles.header}>
                  ADDRESS ENTER
              </Text>
              <TextInput
                style={styles.inputBox}
                placeholder ={"Address"}
                label={"Address"}
                multiline = {true}
                onChangeText={(text)=>{
                  this.setState({
                    address: text
                  })
                }}
                  value ={this.state.address}
              />
              <TouchableOpacity style={styles.button}
                onPress={()=>{
                  this.updateData();
                }}>
                <Text style={styles.buttonText}>SAVE CHANGES</Text>
              </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      )
    }
  }
  
  
  const styles = StyleSheet.create({
    container : {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    formContainer:{
      flex:1,
      width: "100%",
      alignItems: 'center',
      backgroundColor: "lightblue"
    },
    inputBox:{
      width:"75%",
      height:"7%",
      backgroundColor: "white",
      borderColor:'grey',
      borderRadius:10,
      borderWidth:2,
      marginTop: RFValue(5),
      textAlign: "center",
      fontWeight: "bold"
    },
    button:{
      width:"55%",
      height: RFValue(50),
      borderRadius:10,
      backgroundColor:"darkblue",
      marginTop: RFValue(30)
    },
    buttonText:{
      fontSize:18,
      fontWeight:"bold",
      color:"#fff",
      textAlign: "center",
      marginTop: RFValue(10)
    },
    header: {
        fontWeight:"bold",
        fontSize: RFValue(17),
        textAlign: "center",
        marginTop: RFValue(30),
        color: "navy"
    },
  })
  