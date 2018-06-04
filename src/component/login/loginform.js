import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, StatusBar} from 'react-native';

export default class LoginForm extends React.Component {
  render() {
    return (
        <View 
        style={styles.container}>
        <StatusBar barStyle = 'dark-content'>
        </StatusBar>
        <TextInput
        placeholder='Staff ID'
        placeholderTextColor='rgba(255,0,0,0.8)'
        returnKeyType='next'
        onSubmitEditing={()=>this.passwordInput.focus()}
        style={styles.logininput} 
        autoCapitalize = "none"
        autoCorrect={false}
        />
        <TextInput
        placeholder='Password'
        placeholderTextColor='rgba(255,0,0,0.8)'
        secureTextEntry
        returnKeyType='go'
        style={styles.logininput}
        ref={(logininput) => this.passwordInput = logininput}
        />
        <TouchableOpacity style={styles.buttonLogin}>
            <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        </View>
    );
}}

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