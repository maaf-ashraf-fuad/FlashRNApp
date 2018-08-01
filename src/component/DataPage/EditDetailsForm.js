import React, { Component } from 'react';
import { Header, ListItem, Text, Icon} from 'react-native-elements';
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
import _ from 'lodash';
import { Card, CardSection, Button } from '../common';
import { Type } from './types';
import { connect } from 'react-redux';
import { coreSetValues, coreResetValues, coreUpdateDetails, setMenuState } from '../../actions';

class EditDetailsForm extends Component {

  handleCoreUpdateDetails = () => {
    const { ne_id, ne_shelf, ne_slot, ne_port, cct_name, coreUpdateDetails, pair_id, qr_code_id, frame_unit_id, staff_user } = this.props;
    coreUpdateDetails( frame_unit_id, pair_id, qr_code_id, ne_id, ne_shelf, ne_slot, ne_port, cct_name, staff_user);
  }

  render(){
    //console.log(this.props);
    const {
      ne_id,
      ne_shelf,
      ne_slot,
      ne_port,
      cct_name,
      status,
      coreResetValues,
      coreSetValues,
      coreUpdateDetails,
      coreLoading
    } = this.props;
    return (
      <View>
        <CardSection style={{justifyContent: 'space-between', backgroundColor:'#ecedf2', borderTopWidth: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Edit Details</Text>
        </CardSection>
        <CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>NE_ID</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={ne_id}
            onChangeText={ne_id => coreSetValues({prop: 'ne_id', value: ne_id})}
            //onChangeText={ne_id => this.setState({ editCore: { ne_id }})}
            returnKeyType='next'
            onSubmitEditing={() => this.ne_shelf.focus()}
          />
        </CardSection>
        <CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>NE_SHELF</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            //placeholder={parent.ne_shelf}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={ne_shelf}
            onChangeText={ne_shelf => coreSetValues({prop: 'ne_shelf', value: ne_shelf})}
            returnKeyType='next'
            onSubmitEditing={() => this.ne_slot.focus()}
            ref={(logininput) => this.ne_shelf = logininput}
          />
        </CardSection>
        <CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>NE_SLOT</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            //placeholder={parent.ne_slot}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={ne_slot}
            onChangeText={ne_slot => coreSetValues({prop: 'ne_slot', value: ne_slot})}
            returnKeyType='next'
            onSubmitEditing={() => this.ne_port.focus()}
            ref={(logininput) => this.ne_slot = logininput}
        />
        </CardSection>
        <CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>NE_PORT</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            //placeholder={parent.ne_port}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={ne_port}
            onChangeText={ne_port => coreSetValues({prop: 'ne_port', value: ne_port})}
            returnKeyType='next'
            onSubmitEditing={() => this.cct_name.focus()}
            ref={(logininput) => this.ne_port = logininput}
          />
        </CardSection>
        <CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>CIRCUIT_NAME</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            //placeholder={parent.cct_name}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={cct_name}
            onChangeText={cct_name => coreSetValues({prop: 'cct_name', value: cct_name})}
            returnKeyType='go'
            onSubmitEditing={this.handleCoreUpdateDetails}
            ref={(logininput) => this.cct_name = logininput}
          />
        </CardSection>
        {/*<CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>STATUS</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            //placeholder={parent.status}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={status}
            onChangeText={status => coreSetValues({prop: 'status', value: status})}
          />
        </CardSection>*/}
        <View style={{ height: 50, flexDirection: 'row', justifyContent: 'center' }}>
          <Button border disabled={coreLoading} buttonText='Reset' onPress={coreResetValues} />
          <Button border disabled={coreLoading} buttonText='Update' onPress={this.handleCoreUpdateDetails} />
        </View>
      </View>
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
    flex: 1
  },
  input: {
    width: '50%',
    paddingLeft: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    flex: 1.5,
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

const mapStateToProps = (state) => {
  const { error, coreLoading, user: { staff_user }, parent: { pair_id, qr_code_id, frame_unit_id }} = state.data;
  return { error, coreLoading, pair_id, qr_code_id, frame_unit_id, staff_user, ...state.data.editCore};
};

export default connect(mapStateToProps, { coreUpdateDetails, coreSetValues, coreResetValues, setMenuState })(EditDetailsForm);
