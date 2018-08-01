import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { FormValidationMessage} from 'react-native-elements';
import { login, updateUserValues } from '../../actions';
import { connect } from 'react-redux';
import { Spinner } from '../common';

class LoginForm extends Component {

handleLoginInput = (staff_user) => this.props.updateUserValues({ prop: 'staff_user', value: staff_user });

handlePasswordInput = (staff_pass) => this.props.updateUserValues({ prop: 'staff_pass', value: staff_pass });

handleSubmit = () => {
  const { staff_user, staff_pass, login } = this.props;
  login ( 'login', staff_user, staff_pass );
}

  render() {
    const { error, loading, staff_user, staff_pass } = this.props;

    return (
      <View style={styles.container}>
        <TextInput
          placeholder='Staff ID'
          placeholderTextColor='black'
          underlineColorAndroid='transparent'
          clearButtonMode="always"
          returnKeyType='next'
          onSubmitEditing={() => this.passwordInput.focus()}
          style={styles.logininput}
          autoCapitalize="none"
          autoCorrect={false}
          value={staff_user}
          onChangeText={this.handleLoginInput}
        />
        <TextInput
          placeholder='Password'
          //placeholderTextColor='rgba(255,0,0,0.8)'
          placeholderTextColor='black'
          underlineColorAndroid='transparent'
          clearButtonMode="always"
          secureTextEntry
          returnKeyType='go'
          style={styles.logininput}
          ref={(logininput) => this.passwordInput = logininput}
          value={staff_pass}
          onChangeText={this.handlePasswordInput}
          onSubmitEditing={this.handleSubmit}
        />
        <FormValidationMessage containerStyle={{ marginBottom: 10}} labelStyle={{ textAlign: 'center' }}>{error}</FormValidationMessage>
        <TouchableOpacity disabled={loading} style={styles.buttonLogin}
          onPress={this.handleSubmit}
        >
          {loading?<Spinner />:<Text style={styles.loginText}>LOGIN</Text>}
        </TouchableOpacity>
      </View>
    )
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

const mapStateToProps = (state) => {
  const { error, loading, user: { staff_user, staff_pass }} = state.data;
  //let data = _.omitBy(state.data, (val, key) => key === 'ns2:LIST_FRAME_UNIT' || key === 'parent');
  //data = _.mapKeys(data, (val, key) => key.replace('ns2:',''));
  //const a = state.data['ns2:LONGITUDE'];
  //console.log ('loginform:183');
  //console.log ( 'error: ', error, 'loading: ', loading, 'staff_user: ', staff_user, 'staff_pass: ', staff_pass );
  return { error, loading, staff_user, staff_pass };
};

export default connect(mapStateToProps, { login, updateUserValues })(LoginForm);
