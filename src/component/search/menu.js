import React from 'react';
import { StyleSheet, Text, View, Image,KeyboardAvoidingView,TouchableOpacity, AsyncStorage} from 'react-native';
import { Header } from 'react-native-elements';
import MenuList from './menulist';

export default class SearchInput extends React.Component {
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
    
        <View style={styles.searchcontainer}>
                <Text style={styles.keytext}>Start With</Text>
                <MenuList navigation={navigate}/>
                </View>
                <View style={styles.searchcontainer}>
                <Text style={styles.keytext}></Text>
                <Text style={styles.keytext}></Text>
                </View>
                <View style={styles.qrcontainer}>
                <Text onPress={this._logout}>Logout</Text>
                </View>
      </View>
    );
  }
  _logout= () => {
 
    AsyncStorage.clear();
    this.props.navigation.navigate('Login')
      
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC312',
    justifyContent: 'center',
  },
  searchcontainer: {
    justifyContent: 'center',
    backgroundColor: '#FFC312',
    marginBottom:20,
},
qrcontainer: {
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#FFC312',
    marginBottom:20,
},
 keytext:{
     textAlign:'center',
     fontSize:25,
     fontWeight:'bold'

 },
 qricon:{
    height:100,
    width:100,
    alignItems: 'center',
    marginBottom:5,
}
});