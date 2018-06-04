import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Login from './src/component/login/login';
import Splash from './src/component/splash/splash';

export default class Flash extends React.Component {
  render() {
    return (
        <Login />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0652DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
