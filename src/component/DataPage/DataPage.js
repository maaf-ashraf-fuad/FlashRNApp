import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Image,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { Button, Spinner } from '../common';
import Parent from './Parent';
import Children from './Children';
import { connect } from 'react-redux';
import { fetchHelper, setMenuState } from '../../actions';
import { Header } from 'react-navigation';
//import { FormValidationMessage } from 'react-native-elements';

//const { UIManager } = NativeModules;
//NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);

class  DataPage extends Component {
  componentDidMount() {
    this.props.navigation.setParams({ fetchHelper: this.props.fetchHelper })
  }

  static navigationOptions = ({navigation}) => {
    const {fetchHelper, back } = navigation.state.params;
    //console.log(navigation.state.params);
    const onPress = () => {
      //console.log(back);
      fetchHelper&&fetchHelper({ action: { type: 'back' }, next: back });
      //navigation.goBack();

      //fetchHelper({ action: { type: 'push', routeName: 'DataPage' }, next: { type: searchType, id: searchText }, back: { type: 'Reset' }});
    }
    return ({
      headerLeft: (
        <Button iconName='arrow-back' iconColor='#fff' iconStyle={{ marginLeft: 15 }} onPress={onPress} />
      ),
      headerRight: (
        <Button
          iconName='home'
          iconColor='#fff'
          iconStyle={{ marginRight: 15 }}
          onPress={() => navigation.popToTop()}
        />
        )
    })
  };

  navigate = (pageName, {next}) => {
    const { navigation, fetchHelper } = this.props;
    if (pageName==='DataPage'){
      return fetchHelper({ action: { type: 'push', routeName: pageName }, back: { ...navigation.getParam('next', null)}, next });
    }
    //navigation.push(pageName, { back: { ...navigation.getParam('next', null)}, next, fetchHelper});
    navigation.push(pageName, { back: { ...navigation.getParam('next', null)}, next });
  }

  handleAlert(){
    const { error, setMenuState } = this.props;
    if(error!==null&&error!==undefined&&error!==''){
      Alert.alert('Flash 2.0', error,
        [
          {
            text: 'OK', onPress: () => {
              setMenuState({ error: '' });
            }
          }
        ]
      );
    }
    return null;
  }

  render(){
    const { loading, error } = this.props;

    return (
      <KeyboardAvoidingView enabled keyboardVerticalOffset={ Header.HEIGHT + 21 } behavior='padding' style={{ flex: 1, backgroundColor:'#ffd294'}}>
          <Image source= { require('../../img/bg2.png')} style= {{ position:'absolute', top: -5, resizeMode: 'cover'}} />
          <View style={{ height: 25 }}/>
          {
            loading?
            <Spinner />:
            <ScrollView>
              <Parent navigate={this.navigate}/>
              <Children navigate={this.navigate}/>
              <View style={{ height: 20 }}/>
            </ScrollView>
          }
          { this.handleAlert() }
        </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = ({ data: { loading, error, parent }}) => {
  //let data = _.omitBy(state.data, (val, key) => key === 'ns2:LIST_FRAME_UNIT' || key === 'parent');
  //data = _.mapKeys(data, (val, key) => key.replace('ns2:',''));
  //const a = state.data['ns2:LONGITUDE'];
  //console.log (state.data.children);
  return { loading, error, parent };
};

export default connect(mapStateToProps, { fetchHelper, setMenuState })(DataPage);
