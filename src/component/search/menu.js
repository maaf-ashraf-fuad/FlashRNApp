import React from 'react';
import { StyleSheet, Text, View, Image,KeyboardAvoidingView,TouchableOpacity, AsyncStorage, Alert} from 'react-native';
import { Header } from 'react-native-elements';
import MenuList from './menulist';
import { Button } from '../common';

export default class SearchInput extends React.Component {
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={{ flex:1, backgroundColor:'#FFC312', justifyContent: 'space-between', flexDirection: 'column'}} >
        <Image source= { require('../../img/bg2.png')} style= {{ position:'absolute', top: 68, resizeMode: 'cover'}} />
        <Header
          backgroundColor='#d03c1b'
          outerContainerStyles={{ borderBottomWidth:0 }}
          //leftComponent={{ icon: 'back', color: '#fff' }}
          centerComponent={<Image source={ require('../../img/flash.png') }
          style={{ resizeMode: 'stretch', height: 20, width: 100 }}/>}
          //rightComponent={{ icon: 'home', color: '#fff' }}
          //rightComponent={ this.renderHeaderHome() }
        />
        <View style={{ flex:1, justifyContent: 'space-between', flexDirection: 'column'}} >
          <View style={{ flex:1 }} />
          <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'space-between' }} >
            <Text style={styles.keytext}>Start With</Text>
            <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'space-around', paddingLeft: 30, paddingRight: 30}} >
              <Button border buttonText='Frame' onPress={() => this.props.navigation.navigate('Search', {
                 mode: 'Menu',
                 level: 'Frame'
               })}/>
               <Button border buttonText='Shelf' onPress={() => this.props.navigation.navigate('Search', {
                  mode: 'Menu',
                  level: 'Shelf'
                })}/>
                {/*<Button border buttonText='NE Id' onPress={() => this.props.navigation.navigate('Search', {
                   mode: 'Menu',
                   level: 'NE Id'
                 })}/>*/}
                 <Button border buttonText='NE Id' onPress={() => Alert.alert ('FLASH', 'This function is not yet implemented :(')}/>
            </View>
          </View>
                 <Button border buttonText='Logout' onPress={() => Alert.alert(
  'Flash',
  'Are sure you want to Logout?',
  [
    {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    {text: 'Yes', onPress: () => this._logout()},
  ],
  { cancelable: false }
)}/>
          <View style={{ flex: 2 }} />
          </View>
      {/*<View style={styles.container}>

        <View style={styles.searchcontainer}>
                <Text style={styles.keytext}>Start With</Text>
                <MenuList navigation={navigate}/>
                <Button border buttonText='Frame' onPress={() => this.props.navigation.navigate('Search', {
                   mode: 'Menu',
                   level: 'Frame'
                 })}/>
                </View>
                <View style={styles.searchcontainer}>
                <Text style={styles.keytext}></Text>
                <Text style={styles.keytext}></Text>
                </View>
                <View style={styles.qrcontainer}>
                <Text onPress={this._logout}>Logout</Text>
                </View>
      </View>*/}
      </View>
    );
  }
  _logout= () => {

    AsyncStorage.clear();
    this.props.navigation.navigate('Home')

  }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFC312',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  searchcontainer: {
    justifyContent: 'center',
    backgroundColor: '#FFC312',
    marginBottom: 20,
},
qrcontainer: {
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#FFC312',
    marginBottom:20,
},
 keytext:{
    flex:1,
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
