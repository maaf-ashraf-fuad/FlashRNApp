import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native';
import { Button, Spinner } from '../common';
import Parent from './Parent';
import Children from './Children';
import { connect } from 'react-redux';
import { fetchHelper, setMenuState } from '../../actions';
//import { Header } from 'react-navigation';
import { Header } from 'react-native-elements';

class DataPage extends PureComponent {
_didFocusSubscription;
_willBlurSubscription;

constructor(props) {
  super(props);
  this._didFocusSubscription = props.navigation.addListener('didFocus', () =>
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
  );
}

componentDidMount() {
    const { fetchHelper, navigation } = this.props;
    //navigation.setParams({ fetchHelper })
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
  }

  onBackButtonPressAndroid = () => {
    const { fetchHelper, loading, navigation: {state: { params: { back }}}} = this.props;
    if (loading===false){
      fetchHelper({ action: { type: 'back' }, next: back });
    }
    return true;
  };

  handleHome = () => {
    const {fetchHelper} = this.props;
    fetchHelper({ action: { type: 'reset' }, next: { type: 'Reset' } })
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  static navigationOptions = ({navigation}) => {
    const {fetchHelper, back } = navigation.state.params;
    const onPress = () => {
      fetchHelper&&fetchHelper({ action: { type: 'back' }, next: back });
    }
    return ({
      headerLeft: (
        <Button iconName='arrow-back' iconColor='#fff' iconStyle={{ marginLeft: 15 }} onPress={onPress} />
      ),
      headerRight: (
        <Button
          iconName='home'
          iconColor='#fff'
          iconStyle={{ marginRight: 15 }}
          onPress={() => fetchHelper&&fetchHelper({ action: { type: 'reset' }, next: { type: 'Reset' } })}
        />
        )
    })
  };

  navigate = (pageName, {next}) => {
    const { navigation, fetchHelper } = this.props;
    if (pageName==='DataPage'){
      return fetchHelper({ action: { type: 'push', routeName: pageName }, back: { ...navigation.getParam('next', null)}, next });
    }
    navigation.push(pageName, { back: { ...navigation.getParam('next', null)}, next });
  }

  render(){
    const { loading, error, navigation } = this.props;

    return (
      <KeyboardAvoidingView enabled behavior='padding' style={{ flex: 1, backgroundColor:'#ffd294'}}>
          <Image source= { require('../../img/bg2.png')} style= {{ position:'absolute', top: 52, resizeMode: 'cover'}} />
          <Header
            outerContainerStyles={styles.header}
            innerContainerStyles={{ justifyContent: 'space-between' }}
            leftComponent={<Button iconName='arrow-back' iconColor='#fff' onPress={this.onBackButtonPressAndroid} />}
            centerComponent={<Image source={ require('../../img/flash.png')} style={{ resizeMode: 'stretch', height: 20, width: 100 }}/>}
            rightComponent={<Button iconName='home' iconColor='#fff' onPress={this.handleHome}/>}
          />
          {/*
            loading?
            <Spinner />:
            <ScrollView>
              <Parent/>
              <Children current={navigation.getParam('next', null)}/>
              <View style={{ height: 20 }}/>
            </ScrollView>
          */}
          {
            loading?
            <Spinner />:
            <View style={{ flex: 1 }}>
              <Parent/>
              <Children current={navigation.getParam('next', null)}/>
            </View>
          }
        </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#d03c1b',
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },
});

const mapStateToProps = ({ data: { loading, error, parent }}) => {
  return { loading, error, parent };
};

export default connect(mapStateToProps, { fetchHelper, setMenuState })(DataPage);
