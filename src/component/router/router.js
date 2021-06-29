//import liraries
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Splash from '../splash/splash';
import Login from '../login/login';
import SearchInput from '../search/searchinput';
import Menu from '../search/menu';
import DataPage from '../DataPage/DataPage';
import ScanScreen from '../scan/scanqr1';
import Reducer from '../../reducers/DataReducer';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Button } from '../common';
//import LoginForm from '../splash/testsoa';

//routerstack
const Application = createStackNavigator({
    Home: { screen: Splash },
    Login: { screen: Login },
    Menu: { screen: Menu },
    Search: { screen: SearchInput },
    DataPage: { screen: DataPage },
    Scan: { screen: ScanScreen },
    AddScan: { screen: Splash },
    Reducer: { screen: Reducer },
    //Home: { screen: Login },
    //Menu: { screen: SearchInput, title:'Menu'},
    //Scan: { screen: ScanScreen},
    //DataPage: { screen: DataPage },
},
    {
        initialRouteName: 'Menu',
        //headerMode: 'none',
        headerLayoutPreset: 'center',
        headerBackTitleVisible : false,
        navigationOptions: ({navigation}) => ({
            headerTitle: <Image source={ require('../../img/flash.png')} style={{ resizeMode: 'stretch', height: 20, width: 100 }}/>,
            /*headerLeft: (
              <Button iconName='arrow-back' iconColor='#fff' iconStyle={{ marginLeft: 15 }} onPress={() => {
                console.log(this);
                this.props.fetchHelper(navigation.state.params.type, navigation.state.params.input);
                navigation.goBack(null);
              }} />
            ),*/
            headerRight: (
              <Button iconName='sign-out' iconType='octicon' iconColor='#fff' iconStyle={{ marginRight: 15 }} />
            ),
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
// create a component
export default class Router extends React.Component {
    constructor(props) {
        super(props);
        ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT_UP);
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
