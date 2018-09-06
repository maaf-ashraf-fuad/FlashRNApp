import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text
} from 'react-native';
import { CardSection, Button } from '../common';
import { connect } from 'react-redux';
import { coreSetValues, coreResetValues, coreUpdateDetails, setMenuState } from '../../actions';

class EditDetailsForm extends PureComponent {

  handleCoreUpdateDetails = () => {
    const { coreUpdateDetails, editCore } = this.props;
    coreUpdateDetails(editCore);
  }

  render(){
    const {
      editCore: {
        ne_id,
        ne_shelf,
        ne_slot,
        ne_port,
        cct_name,
        to_ne_id,
        to_ne_shelf,
        to_ne_slot,
        to_ne_port,
        to_cct_name,
        status,
      },
      coreResetValues,
      coreSetValues,
      coreUpdateDetails,
      coreLoading
    } = this.props;
    return (
      <View>
        <CardSection style={{justifyContent: 'space-between', backgroundColor:'#ecedf2', borderTopWidth: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>From NE Details</Text>
        </CardSection>
        <CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>NE_ID</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            autoCorrect={false}
            autoCapitalize={'characters'}
            value={ne_id}
            onChangeText={ne_id => coreSetValues({prop: 'ne_id', value: ne_id})}
            returnKeyType='next'
            onSubmitEditing={() => this.ne_shelf.focus()}
          />
        </CardSection>
        <CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>NE_SHELF</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            keyboardType={'numeric'}
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
            keyboardType={'numeric'}
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
            keyboardType={'numeric'}
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
            autoCorrect={false}
            autoCapitalize={'none'}
            value={cct_name}
            onChangeText={cct_name => coreSetValues({prop: 'cct_name', value: cct_name})}
            returnKeyType='go'
            onSubmitEditing={() => this.to_ne_id.focus()}
            ref={(logininput) => this.cct_name = logininput}
          />
        </CardSection>
        <CardSection style={{justifyContent: 'space-between', backgroundColor:'#ecedf2', borderTopWidth: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>To NE Details</Text>
        </CardSection>
        <CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>NE_ID</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            autoCorrect={false}
            autoCapitalize={'characters'}
            value={to_ne_id}
            onChangeText={to_ne_id => coreSetValues({prop: 'to_ne_id', value: to_ne_id})}
            returnKeyType='next'
            onSubmitEditing={() => this.to_ne_shelf.focus()}
            ref={(logininput) => this.to_ne_id = logininput}
          />
        </CardSection>
        <CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>NE_SHELF</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            keyboardType={'numeric'}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={to_ne_shelf}
            onChangeText={to_ne_shelf => coreSetValues({prop: 'to_ne_shelf', value: to_ne_shelf})}
            returnKeyType='next'
            onSubmitEditing={() => this.to_ne_slot.focus()}
            ref={(logininput) => this.to_ne_shelf = logininput}
          />
        </CardSection>
        <CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>NE_SLOT</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            keyboardType={'numeric'}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={to_ne_slot}
            onChangeText={to_ne_slot => coreSetValues({prop: 'to_ne_slot', value: to_ne_slot})}
            returnKeyType='next'
            onSubmitEditing={() => this.to_ne_port.focus()}
            ref={(logininput) => this.to_ne_slot = logininput}
        />
        </CardSection>
        <CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>NE_PORT</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            keyboardType={'numeric'}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={to_ne_port}
            onChangeText={to_ne_port => coreSetValues({prop: 'to_ne_port', value: to_ne_port})}
            returnKeyType='next'
            onSubmitEditing={() => this.to_cct_name.focus()}
            ref={(logininput) => this.to_ne_port = logininput}
          />
        </CardSection>
        <CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>CIRCUIT_NAME</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={to_cct_name}
            onChangeText={to_cct_name => coreSetValues({prop: 'to_cct_name', value: to_cct_name})}
            returnKeyType='go'
            onSubmitEditing={() => this.status.focus()}
            ref={(logininput) => this.to_cct_name = logininput}
          />
        </CardSection>
        <CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>STATUS</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={status}
            onChangeText={status => coreSetValues({prop: 'status', value: status})}
            returnKeyType='go'
            onSubmitEditing={this.handleCoreUpdateDetails}
            ref={(logininput) => this.status = logininput}
          />
        </CardSection>
        <View style={{ height: 50, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button border disabled={coreLoading} buttonText='Reset' containerStyle={{ flex: 1 }} onPress={coreResetValues} />
          <Button border disabled={coreLoading} buttonText='Update' containerStyle={{ flex: 1 }} onPress={this.handleCoreUpdateDetails} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
});

const mapStateToProps = (state) => {
  const { error, coreLoading, parent: { pair_id, qr_code_id, frame_unit_id }, editCore } = state.data;
  return { error, coreLoading, pair_id, qr_code_id, frame_unit_id, editCore };
};

export default connect(mapStateToProps, { coreUpdateDetails, coreSetValues, coreResetValues, setMenuState })(EditDetailsForm);
