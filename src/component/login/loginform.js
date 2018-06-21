import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';

export default class LoginForm extends React.Component {
  render() {
    return (
        <View 
        style={styles.container}>
        <TextInput
        placeholder='Staff ID'
        placeholderTextColor='rgba(255,0,0,0.8)'
        returnKeyType='next'
        onSubmitEditing={()=>this.passwordInput.focus()}
        style={styles.logininput} 
        autoCapitalize = "none"
        autoCorrect={false}
        value={this.state.username}
        onChangeText={username => this.setState({username})}
        />
        
        <TextInput
        placeholder='Password'
        placeholderTextColor='rgba(255,0,0,0.8)'
        secureTextEntry
        returnKeyType='go'
        style={styles.logininput}
        ref={(logininput) => this.passwordInput = logininput}
        value={this.state.password}
        onChangeText={password => this.setState({password})}
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
    username: '',
    password: '',
  }
_submitForm = () => {
  const { username, password } = this.state
  // validate the user input not null
  if (this.state.username =='' && this.state.password =='' || this.state.username =='' || this.state.password =='') 
  {
      Alert.alert('FLASH','Please ensure your TM Staff ID & Password')
  } 
 else {
   //call the soa rest api to call the username
     console.log(username)
     console.log(password)
 }
}

}

const styles = StyleSheet.create({
    container: {
    padding:20
      },
      logininput:{
          height:30,
          backgroundColor:'rgba(255,0,0,0.2)',
          marginBottom:10,
          color:'blue',
          paddingHorizontal:15,
          textAlign:'center',
          borderRadius:30
      },
      loginText:{
        textAlign:'center',
        fontSize:15,
        fontWeight:'bold',
        color:'#FFFF',
      },
      buttonLogin:{
        backgroundColor:'#0652DD',
        paddingVertical:10,
        marginBottom:50,
        borderRadius:50
      },
    });