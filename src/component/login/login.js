import React from 'react';
import { StyleSheet, Text, View, Image,KeyboardAvoidingView, BackHandler } from 'react-native';
import LoginForm from './loginform';
import { Header } from 'react-native-elements';

export default class Login extends React.Component {
_didFocusSubscription;
_willBlurSubscription;

constructor(props) {
  super(props);
  this._didFocusSubscription = props.navigation.addListener('didFocus', () =>
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
  );
}
  componentDidMount(){
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    Alert.alert("Flash 2.0", 'Are you sure you want to exit?',
      [
        {
          text: 'Yes', onPress: () => BackHandler.exitApp()
        },
        {
          text: 'No'
        }
      ]
    );
    return true;
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <Image source= { require('../../img/bg2.png')} style= {{ position: 'absolute', top: 52, resizeMode: 'cover'}} />
        <Header
          outerContainerStyles={{
            backgroundColor: '#d03c1b',
            borderBottomWidth: 0,
            shadowColor: 'transparent',
            elevation: 0,
          }}
          centerComponent={<Image source={ require('../../img/flash.png')} style={{ resizeMode: 'stretch', height: 20, width: 100 }}/>}
        />
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
