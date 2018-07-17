import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';

export default class LoginForm extends React.Component {
  render() {

    return (
      <View
        style={styles.container}>
        <TextInput
          placeholder='Staff ID'
          placeholderTextColor='rgba(255,0,0,0.8)'
          underlineColorAndroid='transparent'
          clearButtonMode="always"
          returnKeyType='next'
          onSubmitEditing={() => this.passwordInput.focus()}
          style={styles.logininput}
          autoCapitalize="none"
          autoCorrect={false}
          value={this.state.f_user}
          onChangeText={f_user => this.setState({ f_user })}
        />

        <TextInput
          placeholder='Password'
          placeholderTextColor='rgba(255,0,0,0.8)'
          underlineColorAndroid='transparent'
          clearButtonMode="always"
          secureTextEntry
          returnKeyType='go'
          style={styles.logininput}
          ref={(logininput) => this.passwordInput = logininput}
          value={this.state.f_pass}
          onChangeText={f_pass => this.setState({ f_pass })}
          onSubmitEditing={this._submitForm}
        />

        <TouchableOpacity style={styles.buttonLogin}
          onPress={this._submitForm}
        >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    )
  }

  state = {
    f_user: '',
    f_pass: '',
    f_name: '',
  }


  _submitForm = () => {
    const navigate = this.props.navigation;
    const { f_user, f_pass } = this.state
    // validate the user input not null
    if (this.state.f_user == '' && this.state.f_pass == '' || this.state.f_user == '' || this.state.f_pass == '') {
      Alert.alert('FLASH', 'Please ensure your TM Staff ID & Password')
    }
    else {
      //call the soa rest api to call the username
      console.log(f_user)
      //console.log(f_pass)
      fetch('https://tmbill.tm.com.my/EZiBillWeb/Login/json/ldap',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              username: f_user,
              password: f_pass,
            }
          )
        })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.fullName == null) {
            Alert.alert("Flash", responseJson.username + " is not allow");
            return;
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
                    STAFF_ID: f_user,
                  }
                )
              })

              .then((response) => response.json())
              .then((responseJson) => {
                //console.log(responseJson);
                console.log(responseJson.ErrorCode);
                if (responseJson.ErrorCode == '00') {
                  AsyncStorage.setItem('flash_user', f_user);
                  AsyncStorage.setItem('flash_pass', f_pass);
                  AsyncStorage.setItem('flash_name', f_name);
                  Alert.alert("Welcome", f_name,
                    [
                      {
                        text: 'OK', onPress: () => navigate('Menu')
                      }
                    ]
                  );
                }
                else {
                  Alert.alert("Flash", f_name + ", Kindly Contact Your System Admin");
                  return;
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
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',

  },
  logininput: {
    height: 30,
    backgroundColor: 'rgba(255,0,0,0.2)',
    marginBottom: 10,
    color: 'blue',
    paddingHorizontal: 15,
    textAlign: 'center',
    borderRadius: 30
  },
  loginText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFF',
  },
  buttonLogin: {
    backgroundColor: '#0652DD',
    paddingVertical: 10,
    marginBottom: 50,
    borderRadius: 50
  },
});