import * as React from 'react';
import {Animated, Dimensions, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view';
import db from '../config';

export default class SwipeableFlatList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            allNotifications: this.props.allNotifications,
        }
    }

    onSwipeValueChange=swipeData=>{
        console.log("Inside onSwipeValueChange")
        console.log("SwipeDate " + swipeData)
        var allNotifications = this.state.allNotifications;
        const {key,value} = swipeData;
        if(value < -Dimensions.get("window").width){
            const newData = [...allNotifications]
            const prevIndex = allNotifications.findIndex(item=>item.key===key);
            this.updateAsRead(allNotifications[prevIndex]);
            newData.splice(prevIndex,1);
            this.setState({allNotifications: newData});
        }
    }

    updateAsRead=()=>{
        db.collection("allNotifications").doc(notification.docID).update({
            "notificationStatus": "read"
        })
    }

    //keyExtractor=({item,index})=>index.toString();

    renderItem=item=>(
        <Animated.View>
            <ListItem 
            leftElement={<Icon name="book" type="font-awesome" color="#696969"/>}
            title={item.item.itemName}
            titleStyle={{color: "black", fontWeight: "bold"}}
            subtitle={item.item.message}
            bottomDivider/>
        </Animated.View>
    )

    renderHiddenItem=()=>{
        <View style={styles.rowBack}>
            <View style={[styles.rightButton,styles.backRightButton]}>
                <Text style={styles.backTextWhite}></Text>
            </View>
        </View>
    }

    render(){
        return(
            <View style={styles.container}>
                <SwipeListView 
                //disableRightSwipe
                data={this.state.allNotifications}
                renderItem={this.renderItem}
                renderHiddenItem={this.renderHiddenItem}
                rightOpenValue={-Dimensions.get("window").width}
                previewRowKey={"0"}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onSwipeValueChange={this.onSwipeValueChange}/>
            </View>
           
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightblue',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
        fontWeight:'bold',
        fontSize:15
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'lightblue',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    rightButton: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 100,
    },
    backRightButton: {
        backgroundColor: '#29b6f6',
        right: 0,
    },
});


//find 60 and 61 and 62