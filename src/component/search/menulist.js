import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, TouchableOpacity, StatusBar} from 'react-native';


export default class MenuList extends React.Component {

  render() {
    return (
        <View 
        style={styles.container}>
        <StatusBar barStyle = 'dark-content'>
        </StatusBar>

        <TouchableOpacity style={styles.buttonsearch}
        >
            <Text style={styles.searchText}
            onPress={this._submitValue}>Frame ID</Text>
        </TouchableOpacity>
        <Text> </Text>
        <TouchableOpacity style={styles.buttonsearch}
        >
            <Text style={styles.searchText}
            onPress={this._submitValue}>Frame Unit ID</Text>
        </TouchableOpacity>
        <Text> </Text>
        <TouchableOpacity style={styles.buttonsearch}
        >
            <Text style={styles.searchText}
            onPress={this._submitValue}>NE ID</Text>
        </TouchableOpacity>
        <Text> </Text>
        </View>
    );
}
state = {
    searchinput: ''
  }

  _submitValue = () => {
    const navigate = this.props.navigation;
      navigate('Search') ;
      console.log('Test')  
   }
  
}



const styles = StyleSheet.create({
    container: {
    padding:20
      },
      searchinput:{
          height:40,
          backgroundColor:'rgba(255,0,0,0.2)',
          marginBottom:10,
          color:'white',
          paddingHorizontal:25,
          fontSize:15,
          textAlign:'center',
          borderRadius:10
      },
      searchText:{
        textAlign:'center',
        fontSize:15,
        fontWeight:'bold',
        color:'#FFFF',
      },
      buttonsearch:{
        backgroundColor:'#0652DD',
        paddingVertical:10,
        borderRadius:50
      },
    });