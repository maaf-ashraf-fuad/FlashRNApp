import React, { Component } from 'react';
import { Text, Icon} from 'react-native-elements';
import {
  View,
  StyleSheet
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import _ from 'lodash';
import { Card, CardSection } from '../common';
import { connect } from 'react-redux';
import { frameFetch, shelfFetch, setMenuState  } from '../../actions';
import { Type } from './types';
import List from './List';
import DropDownMenu from './DropDownMenu';
import EditDetailsForm from './EditDetailsForm';
import TransferForm from './TransferForm';

class Parent extends Component {

  renderExpendedHeader () {
    const { headerExpended, headerMode, parentDetails, parent_type } = this.props;
    if (headerExpended) {
      if (headerMode==='View'){
        return(
          <View>
            <CardSection style={{justifyContent: 'space-between', backgroundColor:'#ecedf2', borderTopWidth: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>View Details</Text>
            </CardSection>
            <List data={parentDetails} flag />
          </View>
        )
      } else if (headerMode==='Edit') {
        return <EditDetailsForm />
      } else if (headerMode==='Transfer') {
        /*return(
          <View style={{ justifyContent: 'center', flexDirection: 'column' }}>
            <Icon name='swap-vert' size={ 50 } iconStyle={{ padding: 15 }}/>
            <Card>
              <CardSection style={{ backgroundColor:'#ecedf2' }}>
                <Text h4>{ parent_type }: New</Text>
              </CardSection>
            </Card>
          </View>
        )*/
        return <TransferForm />
      }
    }
    return null;
  }

  setMenuState = ( menuState ) => {
    this.props.setMenuState({ ...menuState });
  }

  render(){
    const { parent, headerExpended, parent_type, navigate } = this.props;

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
              navigate={navigate}
            />
          </CardSection>
          <CardSection style={{ margin: 5, borderBottomWidth: 0 }}>
            <View style={ styles.qr } >
            {
              parent.qr_code_id===undefined || parent.qr_code_id===null || parent.qr_code_id===''?
              <Icon name='do-not-disturb-alt' size={50} />:
              <QRCode value={parent.qr_code_id} size={50} />
            }
            </View>
            <View style={{ paddingLeft: 10, justifyContent: 'center' }}>
              <Text><Text style={{ fontWeight: 'bold' }}>{Type[parent_type].htext1.label}: </Text>{parent[Type[parent_type].htext1.field]}</Text>
              <Text><Text style={{ fontWeight: 'bold' }}>{Type[parent_type].htext2.label}: </Text>{parent[Type[parent_type].htext2.field]}</Text>
              {
                parent.qr_code_id===undefined || parent.qr_code_id=== null?
                <Text style={{ fontWeight: 'bold' }}>QR Code: <Text style={{ fontWeight: 'bold', color: 'red' }}>No QR Code</Text></Text>:
                <Text><Text style={{ fontWeight: 'bold' }}>QR Code: </Text>{parent.qr_code_id}</Text>
              }
            </View>
          </CardSection>
            {this.renderExpendedHeader()}
        </Card>
      )
    }

    return null;
  }
}

const styles = StyleSheet.create({
  qr: {
    justifyContent: 'center',
    borderColor: '#434343',
    borderWidth: 1,
    padding: 3,
    backgroundColor: '#838383',
    borderRadius: 3,
  }
});

//const mapStateToProps = ({ data: { parent, parent_type, headerExpended, headerMode}}) => {
const mapStateToProps = (state) => {
  const { parent, parent_type, headerExpended, headerMode} = state.data;
  //let data = _.omitBy(state.data, (val, key) => key === 'ns2:LIST_FRAME_UNIT' || key === 'parent');
  //data = _.mapKeys(data, (val, key) => key.replace('ns2:',''));
  //const a = state.data['ns2:LONGITUDE'];
  const parentDetails = _.map(_.toPairs(parent), d => _.fromPairs([d]));
  //console.log (state);
  //console.log (parentDetails);
  return {  headerExpended, headerMode, parent_type, parent, parentDetails};
};

export default connect(mapStateToProps, { frameFetch, shelfFetch, setMenuState })(Parent);
