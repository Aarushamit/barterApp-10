import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';
import {RFValue} from 'react-native-responsive-fontsize';

export default class DonateScreen extends Component{
  constructor(){
    super()
    this.state = {
      requestedItemsList : []
    }
  this.requestRef= null
  }

  getRequestedItemList =()=>{
    this.requestRef = db.collection("requestedItems")
    .onSnapshot((snapshot)=>{
      var requestedItemList = snapshot.docs.map(document => document.data());
      this.setState({
        requestedItemsList : requestedItemList
      });
    })
  }

  componentDidMount(){
    this.getRequestedItemList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.itemName}
        subtitle={item.reasonToRequest}
        titleStyle={{ color: 'black', fontWeight: 'bold', fontSize: RFValue(20), }}
        subtitleStyle={{ color: 'black', fontSize: RFValue(15), }}
        rightElement={
            <TouchableOpacity style={styles.button}
            onPress={()=>{
              this.props.navigation.navigate("ReceiverDetails",{"details":item});
            }}>
              <Text style={{color:'#ffff', fontWeight: "bold"}}>VIEW  </Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="DONATE AN ITEM" navigation={this.props.navigation}/>
        <View style={{flex:1, backgroundColor: "lightblue"}}>
          {
            this.state.requestedItemsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: RFValue(20),}}>There are currently no requests!!</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.requestedItemsList}
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
  subContainer:{
    flex:1,
    fontSize: RFValue(20),
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: "lightblue"
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"blue",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})