import React, { PureComponent } from 'react';
import { Text, Icon} from 'react-native-elements';
import {
  View,
  StyleSheet,
  Clipboard,
  Modal
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Card, CardSection } from '../common';
import { connect } from 'react-redux';
import { setMenuState  } from '../../actions';
import { Type } from './types';
import List from './List';
import DropDownMenu from './DropDownMenu';
import EditDetailsForm from './EditDetailsForm';
import TransferForm from './TransferForm';

class Parent extends PureComponent {

  renderExpendedHeader () {
    const { headerExpended, headerMode, parentDetails, parent_type } = this.props;
    if (headerExpended) {
      if (headerMode==='View'){
        return(
          <View>
            <CardSection style={{justifyContent: 'space-between', backgroundColor:'#ecedf2', borderTopWidth: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>View Details</Text>
            </CardSection>
            <List data={parentDetails} onPress={this.handleCopyShow} flag />
          </View>
        )
      } else if (headerMode==='Edit') {
        return <EditDetailsForm />
      } else if (headerMode==='Transfer') {
        return <TransferForm />
      }
    }/* else if (!headerExpended && parent_type==='Core'){
        return(
          <View>
            <CardSection style={{justifyContent: 'space-between', backgroundColor:'#ecedf2', borderTopWidth: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>View Details</Text>
            </CardSection>
            <List data={parentDetails} onPress={this.handleCopyShow} flag />
          </View>
        )
    }*/
    return null;
  }

  setMenuState = ( menuState ) => {
    this.props.setMenuState({ ...menuState });
  }

  handleCopyShow = ( val ) => {
    Clipboard.setString(val);
    this.setMenuState({ showCopyModal: true });
  }

  handleCopyAutoClose = () => {
    setTimeout(this.handleCopyClose, 750);
  }

  handleCopyClose = () => {
    this.setMenuState({ showCopyModal: false });
  }

  render(){
    const { parent, headerExpended, parent_type, showCopyModal } = this.props;

    if (parent!==undefined){
      return (
        <Card style={{ borderBottomWidth: 1 }}>
          <CardSection style={{ justifyContent: 'space-between', backgroundColor:'#ecedf2' }}>
            <Text h4>{parent_type}</Text>
            <DropDownMenu
              type={parent_type}
              qr_code_id={parent.qr_code_id}
              headerExpended={headerExpended}
              setMenuState={this.setMenuState}
            />
          </CardSection>
          <CardSection style={{ margin: 5, borderBottomWidth: 0 }}>
            <View style={ styles.qr } >
            {
              !parent.qr_code_id?
              <Icon name='do-not-disturb-alt' size={50} />:
              <QRCode value={parent.qr_code_id} ecl='H' size={50} />
            }
            </View>
            <View style={{ paddingLeft: 10, justifyContent: 'center' }}>
              {
                Type[parent_type].parent_fields.map( subitem => (
                <Text key={ subitem.key } style={{ fontWeight: 'bold' }}>
                  {subitem.label}
                  <Text style={ subitem.field==='qr_code_id'&&parent[subitem.field]===null? { color: 'red' }: { fontWeight: 'normal' } }>
                    { subitem.field==='qr_code_id'&&parent[subitem.field]===null?'No QR Code': parent[subitem.field] }
                  </Text>
                </Text>
                ))
              }
            </View>
          </CardSection>
            {this.renderExpendedHeader()}
            <Modal
              animationType='fade'
              transparent
              visible={showCopyModal}
              onShow={this.handleCopyAutoClose}
              onRequestClose={this.handleCopyClose}
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Card style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                  <Text style={{ textAlign: 'center', fontSize: 16 }}>Copied to Clipboard!</Text>
                </Card>
              </View>
            </Modal>
        </Card>
      )
    }

    return null;
  }
}

const styles = StyleSheet.create({
  qr: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 60,
    width: 60,
    borderColor: '#434343',
    borderWidth: 1,
    padding: 3,
    backgroundColor: '#838383',
    borderRadius: 3,
  }
});

const mapStateToProps = (state) => {
  const { parent, parent_type, headerExpended, headerMode, parentDetails, showCopyModal } = state.data;
  return {  headerExpended, headerMode, parent_type, parent, parentDetails, showCopyModal};
};

export default connect(mapStateToProps, { setMenuState })(Parent);
