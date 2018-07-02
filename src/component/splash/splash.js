import React from 'react';
import { StyleSheet, Text, View, Image, AsyncStorage} from 'react-native';

export default class Splash extends React.Component {
  componentDidMount(){
    this._loadInitialState().done();
  }

  _loadInitialState = async () => {
      
      console.log(await AsyncStorage.getItem('flash_name'));
      var staff_name = await AsyncStorage.getItem('flash_name')
      if(staff_name !== null){
        console.log(staff_name)
        console.log('Auto Login Function');
        this.props.navigation.navigate('Menu')
        return;
      }
      else
      {
        console.log('Auto Login Function');
        this.props.navigation.navigate('Login')
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
        <Image 
            style={styles.logo}
            source={require('../../img/TMLOGO.png')}/>
        <Text style={styles.appTitle}>FLASH</Text>
        <Text style={styles.description}>Your Fiber Tagging App</Text>
        </View>
        <View style={styles.loginform}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC312',
  },
  logoContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow:1
  },
  appTitle:{
      color:'#FFFF',
      fontSize:30,
      fontWeight:'900',
      textAlign:'center', 
  },
  description:{
    color:'#FFFF',
    fontSize:20,
    fontWeight:'300',
    textAlign:'center', 
},
  logo:{
      height:150,
      width:300
  }
});