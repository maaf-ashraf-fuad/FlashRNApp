import React, { Component } from 'react';
import { Header, ListItem, Text, Icon} from 'react-native-elements';
import { Popover } from 'react-native-modal-popover';
import {
  findNodeHandle,
  NativeModules,
  Platform,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  FlatList,
  StyleSheet,
  Easing,
  TextInput,
  KeyboardAvoidingView,
  Alert
  //LayoutAnimation
} from 'react-native';
import data from './LibraryList.json';
import QRCode from 'react-native-qrcode-svg';
import _ from 'lodash';
import { Card, CardSection, Button } from '../common';
import Parent from './Parent';
import { connect } from 'react-redux';
import { frameFetch } from '../../actions';

//const { UIManager } = NativeModules;
//NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);

class  DataPage extends Component {

  constructor(props) {
    super(props);
    this.props.frameFetch('PUJ_ODF006','');
    this.state = {
      parent: undefined,
      child: undefined,
      back: undefined,
      parentDetails: [],
      headerExpended: false,
      headerMode: null,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      editCore: { ne_id: '', ne_shelf: '', ne_slot: '', ne_port: '', cct_name: '', status: '' }
  }}

  componentWillMount(){
    //console.log('Fetching');
  }

  componentWillReceiveProps(nextProps) {
        this.setState({ parent: nextProps.parent });//console.log(nextProps.parent);
  }

  render(){
    console.log('Render');
    return (
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1, backgroundColor:'#f5f5f5' }}>
          <Image source= { require('../../img/bg2.png')} style= {{ position:'absolute', top: 68, resizeMode: 'cover'}} />
          <Header
            backgroundColor='#d03c1b'
            outerContainerStyles={{ borderBottomWidth:0 }}
            //leftComponent={ this.renderHeaderBack() }
            centerComponent={<Image source={ require('../../img/flash.png') }
            style={{ resizeMode: 'stretch', height: 20, width: 100 }}/>}
            //rightComponent={{ icon: 'home', color: '#fff' }}
            //rightComponent={ this.renderHeaderHome() }
          />
          { this.state.parent?
            <Parent parent={this.state.parent} />:
            null
          }
        </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  //let data = _.omitBy(state.data, (val, key) => key === 'ns2:LIST_FRAME_UNIT' || key === 'parent');
  //data = _.mapKeys(data, (val, key) => key.replace('ns2:',''));
  //const a = state.data['ns2:LONGITUDE'];
  //console.log (state.data.children);
  return state.data;
};

export default connect(mapStateToProps, { frameFetch })(DataPage);
