import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert
} from 'react-native';
import { Card, CardSection, Button } from '../common';
import { connect } from 'react-redux';
import { updateTransferCoreValues, transferCore } from '../../actions';

class TranferForm extends Component {

  handleTransferCoreDetails = () => {
    const { transferCore, To_frame_unit_id, pair_id, To_pair_id, qr_code_id, frame_unit_id } = this.props;
    transferCore( frame_unit_id, To_frame_unit_id, pair_id, To_pair_id);
  }

  componentDidMount(){
    this.props.updateTransferCoreValues({prop: 'To_frame_unit_id', value: '30826'});
    this.props.updateTransferCoreValues({prop: 'To_pair_id', value: '33086'});
  }

  render(){
    //console.log(this.props);
    const {
      To_frame_unit_id,
      To_pair_id,
      updateTransferCoreValues
    } = this.props;
    return (
      <View>
        <CardSection style={{justifyContent: 'space-between', backgroundColor:'#ecedf2', borderTopWidth: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Transfer Core</Text>
        </CardSection>
        <CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>SHELF ID</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            //placeholder={parent.ne_id}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={To_frame_unit_id}
            onChangeText={value => updateTransferCoreValues({prop: 'To_frame_unit_id', value})}
            //onChangeText={ne_id => this.setState({ editCore: { ne_id }})}
          />
        </CardSection>
        <CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>PAIR ID</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            //placeholder={parent.ne_id}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={To_pair_id}
            onChangeText={value => updateTransferCoreValues({prop: 'To_pair_id', value})}
            //onChangeText={ne_id => this.setState({ editCore: { ne_id }})}
          />
        </CardSection>
        <View style={{ height: 50, flexDirection: 'row', justifyContent: 'center' }}>
          <Button border buttonText='Transfer Core' onPress={this.handleTransferCoreDetails} />
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
  const { pair_id, qr_code_id, frame_unit_id } = state.data.parent;
  return { pair_id, qr_code_id, frame_unit_id, ...state.data.toCore };
};

export default connect(mapStateToProps, { updateTransferCoreValues, transferCore })(TranferForm);
