import React, { component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Picker,
  AsyncStorage,
  Alert
} from 'react-native';
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import { Button, Card, CardSection } from '../common';
import { Type } from '../DataPage/types';
import { connect } from 'react-redux';
import { fetchHelper, setMenuState, logout } from '../../actions';

class menu extends React.Component {

  componentDidMount(){
    //this.props.setMenuState({ searchText: 'PUJ1_FDFRW4_V3' });
    this.props.navigation.setParams({ logout: this.props.logout });
  }

  static navigationOptions = ({navigation}) => {
    const { logout } = navigation.state.params;
    //console.log(navigation.state.params);
    const onPress = () => {
      //console.log(back);
      logout&&logout();
      //navigation.goBack();

      //fetchHelper({ action: { type: 'push', routeName: 'DataPage' }, next: { type: searchType, id: searchText }, back: { type: 'Reset' }});
    }
    return ({
      headerRight: (
        <Button iconName='sign-out' iconType='octicon' iconColor='#fff' iconStyle={{ marginRight: 15 }} onPress={onPress} />
      )
    })
  };

  handleSearchTypeInput = (searchType) => this.props.setMenuState({searchType});

  handleSearchTextInput = (searchText) => this.props.setMenuState({searchText});

  handleSearchButtonPress = () => {
    const {navigation, fetchHelper, searchType, searchText, error} = this.props;
    //fetchHelper({type: searchType, id: searchText });
    fetchHelper({ action: { type: 'push', routeName: 'DataPage' }, next: { type: searchType, id: searchText }, back: { type: 'Reset' }});
    /*if (searchText === ''||searchText === null){
      navigation.navigate('DataPage', { next: { type: searchType, id: searchText }, back: { type: 'Reset' }, fetchHelper });
    }*/
  }

  handleQRButtonPress = () => this.props.navigation.navigate('Scan', { next: {type: this.props.searchType}});

  render(){
    const { searchType, searchText, error, loading } = this.props;
    //console.log(this.props);
    return (
        <KeyboardAvoidingView enabled behavior='padding' style={{ flex: 1, backgroundColor:'#ffd294' }}>
        <Image source= { require('../../img/bg2.png')} style= {{ position: 'absolute', top: -5, resizeMode: 'cover'}} />
          <Card style={{ marginTop: 75, borderRadius: 5, paddingBottom: 20 }}>
            <CardSection style={{ padding: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ecedf2' }}>
              <Text style={{ fontSize: 16 }}>Search Type:</Text>
              <Picker
                selectedValue={searchType}
                style={{ height: 50, width: 110 }}
                onValueChange={this.handleSearchTypeInput}>
                <Picker.Item label='Frame' value='Frame' />
                <Picker.Item label='Shelf' value='Shelf' />
                <Picker.Item label='NE' value='NE' />
              </Picker>
            </CardSection>
            <View>
              <View style={{ height: 150, justifyContent: 'space-between', marginHorizontal: 20 }}>
                <FormLabel labelStyle={{ fontSize: 14 }}>{searchType} {searchType==='Frame'?'Name':'ID'}</FormLabel>
                <FormInput
                  value={searchText}
                  inputStyle={{ paddingLeft: 5 }}
                  underlineColorAndroid='black'
                  placeholder={Type[searchType].menuPlaceholder}
                  onChangeText={this.handleSearchTextInput}
                  returnKeyType='go'
                  keyboardType={searchType==='Shelf'?'numeric':'default'}
                  //style={{ marginBottom: 0 }}
                  autoCapitalize = 'none'
                  autoCorrect={false}
                  clearButtonMode='always'
                  onSubmitEditing={this.handleSearchButtonPress}
                />
                <FormValidationMessage containerStyle={{ marginBottom: 10}} labelStyle={{ textAlign: 'center' }}>{error}</FormValidationMessage>
                <Button border loading={loading} disabled={loading}
                  buttonStyle={{ margin: 15, borderRadius: 10 }}
                  buttonText='Search'
                  onPress={this.handleSearchButtonPress}
                />
              </View>
              {searchType === 'NE'?null:
                <View style={{ justifyContent: 'space-between', alignItems: 'center', margin: 5, marginHorizontal: 25 }}>
                  <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: 'bold', marginBottom: 15 }}>
                    ------------ or ------------
                  </Text>
                  <TouchableOpacity onPress={this.handleQRButtonPress}>
                    <Image style={{ height: 100, width: 100, alignItems: 'center'}}
                      source={require('../../img/qricon.png')}
                    />
                  </TouchableOpacity>
                </View>
              }
            </View>
          </Card>
        </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  const { searchText, searchType, error, loading } = state.data;
  //let data = _.omitBy(state.data, (val, key) => key === 'ns2:LIST_FRAME_UNIT' || key === 'parent');
  //data = _.mapKeys(data, (val, key) => key.replace('ns2:',''));
  //const a = state.data['ns2:LONGITUDE'];
  return { searchText, searchType, error, loading };
};

export default connect(mapStateToProps, { fetchHelper, setMenuState, logout })(menu);
