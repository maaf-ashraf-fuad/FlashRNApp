import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, Text, View, Alert} from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import { Button, Spinner } from '../common';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import { fetchHelper, frameUpdateQR, shelfUpdateQR, coreUpdateQR, transferCoreFetchShelf, setMenuState, requestCameraPermission } from '../../actions';
import { FormValidationMessage } from 'react-native-elements';
import _ from 'lodash';


class ScanScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.handleBarCodeRead = _.debounce(this.handleBarCodeRead.bind(this), 250, { 'maxWait': 1000, leading:true, trailing:false });
    const { height, width } = Dimensions.get('window');
    this.state = {
      hasCameraPermission: null,
      maskRowHeight: Math.round((height - 300 - Header.HEIGHT) / 20),
      maskColWidth: (width - 300) / 2
    };
  }

  componentDidMount() {
    this.props.requestCameraPermission();
  }

  static navigationOptions = ({navigation}) => {
    //const {fetchHelper, back } = navigation.state.params;
    //console.log(navigation.state.params);
    /*const onPress = () => {
      //console.log(back);
      //fetchHelper&&fetchHelper(back);
      navigation.goBack();
    }*/
    return ({
      headerLeft: (
        <Button iconName='arrow-back' iconColor='#fff' iconStyle={{ marginLeft: 15 }} onPress={() => navigation.goBack()} />
      ),
      headerRight: null
    })
  };

  handleBarCodeRead = ({data}) => {
    const { shelfUpdateQR, frameUpdateQR, coreUpdateQR, transferCoreFetchShelf, parent, parent_type, navigation: { replace, pop, state: { params: { fetchHelper, next }}}} = this.props;
    if (data!==undefined)
    {
      switch (next.type) {
        case 'Update_Frame_QR':
          frameUpdateQR(parent.frame_name, data);
          break;
        case 'Update_Shelf_QR':
          shelfUpdateQR(parent.frame_unit_id, data);
          break;
        case 'Update_Core_QR':
          coreUpdateQR(parent.frame_unit_id, parent.pair_id, data);
          break;
        case 'Transfer_Core_Shelf_QR':
          transferCoreFetchShelf(data);
          break;
        default:
          /*this.props.fetchHelper({ ...next, qr: data });
          replace ('DataPage', { next: { ...next, id: data }, back: { type: 'Reset' }, fetchHelper: this.props.fetchHelper});*/
          this.props.fetchHelper({
            action: { type: 'replace', routeName: 'DataPage' },
            next: { ...next, qr: data },
            back: { type: 'Reset' }});
          break;
      }
    }
  }

  handleAlert(){
    const { error, setMenuState, hasCameraPermission, requestCameraPermission, navigation } = this.props;
    if(error!==null&&error!==undefined&&error!==''){
      if (hasCameraPermission){
        Alert.alert('Flash 2.0', error,
          [
            {
              text: 'OK', onPress: () => {
                setMenuState({ qrType: [BarCodeScanner.Constants.BarCodeType.qr] });
              }
            }
          ]
        );
      } else {
        Alert.alert('Flash 2.0', error,
          [
            {
              text: 'OK', onPress: () => {
                requestCameraPermission();
              }
            },
            {
              text: 'Back', onPress: () => {
                navigation.goBack();
              }
            }
          ]
        );
      }
    }
    return null;
  }

  render() {
    const { maskRowHeight, maskColWidth } = this.state;
    const { error, loading, qrType } = this.props;
    /*const level = this.props.navigation.getParam('level', undefined);
    const id = this.props.navigation.getParam('id', undefined);
    const mode = this.props.navigation.getParam('mode', undefined);
    const item = this.props.navigation.getParam('item', undefined);*/
    //console.log('qrType: ', qrType[0]);
    return (
        <BarCodeScanner
          onBarCodeRead={this.handleBarCodeRead}console
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
          { loading?<Spinner border />:null }
        </BarCodeScanner>
    );
  }
}

const styles = StyleSheet.create({
  barcode: {
    flex: 1,
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
  const { parent_type, error, parent, loading, qrType, hasCameraPermission } = state.data;
  return { error, parent_type, parent, loading, qrType, hasCameraPermission };
};

export default connect(mapStateToProps, { fetchHelper, frameUpdateQR, shelfUpdateQR, coreUpdateQR, transferCoreFetchShelf, setMenuState, requestCameraPermission })(ScanScreen);
