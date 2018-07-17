import React from 'react';
import { StyleSheet, TextInput, Text, View, Image, KeyboardAvoidingView, TouchableOpacity, AsyncStorage } from 'react-native';


export default class SearchInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchinput: ''
  };
}

  /*_submitValue(){
    const level = this.props.navigation.getParam('level', undefined);
    const mode = this.props.navigation.getParam('mode', undefined);
    const { searchinput} = this.state
    // validate the user input not null
    if (searchinput ==''){
        Alert.alert('FLASH','Please input value that need to search')
    } else {
       //To validate perform search on the based on SOA rest API
       Alert.alert('Your Input',searchinput,
       [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.props.navigation.navigate('DataPage', { menu, level, id: searchinput })},
      ],
      { cancelable: false })


   }
 }*/

  render() {
    const level = this.props.navigation.getParam('level', undefined);
    const id = this.props.navigation.getParam('id', undefined);
    const mode = this.props.navigation.getParam('mode', undefined);
    const { searchinput } = this.state;
    console.log ('searchinput - level: ' + level, 'mode: ' + mode, 'id: ' + id);

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <View style={styles.searchcontainer}>
            
            <View style={{ padding: 30 }}>
              <TextInput
                //placeholder='FRAME ID / SHELF ID / CORE ID'
                placeholder='Enter Value Want to Search'
                placeholderTextColor='rgba(255,0,0,0.8)'
                returnKeyType='go'
                style={styles.searchinput}
                autoCapitalize = "none"
                autoCorrect={false}
                value={searchinput}
                onSubmitEditing={() => this.props.navigation.navigate('DataPage', { mode, level, id: searchinput })}
                onChangeText={searchinput => this.setState({ searchinput })}
                underlineColorAndroid = 'transparent'
                clearButtonMode="always"
              />
              <TouchableOpacity style={styles.buttonsearch}>
                  <Text style={styles.searchText}  onPress={() => this.props.navigation.navigate('DataPage', { mode, level, id: searchinput })}>SEARCH</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.searchcontainer}>
            <Text style={styles.keytext}>----------- or -----------</Text>
            <Text style={styles.keytext}></Text>
          </View>
          <View style={styles.qrcontainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Scan', { level, mode })}>
              <Image
                style={styles.qricon}
                source={require('../../img/qricon.png')} /></TouchableOpacity>
            
            <Text style={styles.keytext}> </Text>
            <Text style={styles.keytext}> </Text>
            <Text onPress={this._return}>Cancel</Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
  _return = () => {

    //AsyncStorage.clear();
    this.props.navigation.navigate('Menu');

  }
}



const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#FFC312',
    justifyContent: 'center',
  },
  searchcontainer: {
    justifyContent: 'center',
    backgroundColor: '#FFC312',
    marginBottom: 20,
  },
  qrcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFC312',
    marginBottom: 20,
  },
  keytext: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold'

  },
  qricon: {
    height: 100,
    width: 100,
    alignItems: 'center',
    marginBottom: 5,
  },
  searchinput:{
    height:40,
    backgroundColor:'rgba(255,0,0,0.2)',
    marginBottom:10,
    color:'white',
    paddingHorizontal:25,
    fontSize:15,
    textAlign:'center',
    borderRadius:10
  },
  searchText:{
    textAlign:'center',
    fontSize:15,
    fontWeight:'bold',
    color:'#FFFF',
  },
  buttonsearch:{
    backgroundColor:'#0652DD',
    paddingVertical:10,
    borderRadius:50
  },
});
