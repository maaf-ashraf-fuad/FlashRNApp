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
import { connect } from 'react-redux';
import List from './List';
import { frameFetch, shelfFetch, setMenuState  } from '../../actions';


class Children extends Component {

    fetchHelper = (type, {id, qr}) => {
      switch (type) {
        case 'Frame':
          return this.props.frameFetch(id, qr);
        case 'Shelf':
          return this.props.shelfFetch(id, qr);
        default:
      }

    }

    render(){
      const { child, headerExpended, child_type } = this.props;
      if (child !== undefined && !headerExpended){
        //console.log(this.props);
        return (
          <Card style={{ flex: 1 }}>
            <CardSection style={{ backgroundColor:'#ecedf2' }}>
              <Text h4>{child_type}</Text>
            </CardSection>
            <List data={child} type={child_type} fetchHelper={this.fetchHelper} />
          </Card>
        )
      }

      return null;
    }
}

const styles = StyleSheet.create({
  content: {
    padding: 7,
    //borderWidth: 1,
    borderRadius: 3,
    //borderColor: '#ddd',
    backgroundColor: '#fff',
    //borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 1,
  },
  qr: {
    justifyContent: 'center',
    borderColor: '#434343',
    borderWidth: 1,
    padding: 3,
    backgroundColor: '#838383',
    borderRadius: 3,
  },
  arrow: {
    borderTopColor: '#fff',
  },
  textBold: {
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
  input: {
      width: '50%',
      paddingLeft: 10,
      backgroundColor: '#fff',
      borderColor: '#ddd',
      borderWidth: 1,
  },
  editRowOdd: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 5,
  },
  editRowEven: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 5,
  },
  background: {
    backgroundColor: 'rgba(0, 0, 255, 0)',
  },
});

//export default Children;

const mapStateToProps = (state) => {
  return {...state.menu, ...state.data};
};

export default connect(mapStateToProps, { frameFetch, shelfFetch, setMenuState })(Children);
