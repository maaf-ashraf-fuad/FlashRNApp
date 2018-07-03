//import liraries
import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Splash from '../splash/splash';
import Login from '../login/login';
import SearchInput from '../search/searchinput';
import Menu from '../search/menu';
import DataPage from '../datapage/DataPage';
import ScanScreen from '../scan/scanqr1';
import {ScreenOrientation} from 'expo';

//routerstack
const Application = createStackNavigator({
    Home: { screen: Splash },
    Login: { screen: Login },
    Menu: { screen: Menu },
    Search:{ screen: SearchInput },
    DataPage: { screen: DataPage },
    Scan: { screen: ScanScreen},
    AddScan: { screen: Splash},
    //Home: { screen: Login },
    //Menu: { screen: SearchInput, title:'Menu'},
    //Scan: { screen: ScanScreen},
    //DataPage: { screen: DataPage },
},
    {
        initialRouteName: 'Menu',
        headerMode: 'none',
        //navigationOptions: {
        //    header: false,
        //    headerStyle: {
        //        backgroundColor: '#FFC312',
        //        borderBottomWidth: 0,
        //        shadowColor: 'transparent',
        //        elevation:0,
        //    },
        //
        //}
    }
);
// create a component
export default class Router extends React.Component {
  constructor(props) {
    super(props);
    ScreenOrientation.allow (ScreenOrientation.Orientation.PORTRAIT_UP);
  }
    render() {
        return <Application />;
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});
