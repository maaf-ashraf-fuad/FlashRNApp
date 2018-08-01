import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, Alert} from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import { Button, Spinner } from '../common';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import { fetchHelper, shelfUpdateQR, coreUpdateQR, setMenuState } from '../../actions';
import { FormValidationMessage } from 'react-native-elements';
import _ from 'lodash';


class ScanScreen extends Component {
  constructor(props) {
    super(props);
    this.handleBarCodeRead = _.debounce(this.handleBarCodeRead.bind(this), 1000, {leading:true, trailing:false});
    const { height, width } = Dimensions.get('window');
    this.state = {
      hasCameraPermission: null,
      maskRowHeight: Math.round((height - 300 - Header.HEIGHT) / 20),
      maskColWidth: (width - 300) / 2
    };
  }

  componentDidMount() {
    this._requestCameraPermission();
  }

  static navigationOptions = ({navigation}) => {
    //const {fetchHelper, back } = navigation.state.params;
    //console.log(navigation.state.params);
    const onPress = () => {
      //console.log(back);
      //fetchHelper&&fetchHelper(back);
      navigation.goBack();
    }
    return ({
      headerLeft: (
        <Button iconName='arrow-back' iconColor='#fff' iconStyle={{ marginLeft: 15 }} onPress={onPress} />
      ),
      headerRight: null
    })
  };

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  handleBarCodeRead = ({data}) => {
    const { shelfUpdateQR, coreUpdateQR, parent, parent_type, navigation: { replace, pop, state: { params: { fetchHelper, next }}}} = this.props;
    if (data!==undefined)
    {
      switch (next.type) {
        case 'Update_Shelf_QR':
          shelfUpdateQR(parent.frame_unit_id, data);
          break;
        case 'Update_Core_QR':
        //console.log('something broke :(');
          coreUpdateQR(parent.frame_unit_id, parent.pair_id, data);
          break;
        default:
          /*this.props.fetchHelper({ ...next, qr: data });
          replace ('DataPage', { next: { ...next, id: data }, back: { type: 'Reset' }, fetchHelper: this.props.fetchHelper});*/
          this.props.fetchHelper({ action: { type: 'replace', routeName: 'DataPage' }, next: { ...next, qr: data }, back: { type: 'Reset' }});
          break;
      }
    }
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

  render() {
    const { maskRowHeight, maskColWidth } = this.state;
    const { error, loading, qrType } = this.props;
    /*const level = this.props.navigation.getParam('level', undefined);
    const id = this.props.navigation.getParam('id', undefined);
    const mode = this.props.navigation.getParam('mode', undefined);
    const item = this.props.navigation.getParam('item', undefined);
    console.log('scanqr - level: ' + level, 'mode: ' + mode, 'id: ' + id);*/

    return (
        <BarCodeScanner
          onBarCodeRead={this.handleBarCodeRead}
          style={styles.barcode}
          barCodeTypes={qrType}
        >
        { this.handleAlert() }
          <View style={styles.maskOutter}>
            <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
              <View style={[{ flex: 30 }, styles.maskCenter]}>
                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                <View style={styles.maskInner} />
                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
              </View>
            <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
          </View>
        </BarCodeScanner>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcode: {
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent:'center',
  },
  topBar: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
  },
  cameraView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  maskOutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    width: 300,
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
  },
  maskFrame: {
    backgroundColor: 'rgba(1,1,1,0.6)',
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: { flexDirection: 'row' },
});

const mapStateToProps = (state) => {
  const { parent_type, error, parent, loading } = state.data;
  //let data = _.omitBy(state.data, (val, key) => key === 'ns2:LIST_FRAME_UNIT' || key === 'parent');
  //data = _.mapKeys(data, (val, key) => key.replace('ns2:',''));
  //const a = state.data['ns2:LONGITUDE'];
  //console.log (state.data.children);
  return { error, parent_type, parent, loading };
};

export default connect(mapStateToProps, { fetchHelper, shelfUpdateQR, coreUpdateQR, setMenuState })(ScanScreen);
