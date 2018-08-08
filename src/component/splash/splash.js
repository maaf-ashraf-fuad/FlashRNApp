import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, AsyncStorage, TouchableOpacity } from 'react-native';
import { login } from '../../actions';
import { connect } from 'react-redux';
import { Spinner } from '../common';

class Splash extends Component {
  componentDidMount() {
    //this.props.login();
    this.handleLogin();
  }

  handleLogin = async() => {
    const staff_name = await AsyncStorage.getItem('flash_name');
    const staff_user = await AsyncStorage.getItem('flash_user');
    const staff_pass = await AsyncStorage.getItem('flash_pass');
    this.props.login('splash', staff_user, staff_pass, staff_name);
  }

  render() {
    const {loading} = this.props;
    return (
      <View style={styles.container}>
        <Image source= { require('../../img/bg2.png')} style= {{ position: 'absolute', top: -1, resizeMode: 'cover'}} />
        <View style={styles.logoContainer}>
          <TouchableOpacity disabled={loading} onPress={this.handleLogin}>
            <Image style={styles.logo} source={require('../../img/TMLOGO.png')} />
            <Text style={styles.appTitle}>FLASH</Text>
            <Text style={styles.description}>Your Fiber Tagging App</Text>
            <Text style={styles.appTitle}> </Text>
            <Text style={styles.description}>Touch to START</Text>
            { loading?<Spinner border/>: null }
          </TouchableOpacity>
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

const mapStateToProps = (state) => {
  const { error, loading, user: { staff_user, staff_pass }} = state.data;
  //let data = _.omitBy(state.data, (val, key) => key === 'ns2:LIST_FRAME_UNIT' || key === 'parent');
  //data = _.mapKeys(data, (val, key) => key.replace('ns2:',''));
  //const a = state.data['ns2:LONGITUDE'];
  //console.log ('loginform:183');
  //console.log ( 'error: ', error, 'loading: ', loading, 'staff_user: ', staff_user, 'staff_pass: ', staff_pass );
  return { error, loading, staff_user, staff_pass };
};

export default connect(mapStateToProps, { login })(Splash);
