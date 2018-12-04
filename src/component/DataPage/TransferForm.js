import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Picker
} from 'react-native';
import { CardSection, Button } from '../common';
import { connect } from 'react-redux';
import { updateTransferCoreValues, transferCore, transferCoreResetValues, setMenuState } from '../../actions';
import NavigationService from '../../navigation/NavigationService.js';

class TransferForm extends PureComponent {

  handleTransferCoreDetails = () => {
    const { transferCore, toCore } = this.props;
    //console.log('toCore', toCore);
    transferCore(toCore);
  }

  handleQRButtonPress = () => {
    this.props.setMenuState({ error: '' });
    NavigationService.navigate('Scan', {
      next: { type: 'Transfer_Core_Shelf_QR' },
      QRText: 'Scan Shelf QR Code here'
    });
  }

  render(){
    const {
      toCore: {
        to_pair_id,
        frame_name,
        cable_name,
        cable_core_no,
      },
      toCoreDetails,
      coreLoading,
      updateTransferCoreValues,
      transferCoreResetValues
    } = this.props;

    return (
      <View>
        <CardSection style={{justifyContent: 'space-between', backgroundColor:'#ecedf2', borderTopWidth: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Transfer Core</Text>
        </CardSection>
        {/*}<CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>TO PAIR ID</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            //placeholder={parent.ne_id}
            autoCorrect={false}
            autoCapitalize={'none'}
            value={to_pair_id}
            onChangeText={value => updateTransferCoreValues({prop: 'to_pair_id', value})}
            returnKeyType='next'
            onSubmitEditing={() => this.frame_name.focus()}
          />
        </CardSection>*/}
        <CardSection style={{ flex: 1, justifyContent: 'center', flexDirection: 'column' }}>
          <TouchableOpacity disabled={coreLoading} style={{ justifyContent: 'center', alignSelf: 'center', margin: 10 }} onPress={this.handleQRButtonPress}>
            <Image style={{ height: 100, width: 100, alignItems: 'center'}}
              source={require('../../img/qricon.png')}
            />
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', textAlignVertical: 'center' }}>Tap to scan Shelf</Text>
        </CardSection>
        <CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>FRAME NAME</Text>
          <TextInput
            underlineColorAndroid = 'transparent'
            style={styles.input}
            //placeholder={parent.ne_id}
            autoCorrect={false}
            autoCapitalize='characters'
            clearButtonMode='always'
            value={frame_name}
            onChangeText={value => updateTransferCoreValues({prop: 'frame_name', value})}
            returnKeyType='next'
            onSubmitEditing={!toCoreDetails.cable_name?null:() => this.cable_name.focus()}
          />
        </CardSection>
        <CardSection style={styles.editRowOdd}>
          <Text style={styles.textBold}>CABLE NAME</Text>
          {!toCoreDetails.cable_name?
            <TextInput
              underlineColorAndroid = 'transparent'
              style={styles.input}
              //placeholder={parent.ne_id}
              autoCorrect={false}
              autoCapitalize='characters'
              clearButtonMode='always'
              value={cable_name}
              onChangeText={value => updateTransferCoreValues({prop: 'cable_name', value})}
              returnKeyType='next'
              onSubmitEditing={() => this.cable_core_no.focus()}
              ref={(logininput) => this.cable_name = logininput}
            />:
            <View style={styles.picker}>
              <Picker
                selectedValue={cable_name}
                style={{ height: 28, width: '100%' }}
                itemStyle={{ fontSize: 16 }}
                onValueChange={value => updateTransferCoreValues({prop: 'cable_name', value})}>
                {
                  toCoreDetails.cable_name.map(val => <Picker.Item key={val} label={val} value={val} />)
                }
              </Picker>
            </View>
          }
        </CardSection>
        <CardSection style={styles.editRowEven}>
          <Text style={styles.textBold}>CABLE CORE NO</Text>
          {!toCoreDetails.cable_core_no?
            <TextInput
              underlineColorAndroid = 'transparent'
              style={styles.input}
              //placeholder={parent.ne_id}
              autoCorrect={false}
              keyboardType='numeric'
              clearButtonMode='always'
              value={cable_core_no}
              onChangeText={value => updateTransferCoreValues({prop: 'cable_core_no', value})}
              returnKeyType='go'
              onSubmitEditing={this.handleTransferCoreDetails}
              ref={(logininput) => this.cable_core_no = logininput}
            />:
            <View style={styles.picker}>
              <Picker
                selectedValue={cable_core_no}
                //style={styles.input}
                style={{ height: 28, width: '100%' }}
                itemStyle={{ fontSize: 16 }}
                onValueChange={value => updateTransferCoreValues({prop: 'cable_core_no', value})}>
                {
                  toCoreDetails.cable_core_no[cable_name].map(val => <Picker.Item key={val} label={val} value={val} />)
                }
              </Picker>
            </View>
          }
        </CardSection>
        <View style={{ height: 50, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button border disabled={coreLoading} buttonText='Reset' containerStyle={{ flex: 1 }} onPress={transferCoreResetValues} />
          <Button border disabled={coreLoading} buttonText='Transfer Core' containerStyle={{ flex: 1 }} onPress={this.handleTransferCoreDetails} />
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
    fontSize: 16,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    flex: 1.5,
  },
  picker: {
    width: '50%',
    marginLeft: -8,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    flex: 1.5,
  },
  editRowOdd: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 5,
  },
  editRowEven: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 5,
  },
});

const mapStateToProps = ({ data: { toCore, coreLoading, toCoreDetails }}) => {
  return { toCore, coreLoading, toCoreDetails };
};

export default connect(mapStateToProps, { updateTransferCoreValues, transferCore, setMenuState, transferCoreResetValues })(TransferForm);
