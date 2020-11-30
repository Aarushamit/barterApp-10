import React , {Component } from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import { render } from 'react-dom';
import {Avatar, Icon} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import db from '../config';
import { RFValue } from 'react-native-responsive-fontsize';

export default class CustomSideBarMenu extends Component{

  constructor(){
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      image: "#",
      name: "",
      docID: ""
    }
  }

  selectPicture=async()=>{
    const {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality: 2
    })

    if(!cancelled){
      this.uploadImage(uri,this.state.userID);
    }
  }

  uploadImage=async(uri,imageName)=>{
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase.storage().ref().child("user_profiles/" + imageName);
    return ref.put(blob).then((response)=>{
      this.fetchImage(imageName);
    })
  }

  fetchImage=(imageName)=>{
    var storageRef = firebase.storage().ref().child("user_profiles/" + imageName);
    storageRef.getDownloadURL().then((url)=>{
      this.setState({image: url});
    })
    .catch((error)=>{
      this.setState({image: "#"})
    })
  }

  getUserName=()=>{
    db.collection("users").where("emailID","==",this.state.userID)
    .onSnapshot((snapshot)=>{
      snapshot.forEach((doc)=>{
        this.setState({
          name: doc.data().firstName + " "
        })
      })
    })
  }

  componentDidMount(){
    this.getUserName();
  }

    render(){
        return(
            <View style = {styles.container}>

                <View style={{flex: 0.5, alignItems: "center", backgroundColor: "turquoise"}}>
                  <Avatar rounded
                  size="xlarge"
                  source={{uri: this.state.image}}
                  onPress={()=>this.selectPicture()}
                  containerStyle={styles.containerStyle}
                  showEditButton/>

                  <Text style={{fontSize: RFValue(20), fontWeight: "bold"}}>
                    {this.state.name}
                  </Text>
                </View>

                <View style = {styles.drawerItemsContainer}>
                    <DrawerItems {...this.props} />
                </View>
                <View style={styles.logOutContainer}>
                    <TouchableOpacity style = {styles.logOutButton}
                        onPress={()=>{
                            this.props.navigation.navigate('SignUpLoginScreen');
                            firebase.auth().signOut();
                        }}>
                            <Icon name="logout" type="font-awesome" color="white" size={RFValue(20)}/>
                            {/* <Text style={styles.logOutText}>SIGN OUT</Text> */}
                        </TouchableOpacity>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
      flex:1
    },
    drawerItemsContainer:{
      flex:1
    },
    logOutContainer : {
      flex:0.2,
      justifyContent:'flex-end',
      paddingBottom:30
    },
    logOutButton : {
      height:"5%",
      width:'100%',
      justifyContent:'center',
      padding: 20,
      backgroundColor: "blue"
    },
    logOutText:{
      fontSize: RFValue(25),
      fontWeight:'bold',
      margin: 20,
      color: "white",
      textAlign: "center"
    }
  })
