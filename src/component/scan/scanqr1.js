import React, { PureComponent } from 'react';
import { Platform,Dimensions, StyleSheet, Text, View, Alert, Image, BackHandler, TouchableOpacity } from 'react-native';
//import { ImagePicker, Permissions } from 'expo';
import { Button, Spinner, CardSection } from '../common';
import { connect } from 'react-redux';
import { Header, Icon } from 'react-native-elements';
import QRdecoder from 'react-native-qrimage-decoder';
import { fetchHelper, frameUpdateQR, shelfUpdateQR, coreUpdateQR, transferCoreFetchShelf, setMenuState, requestCameraPermission } from '../../actions';
import _ from 'lodash';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker'


class ScanScreen extends PureComponent {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.handleBarCodeRead = _.debounce(this.handleBarCodeRead.bind(this), 250, { 'maxWait': 1000, leading:true, trailing:false });
    const { height, width } = Dimensions.get('window');
    this.state = {
      hasCameraPermission: null,
      //maskRowHeight: Math.round((height - 300 - Header.HEIGHT) / 20),
      maskRowHeight: Math.round((height - 300) / 20),
      maskColWidth: (width - 300) / 2,
      image: null
    };
    this._didFocusSubscription = props.navigation.addListener('didFocus', () =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  componentDidMount() {
    const { setMenuState, navigation, requestCameraPermission, qrFlash } = this.props;
    requestCameraPermission();
    //navigation.setParams({ setMenuState, qrFlash });
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    const {navigation, loading} = this.props;
    if (loading===false){
      navigation.goBack();
    }
    return true;
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  /*static navigationOptions = ({navigation}) => {
    const { setMenuState, qrFlash } = navigation.state.params;
    //console.log(navigation.state.params);
    const onPressFlash = () => {
      navigation.setParams({ qrFlash: qrFlash==='off'?'on':'off' });
      setMenuState&&setMenuState({ qrFlash: qrFlash==='off'?'on':'off' })
    }
    return ({
      headerLeft: (
        <Button iconName='arrow-back' iconColor='#fff' iconStyle={{ marginLeft: 15 }} onPress={() => navigation.goBack()} />
      ),
      headerRight: (
        <Button
          iconName={qrFlash==='off'?'flash-on':'flash-off'}
          iconColor='#fff'
          iconStyle={{ marginRight: 15 }}
          onPress={onPressFlash}
        />
        )
      //headerRight: null
    })
  };*/

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
        Alert.alert('FLASH', error,
          [
            {
              text: 'OK', onPress: () => {
                setMenuState({ qrType: [BarCodeScanner.Constants.BarCodeType.qr] });
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('FLASH', error,
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
          ],
          { cancelable: false }
        );
      }
    }
    return null;
  }

  handleFlash = () => {
    const { qrFlash, setMenuState } = this.props;
    //this._menu.hide();
    setMenuState({ qrFlash: qrFlash==='off'?'on':'off' });
  }

  handleError = (error) => {
    //this.setState({ image: null });
    Alert.alert('FLASH', error,
      [
        {
          text: 'OK', onPress: () => {
            this.props.setMenuState({ localImage: undefined, loading: false, qrType: [BarCodeScanner.Constants.BarCodeType.qr] });
          }
        }
      ],
      { cancelable: false }
    );
  }

  handleSuccess = (e) => {
    //this.setState({ image: null });
    this.props.setMenuState({ localImage: undefined });
    this.handleBarCodeRead({data: e});
  }

  handlePickImage = async () => {
    const {setMenuState} = this.props;
    setMenuState({ qrType: [], loading: true, localImage: undefined });

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images'
      //allowsEditing: true,
      //aspect: [3, 3],
    });

    //console.log (result);

    if (!result.cancelled) {
      setMenuState({ localImage: result.uri });
      //this.setState({ image: result.uri });
    } else {
      setMenuState({ qrType: [BarCodeScanner.Constants.BarCodeType.qr], loading: false, localImage: undefined });
    }
  };
  
  outer_ios = () => {
    if(Platform.OS === 'ios'){
      return(styles.maskOutterIOS);
    }
    else{
      return(styles.maskOutter);
    }
  }

  render() {
    const { maskRowHeight, maskColWidth, image } = this.state;
    const { error, loading, qrType, navigation, qrFlash, localImage } = this.props;
    /*const level = this.props.navigation.getParam('level', undefined);
    const id = this.props.navigation.getParam('id', undefined);
    const mode = this.props.navigation.getParam('mode', undefined);
    const item = this.props.navigation.getParam('item', undefined);*/
    //console.log('qrType: ', qrType[0]);

    return (
        <BarCodeScanner
          onBarCodeRead={this.handleBarCodeRead}
          style={[StyleSheet.absoluteFill, styles.barcode]}
          barCodeTypes={qrType}
          torchMode={qrFlash}
        >
        { this.handleAlert() }
        <Header
          outerContainerStyles={styles.header}
          //innerContainerStyles={{ justifyContent: 'space-around' }}
          leftComponent={<Button disabled={loading} iconName='arrow-back' iconColor='#fff' onPress={this.onBackButtonPressAndroid} />}
          centerComponent={<Image source={ require('../../img/flash.png')} style={{ resizeMode: 'stretch', height: 20, width: 100 }}/>}
          rightComponent={<Button disabled={loading} iconName={qrFlash==='off'?'flash-on':'flash-off'} iconColor='#fff' onPress={this.handleFlash}/>}
          //rightComponent={< this.rightComponent />}
        />
          <View style={this.outer_ios()}>
            <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
              <View style={[{ flex: 30 }, styles.maskCenter]}>
                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                <View style={styles.maskInner} />
                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
              </View>
            <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
          </View>
          <View style={{ padding: 13, backgroundColor: '#ffd294', justifyContent: 'space-around' }}>
            <Text style={{ textAlign: 'center', textAlignVertical: 'center' }}>{navigation.getParam('QRText', 'Scan Frame, Shelf or Core QR Code here')}</Text>
          </View>
          <TouchableOpacity disabled={loading} style={styles.gallery} onPress={this.handlePickImage}>
            <Text style={{ textAlign: 'center', textAlignVertical: 'center' }}>Load QR from Gallery  </Text>
            <Icon name='image-multiple' type='material-community' />
            <QRdecoder src={localImage} onSuccess={this.handleSuccess} onError={this.handleError} />
          </TouchableOpacity>
          { loading?<View style={styles.maskOutter}><Spinner border /></View>:null }
        </BarCodeScanner>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#d03c1b',
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },
  gallery: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    backgroundColor: '#ffd294',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  barcode: {
    flex: 1,
    flexDirection: 'column',
  },
  maskOutter: {
    position: 'absolute',
    top: 36,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskOutterIOS: {
    position: 'absolute',
    top: 70,
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

const mapStateToProps = ({data: { parent_type, error, parent, loading, qrType, hasCameraPermission, qrFlash, localImage }}) => {
  //const { parent_type, error, parent, loading, qrType, hasCameraPermission, qrFlash } = state.data;
  return { error, parent_type, parent, loading, qrType, hasCameraPermission, qrFlash, localImage };
};

export default connect(mapStateToProps, { fetchHelper, frameUpdateQR, shelfUpdateQR, coreUpdateQR, transferCoreFetchShelf, setMenuState, requestCameraPermission })(ScanScreen);
