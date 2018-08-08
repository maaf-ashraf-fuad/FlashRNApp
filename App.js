import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './src/reducers';
import {
  Image
} from 'react-native';
import Splash from './src/component/splash/splash';
import Login from './src/component/login/login';
import SearchInput from './src/component/search/searchinput';
import Menu from './src/component/search/menu';
import DataPage from './src/component/DataPage/DataPage';
import ScanScreen from './src/component/scan/scanqr1';
import NavigationService from './src/navigation/NavigationService';
import { createStackNavigator } from 'react-navigation';
import { ScreenOrientation } from 'expo';

const TopLevelNavigator = createStackNavigator({
    Splash: { screen: Splash },
    Login: { screen: Login },
    Menu: { screen: Menu },
    Search: { screen: SearchInput },
    DataPage: { screen: DataPage },
    Scan: { screen: ScanScreen },
    AddScan: { screen: Splash },
},
    {
        initialRouteName:
        'Splash',
        //'Menu',
        //headerMode: 'none',
        headerLayoutPreset: 'center',
        headerBackTitleVisible : false,
        navigationOptions: ({navigation}) => ({
            headerTitle: <Image source={ require('./src/img/flash.png')} style={{ resizeMode: 'stretch', height: 20, width: 100 }}/>,
            /*headerLeft: (
              <Button iconName='arrow-back' iconColor='#fff' iconStyle={{ marginLeft: 15 }} onPress={() => {
                console.log(this);
                this.props.fetchHelper(navigation.state.params.type, navigation.state.params.input);
                navigation.goBack(null);
              }} />
            ),*/
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#d03c1b',
                borderBottomWidth: 0,
                shadowColor: 'transparent',
                elevation: 0,
            },
            /*headerTitleContainerStyle: {
                justifyContent: 'center',
            },*/

        })
    }
);

/*handleRef = (navigatorRef) => {
  NavigationService.setTopLevelNavigator(navigatorRef);
}*/

export default class App extends Component {
  constructor(props) {
      super(props);
      ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT_UP);
  }

  handleRef = (navigatorRef) => {
    NavigationService.setTopLevelNavigator(navigatorRef);
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <Provider store={store}>
        <TopLevelNavigator
          ref={this.handleRef}
        />
      </Provider>
    );
  }
}
