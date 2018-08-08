import React from 'react';
import { StyleSheet, Text, View, Image,KeyboardAvoidingView} from 'react-native';
import LoginForm from './loginform';
import { Header } from 'react-navigation';

export default class Login extends React.Component {
  render() {
    const {navigate} = this.props.navigation;
    return (
      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={ Header.HEIGHT + 21 } style={styles.container}>
      <Image source= { require('../../img/bg2.png')} style= {{ position: 'absolute', top: -1, resizeMode: 'cover'}} />
        <View style={styles.logoContainer}>
        <Image
            style={styles.loginlogo}
            source={require('../../img/TMLOGO.png')}/>
        <Text style={styles.description}>Login To Access FLASH</Text>
        </View>

        <LoginForm />

      </KeyboardAvoidingView>
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
    fontWeight:'bold',
    textAlign:'center',
    marginTop:30,
},
  loginlogo:{
    height:150,
    width:300
  }
});
