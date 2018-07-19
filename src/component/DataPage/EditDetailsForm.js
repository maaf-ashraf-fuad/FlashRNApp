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
} from 'react-native';
import data from './LibraryList.json';
import QRCode from 'react-native-qrcode-svg';
import _ from 'lodash';
import { Card, CardSection, Button } from '../common';
import { Type } from './types';

class EditDetailsForm extends Component {

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      parent: props.parent,
      child: undefined,
      back: undefined,
      parentDetails: _.map(
             _.toPairs(props.parent), d => _.fromPairs([d])
           ),
      headerExpended: false,
      headerMode: null,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      editCore: { ne_id: '', ne_shelf: '', ne_slot: '', ne_port: '', cct_name: '', status: '' }
  }}

  render(){
    const { headerExpended, headerMode, parent, parentDetails, editCore } = this.state;
    return (
      <Card>
        <CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>NE_ID</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            placeholder={parent.ne_id}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={editCore.ne_id}
            onChangeText={ne_id => this.setState({ editCore: Object.assign({}, editCore, { ne_id })})}
            //onChangeText={ne_id => this.setState({ editCore: { ne_id }})}
          />
        </CardSection>
        <CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>NE_SHELF</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            placeholder={parent.ne_shelf}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={editCore.ne_shelf}
            onChangeText={ne_shelf => this.setState({ editCore: Object.assign({}, editCore, { ne_shelf })})}
          />
        </CardSection>
        <CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>NE_SLOT</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            placeholder={parent.ne_slot}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={editCore.ne_slot}
            onChangeText={ne_slot => this.setState({ editCore: Object.assign({}, editCore, { ne_slot })})}
        />
        </CardSection>
        <CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>NE_PORT</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            placeholder={parent.ne_port}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={editCore.ne_port}
            onChangeText={ne_port => this.setState({ editCore: Object.assign({}, editCore, { ne_port })})}
          />
        </CardSection>
        <CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>CIRCUIT_NAME</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            placeholder={parent.cct_name}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={editCore.cct_name}
            onChangeText={cct_name => this.setState({ editCore: Object.assign({}, editCore, { cct_name })})}
          />
        </CardSection>
        <CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>STATUS</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            placeholder={parent.status}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={editCore.status}
            onChangeText={status => this.setState({ editCore: Object.assign({}, editCore, { status })})}
          />
        </CardSection>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <Button border buttonText='Clear' onPress={() => this.setState({
            editCore: {
              ne_id: '',
              ne_shelf: '',
              ne_slot: '',
              ne_port: '',
              cct_name: '',
              status: ''
            }
           })} />
          <Button border buttonText='Update' onPress={() => this.updateCore()}/>
        </View>
      </Card>
    )
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

export default EditDetailsForm;
