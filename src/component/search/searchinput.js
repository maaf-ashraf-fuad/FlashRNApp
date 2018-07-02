import React from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TouchableOpacity, AsyncStorage } from 'react-native';
import { Header } from 'react-native-elements';
import SearchText from './searchtext';

export default class SearchInput extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <View style={styles.searchcontainer}>
            <Text style={styles.keytext}>I Want to Search for</Text>
            <SearchText navigation={navigate} />
          </View>
          <View style={styles.searchcontainer}>
            <Text style={styles.keytext}>----------- or -----------</Text>
            <Text style={styles.keytext}></Text>
          </View>
          <View style={styles.qrcontainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Scan')}>
              <Image
                style={styles.qricon}
                source={require('../../img/qricon.png')} /></TouchableOpacity>
            <Text style={styles.keytext}>I Want to Scan A QR Code</Text>
            <Text style={styles.keytext}> </Text>
            <Text style={styles.keytext}> </Text>
            <Text onPress={this._logout}>Back</Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
  _logout = () => {

    AsyncStorage.clear();
    this.props.navigation.navigate('Menu')

  }
}



const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#FFC312',
    justifyContent: 'center',
  },
  searchcontainer: {
    justifyContent: 'center',
    backgroundColor: '#FFC312',
    marginBottom: 20,
  },
  qrcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFC312',
    marginBottom: 20,
  },
  keytext: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold'

  },
  qricon: {
    height: 100,
    width: 100,
    alignItems: 'center',
    marginBottom: 5,
  }
});