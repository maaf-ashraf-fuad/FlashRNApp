import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './src/reducers';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Router from './src/component/router/router';
import Login from './src/component/login/login';
import Splash from './src/component/splash/splash';
import SearchInput from './src/component/search/searchinput';
import DataPage from './src/component/DataPage/DataPage';
import ScanScreen from './src/component/scan/scanqr1';
import TESTSOA from './src/component/splash/testsoa';

export default class App extends Component {
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <Provider store={store}>
        <DataPage />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
