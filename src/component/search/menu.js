import React, { PureComponent } from 'react';
import {
  BackHandler,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Picker,
  Keyboard,
  Alert
} from 'react-native';
import { FormInput, FormValidationMessage} from 'react-native-elements';
import { Button, Card, CardSection, ModalDropdown } from '../common';
import { Type } from '../DataPage/types';
import { connect } from 'react-redux';
import { fetchHelper, setMenuState, logout } from '../../actions';

class menu extends PureComponent {
_didFocusSubscription;
_willBlurSubscription;

constructor(props) {
  super(props);
  this._didFocusSubscription = props.navigation.addListener('didFocus', () =>
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
  );
}
  componentDidMount(){
    this.props.navigation.setParams({ logout: this.props.logout });
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    Alert.alert("Flash 2.0", 'Are you sure you want to exit?',
      [
        {
          text: 'Yes', onPress: () => BackHandler.exitApp()
        },
        {
          text: 'No'
        }
      ]
    );
    return true;
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  static navigationOptions = ({navigation}) => {
    /*const { params } = navigation.state;
    //console.log(navigation.state.params);
    const onPress = () => {
      //console.log(back);
      params.logout&&params.logout();
      //navigation.goBack();

      //fetchHelper({ action: { type: 'push', routeName: 'DataPage' }, next: { type: searchType, id: searchText }, back: { type: 'Reset' }});
    }*/
    return ({
      headerRight: (
        <Button iconName='sign-out' iconType='octicon' iconColor='#fff' iconStyle={{ marginRight: 15 }} onPress={navigation.state.params&&navigation.state.params.logout} />
      )
    })
  };

  handleSearchTypeInput = (searchType) => this.props.setMenuState({ searchType });

  handleSearchTextInput = (searchText) => this.props.setMenuState({ searchText });

  handleSearchButtonPress = () => {
    const {navigation, fetchHelper, searchType, searchText, error} = this.props;
    Keyboard.dismiss();
    fetchHelper({
      action: { type: 'push', routeName: 'DataPage' },
      next: { type: searchType, id: searchType==='Frame'?searchText.toUpperCase():searchText },
      back: { type: 'Reset' }});
    /*if (searchText === ''||searchText === null){
      navigation.navigate('DataPage', { next: { type: searchType, id: searchText }, back: { type: 'Reset' }, fetchHelper });
    }*/
  }

  handleQRButtonPress = () => {
    this.props.setMenuState({ error: '' });
    this.props.navigation.navigate('Scan', { next: {type: 'QR'}});
  }

  render(){
    const { searchType, searchText, error, loading } = this.props;
    //console.log(this.props);
    return (
        <KeyboardAvoidingView enabled behavior='padding' style={{ flex: 1, backgroundColor:'#ffd294' }}>
        <Image source= { require('../../img/bg2.png')} style= {{ position: 'absolute', top: -1, resizeMode: 'cover'}} />
          <Card style={{ marginTop: 75, borderRadius: 5 }}>
            <CardSection style={{ padding: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ecedf2' }}>
              {/*<Text style={{ fontSize: 16 }}>Search Type:</Text>
              <Picker
                selectedValue={searchType}
                style={{ height: 50, width: 110 }}
                onValueChange={this.handleSearchTypeInput}>
                <Picker.Item label='Frame' value='Frame' />
                <Picker.Item label='Shelf' value='Shelf' />
                <Picker.Item label='NE' value='NE' />
              </Picker>*/}
              <Text style={{ fontSize: 16, height: 45, textAlignVertical: 'center' }}>Search Menu</Text>
            </CardSection>
            <View>
              <View style={{ justifyContent: 'center', marginHorizontal: 20 }}>
                {/*<FormLabel labelStyle={{ fontSize: 14 }}>{searchType} {searchType==='Frame'?'Name':'ID'}</FormLabel>*/}
                <Picker
                  selectedValue={searchType}
                  style={{ height: 20, width: 155, marginTop: 20, marginLeft: 10 }}
                  itemStyle={{ fontSize: 14 }}
                  onValueChange={this.handleSearchTypeInput}>
                  <Picker.Item label='Frame Name' value='Frame' />
                  {/*<Picker.Item label='Shelf Id' value='Shelf' />*/}
                </Picker>
                <FormInput
                  value={searchText}
                  inputStyle={{ paddingLeft: 5 }}
                  containerStyle={{ height: 38 }}
                  underlineColorAndroid='black'
                  placeholder={Type[searchType].menuPlaceholder}
                  onChangeText={this.handleSearchTextInput}
                  returnKeyType='go'
                  //keyboardType={searchType==='Shelf'?'numeric':'default'}
                  //style={{ marginBottom: 0 }}
                  autoCapitalize = {searchType==='Frame'?'characters':'none'}
                  autoCorrect={false}
                  clearButtonMode='always'
                  onSubmitEditing={this.handleSearchButtonPress}
                />
                <FormValidationMessage labelStyle={{ textAlign: 'center' }}>{error}</FormValidationMessage>
                <Button border loading={loading} disabled={loading}
                  buttonStyle={{ borderRadius: 10 }}
                  buttonText='Search'
                  onPress={this.handleSearchButtonPress}
                />
                <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: 'bold'}}>
                  ------ OR ------
                </Text>
              </View>
              <TouchableOpacity disabled={loading} style={{ alignSelf: 'center', margin: 20 }} onPress={this.handleQRButtonPress}>
                <Image style={{ height: 100, width: 100, alignItems: 'center'}}
                  source={require('../../img/qricon.png')}
                />
              </TouchableOpacity>
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
