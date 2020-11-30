import React, {Component} from 'react';
import {Text,View, TouchableOpacity, StyleSheet, 
  Alert, KeyboardAvoidingView, Image,
ScrollView, Modal} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import {Header, Input} from 'react-native-elements';
import {RFValue} from 'react-native-responsive-fontsize';

export default class SignUpLoginScreen extends Component {
    constructor(){
        super();
        this.state = {
            emailID: '',
            password: '',
            isModalVisible: false,
            firstName: '',
            lastName: '',
            contatc: '',
            address: '',
            confirmPassword: ''
        }
    }

    signUp=(emailID,password)=>{
        firebase.auth().createUserWithEmailAndPassword(emailID,password)
        .then((response)=>{
            return Alert.alert("Your account has been created successfully!!");
        })
        .catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            return Alert.alert(errorMessage);
        })
    }

    login=(emailID,password)=>{
        firebase.auth().signInWithEmailAndPassword(emailID,password)
        .then(()=>{
            this.props.navigation.navigate("Request");
        })
        .catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            return Alert.alert(errorMessage);
        })
    }

    userSignUp=(username,password,confirmPassword)=>{
        if(password !== confirmPassword){
            return Alert.alert("The two passwords you entered don't match!!");
        }
        else {
            firebase.auth().createUserWithEmailAndPassword(username,password)
            .then((response)=>{
                db.collection("users").add({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    contact: this.state.contact,
                    address: this.state.address,
                    emailID: this.state.emailID,
                    isRequestStatusActive: false
                })

                return  Alert.alert(
                    'User Added Successfully',
                    '',
                    [
                      {text: 'OK', onPress: () => this.setState({"isModalVisible" : false})},
                    ]
                );
            })
            .catch(function(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                return Alert.alert(errorMessage);
            })
        }
    }

    showModal=()=>{
        return(
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.isModalVisible}
              >
              <View style={styles.modalContainer}>
                <ScrollView style={{width:'100%'}}>
                  <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
                  <Text style={styles.modalTitle}>Register here!!   </Text>
                  <Input
                    containerStyle={styles.formInput}
                    placeholder ={"First Name"}
                    maxLength ={8}
                    onChangeText={(text)=>{
                      this.setState({
                        firstName: text
                      })
                    }}
                  />
                  <Input
                    containerStyle={styles.formInput}
                    placeholder ={"Last Name"}
                    maxLength ={8}
                    onChangeText={(text)=>{
                      this.setState({
                        lastName: text
                      })
                    }}
                  />
                  <Input
                    containerStyle={styles.formInput}
                    placeholder ={"Contact"}
                    maxLength ={10}
                    keyboardType={'numeric'}
                    onChangeText={(text)=>{
                      this.setState({
                        contact: text
                      })
                    }}
                  />
                  <Input
                    containerStyle={styles.formInput}
                    placeholder ={"Address"}
                    multiline = {true}
                    onChangeText={(text)=>{
                      this.setState({
                        address: text
                      })
                    }}
                  />
                  <Input
                    containerStyle={styles.formInput}
                    placeholder ={"Email"}
                    keyboardType ={'email-address'}
                    onChangeText={(text)=>{
                      this.setState({
                        emailID: text
                      })
                    }}
                  />
                  <Input
                  containerStyle={styles.formInput}
                    placeholder ={"Password"}
                    secureTextEntry = {true}
                    onChangeText={(text)=>{
                      this.setState({
                        password: text
                      })
                    }}
                  />
                  <Input
                    containerStyle={styles.formInput}
                    placeholder ={"Confrim Password"}
                    secureTextEntry = {true}
                    onChangeText={(text)=>{
                      this.setState({
                        confirmPassword: text
                      })
                    }}
                  />
                  <View style={styles.modalBackButton}>
                    <TouchableOpacity
                      style={styles.registerButton}
                      onPress={()=>{
                        if(this.state.firstName===""){
                              return Alert.alert("Please enter your name!!");
                        }
                        if(this.state.lastName===""){
                            return Alert.alert("Please enter your name!!");
                        } 
                        if(this.state.contact===""){
                            return Alert.alert("Please enter your contact!!");
                        }
                        if(this.state.address===""){
                            return Alert.alert("Please enter your address!!");
                        }
                        if(this.state.confirmPassword===""){
                            return Alert.alert("Please enter all your password!!");
                        }
                        else {
                            this.userSignUp(this.state.emailID, this.state.password, this.state.confirmPassword)
                        }
                      }}
                    >
                    <Text style={styles.registerButtonText}>Register    </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalBackButton}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={()=>this.setState({"isModalVisible":false})}
                    >
                    <Text style={styles.registerButtonText}>Cancel  </Text>
                    </TouchableOpacity>
                  </View>
                  </KeyboardAvoidingView>
                </ScrollView>
              </View>
            </Modal>
        )
    }

    render(){
        return(
            <KeyboardAvoidingView style={styles.container} behavior="margin" enabled>
                {
                    this.showModal()
                }
                <Header
                    backgroundColor={'#0000cc'}
                    centerComponent={{
                        text: 'BARTER SYSTEM',
                        style: { color: '#fff', fontSize: RFValue(25), fontWeight: "bold"},
                    }}
                    navigation={this.props.navigation}
                />

                <Text style={styles.info1}>Welcome to    </Text>
                <Text style={styles.info1}> Barter System!!  </Text>

                <View>
                   <Input
                        containerStyle={styles.loginBox}
                        placeholder="Username"
                        keyboardType ='email-address'
                        onChangeText={(text)=>{
                        this.setState({
                            emailID: text
                        })
                        }}
                    />

                    <Input 
                        containerStyle={styles.loginBox}
                        placeholder='Password'
                        secureTextEntry = {true}
                        onChangeText={(text)=>{
                            this.setState({password: text})
                        }}
                    />

                    <TouchableOpacity
                        style={styles.buttons}
                        onPress={()=>{
                            this.login(this.state.emailID,this.state.password);
                            this.setState({emailID: "", password: ""});
                        }}
                    >
                        <Text style={styles.buttonText}>LOGIN</Text>
                    </TouchableOpacity>

                    <Text style={styles.info}>Create an Account</Text>

                    <TouchableOpacity
                        style={styles.buttons}
                        onPress={()=>{
                            this.setState({emailID: "", password: "", isModalVisible: true});
                        }}
                    >
                        <Text style={styles.buttonText}>SIGN UP</Text>
                    </TouchableOpacity>

                    <Image source={require("../assets/head.jph.jpg")} 
                    style={{width: 280, height: "30%", alignSelf: "center", marginTop: 5}}/>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "lightblue"
    },
    loginBox:{
        width: 300,
        height: "8%",
        borderWidth: 3,
        backgroundColor: "white",
        borderRadius: 10,
        borderColor : '#000066',
        fontSize: RFValue(20),
        margin:15,
        paddingLeft:10,
        alignSelf: "center",
        textAlign: "center",
        fontWeight: "bold"
      },
    buttons: {
        backgroundColor: "#0080ff",
        marginTop: RFValue(20),
        width: (200),
        height: "6%",
        borderWidth: 1.5,
        marginBottom: RFValue(10),
        borderRadius: 15,
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: RFValue(18),
        textAlign: 'center',
        marginTop: RFValue(7),
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    info: {
        color: "darkblue",
        fontWeight: "bold",
        textAlign: 'center',
        fontSize: RFValue(20),
        marginTop: RFValue(20),
    },
    info1: {
        color: "darkblue",
        fontWeight: "bold",
        textAlign: 'center',
        fontSize: RFValue(25),
        marginTop: RFValue(8)
    },
    formInput:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop: RFValue(20),
        padding: RFValue(10)
      },
      modalTitle :{
        justifyContent:'center',
        alignSelf:'center',
        fontSize:30,
        color:'#000066',
        margin:30,
        fontWeight: "bold"
      },
      modalContainer:{
        flex:1,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#ffff",
        marginRight:30,
        marginLeft : 30,
        marginTop: RFValue(80),
        marginBottom: RFValue(80),
      },
      formInput:{
        width:"75%",
        height:"6%",
        alignSelf:'center',
        borderColor:'#000099',
        borderRadius:10,
        borderWidth:2,
        marginTop: RFValue(20),
        padding: RFValue(10),
        textAlign: "center",
        fontWeight: "bold"
      },
      registerButton:{
        width: RFValue(200),
        height: RFValue(40),
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderRadius:10,
        marginTop: RFValue(30),
        alignSelf: "center"
      },
      registerButtonText:{
        color:'#ff5722',
        fontSize:15,
        fontWeight:'bold'
      },
      cancelButton:{
        width:200,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderRadius:10,
        marginTop: RFValue(30),
        alignSelf: "center"
      },
})