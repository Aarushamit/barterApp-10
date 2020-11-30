import React, {Component} from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontsize';

export default class MyHeader extends Component {
  constructor(props){
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      number: ""
    }
  }

  getNumberOfUnreadNotifications(){
    db.collection("allNotifications")
    .where("notificationStatus","==","unread")
    .where("requesterID","==",this.state.userID)
    .onSnapshot((snapshot)=>{
      var unreadNotifications = snapshot.docs.map((doc)=>doc.data())
      this.setState({number: unreadNotifications.length});
    })
  }

  componentDidMount(){
    this.getNumberOfUnreadNotifications();
  }

  bellIcon = (props) => {
    return (
      <View>
        <Icon name="bell" type="font-awesome" color="white" size={25}
         onPress={()=>{this.props.navigation.navigate("Notifications")}}
        />
         <Badge number={this.state.number}
         containerStyle={{position: "absolute", top:-5, right:-5, color:"lightblue"}}/>
      </View>
    )
  }
  
  render(){
    return (
      <Header
        leftComponent={<Icon name="bars" type="font-awesome" color="lightblue"
                        onPress={()=>
                            this.props.navigation.toggleDrawer()
                        }
                        />}
        centerComponent={{ text: this.props.title, 
                           style: { color: 'white', fontSize:RFValue(20),fontWeight:"bold"} 
                        }}
        rightComponent={<this.bellIcon {...this.props} />}
        backgroundColor = "darkblue"
        navigation={this.props.navigation}
      />
    );
  }

}