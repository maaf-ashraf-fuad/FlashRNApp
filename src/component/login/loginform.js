import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { FormValidationMessage} from 'react-native-elements';
import { login, updateUserValues } from '../../actions';
import { connect } from 'react-redux';
import { Spinner, Button, Card, CardSection } from '../common';

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
        {/*<TouchableOpacity disabled={loading} style={styles.buttonLogin}
          onPress={this.handleSubmit}
        >
          {loading?<Spinner />:<Text style={styles.loginText}>LOGIN</Text>}
        </TouchableOpacity>*/}
        <Button
          border
          disabled={loading}
          loading={loading}
          onPress={this.handleSubmit}
          buttonText='LOGIN'
          textStyle={styles.loginText}
          buttonStyle={styles.buttonLogin}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  logininput: {
    height: 30,
    backgroundColor: 'rgba(255,0,0,0.2)',
    marginBottom: 5,
    color: 'black',
    //paddingHorizontal: 15,
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
  return { error, loading, staff_user, staff_pass };
};

export default connect(mapStateToProps, { login, updateUserValues })(LoginForm);
