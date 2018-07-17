import React from 'react';
import { StyleSheet, Text, View, Image, AsyncStorage, TouchableOpacity, Alert } from 'react-native';
import Login from '../login/login';

export default class Splash extends React.Component {
  /*componentDidMount() {
    this._loadInitialState().done();
  }*/

  _loadInitialState = async () => {

    console.log(await AsyncStorage.getItem('flash_name'));
    var staff_name = await AsyncStorage.getItem('flash_name')
    var staff_user = await AsyncStorage.getItem('flash_user')
    var staff_pass = await AsyncStorage.getItem('flash_pass')
    if (staff_name !== null) {
      console.log('Auto Process');
      //this.props.navigation.navigate('Menu')
      //return Login._submitForm();
      fetch('https://tmbill.tm.com.my/EZiBillWeb/Login/json/ldap',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              username: staff_user,
              password: staff_pass,
            }
          )
        })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.fullName == null) {
            Alert.alert("Flash", staff_name + " need to re-login");
            this.props.navigation.navigate('Login');
          }
          else {
            console.log('LDAP Pass')
            f_name = responseJson.fullName;
            //SOA Check
            fetch('http://58.27.85.176/FLASH/VerifyUser',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
                },
                body: JSON.stringify(
                  {
                    STAFF_ID: staff_user,
                  }
                )
              })

              .then((response) => response.json())
              .then((responseJson) => {
                //console.log(responseJson);
                console.log(responseJson.ErrorCode);
                if (responseJson.ErrorCode == '00') {
                  Alert.alert("Welcome", staff_name,
                    [
                      {
                        text: 'OK', onPress: () => this.props.navigation.navigate('Menu')
                      }
                    ]
                  );
                }
                else {
                  Alert.alert("Flash", staff_name + ", Kindly Contact Your System Admin");
                  this.props.navigation.navigate('Login');
                }
              })
              .catch((error) => {
                console.error(error);
              })
              .done()
            //End SoA CHECK
          }
        })
        .catch((error) => {
          console.error(error);
          alert(error);
        })
        .done()
    }
    else {
      console.log('Auto Login Failed');
      this.props.navigation.navigate('Login')
    }
  }

  render() {
    return (

<View style={styles.container}>

<View style={styles.logoContainer}>
<TouchableOpacity onPress={this._loadInitialState}
          >
<Image style={styles.logo} source={require('../../img/TMLOGO.png')} />
<Text style={styles.appTitle}>FLASH</Text>
<Text style={styles.description}>Your Fiber Tagging App</Text>
<Text style={styles.appTitle}> </Text>
<Text style={styles.description}>Touch to START</Text></TouchableOpacity>
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1
  },
  appTitle: {
    color: '#FFFF',
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
  },
  description: {
    color: '#FFFF',
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
  },
  logo: {
    height: 150,
    width: 300
  },
  buttonLogin: {
    backgroundColor: '#0652DD',
    paddingVertical: 10,
    marginBottom: 50,
    borderRadius: 50
  },
});