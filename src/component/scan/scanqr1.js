import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';


export default class ScanScreen extends Component {
  constructor(props) {
    super(props);
    const { height, width } = Dimensions.get('window');
    this.state = {
      maskRowHeight: Math.round((height - 300) / 20),
      maskColWidth: (width - 300) / 2
    };
  }

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  render() {
    const { maskRowHeight, maskColWidth } = this.state;
    const level = this.props.navigation.getParam('level', undefined);
    const id = this.props.navigation.getParam('id', undefined);
    const mode = this.props.navigation.getParam('mode', undefined);
    const item = this.props.navigation.getParam('item', undefined);
    console.log('scanqr - level: ' + level, 'mode: ' + mode, 'id: ' + id);

    return (
      <View style={styles.container}>
       <View style={styles.topBar}/>
        <View style={styles.topBar}>
          <Text style={styles.cancelButtonText}>
            KINDLY POINT YOUR
          </Text>
        </View>
        <View style={styles.topBar}>
          <Text style={styles.cancelButtonText}>
            QR CODE TO THE BOX
          </Text>
        </View>

        <BarCodeScanner
          onBarCodeRead={(scan) => this.props.navigation.navigate('DataPage', { qrData: scan.data, level, id, item, mode })}
          style={styles.barcode}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        >

          <View style={styles.maskOutter}>
            <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
            <View style={[{ flex: 30 }, styles.maskCenter]}>
              <View style={[{ width: maskColWidth }, styles.maskFrame]} />
              <View style={styles.maskInner} />
              <View style={[{ width: maskColWidth }, styles.maskFrame]} />
            </View>
            <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
          </View>
          <View style={styles.bottomBar} 
        //onPress={this.props.navigation.navigate())
        >
            <Text style={styles.cancelButtonText}>
              SWIPE TO CANCEL
          </Text>
        </View>
        </BarCodeScanner>
       
      </View>
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
