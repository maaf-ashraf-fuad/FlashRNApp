import React from 'react';
import { StyleSheet, Text, View, Image,KeyboardAvoidingView,TouchableOpacity} from 'react-native';
import SearchText from './searchtext';

export default class SearchInput extends React.Component {
  render() {
    return (
      <View style={styles.container}>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.searchcontainer}>
                <Text style={styles.keytext}>I Want to Search for</Text>
                <SearchText/>
                </View>
                <View style={styles.searchcontainer}>
                <Text style={styles.keytext}>----------- or -----------</Text>
                <Text style={styles.keytext}></Text>
                </View>
                <View style={styles.qrcontainer}>
                <TouchableOpacity>
                <Image 
            style={styles.qricon}
            source={require('../../img/qricon.png')}/></TouchableOpacity>
                <Text style={styles.keytext}>I Want to Scan A QR Code</Text>
                </View>
      </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC312',
    justifyContent: 'center',
  },
  searchcontainer: {
    justifyContent: 'center',
    backgroundColor: '#FFC312',
    marginBottom:20,
},
qrcontainer: {
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#FFC312',
    marginBottom:20,
},
 keytext:{
     textAlign:'center',
     fontSize:25,
     fontWeight:'bold'

 },
 qricon:{
    height:100,
    width:100,
    alignItems: 'center',
    marginBottom:5,
}
});