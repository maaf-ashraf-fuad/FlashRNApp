import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform
} from 'react-native';
import { Icon, SearchBar, ListItem } from 'react-native-elements';
import { CardSection } from './CardSection';
import { Card } from './Card';
import _ from 'lodash';
//import { Card } from './Card';
//import QRCode from 'react-native-qrcode-svg';

//const CenterModal = ({ headerText, visible, qrCode, onClose, onDecline }) => {

class CenterModal extends Component {

  constructor(props) {
      super(props);
      this.state = {
        details: []
    };
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: '#CED0CE'
          //backgroundColor: '#CED0CE',
          //marginLeft: 42
        }}
      />
    );
  };

  keyExtractor = (item) => Object.keys(item)[0];

  renderItem = ({ item, index }) => {
    const title=<Text style={{ fontWeight: 'bold' }}>{ Object.keys(item)[0].toUpperCase() }</Text>;

    return (
      //<View style={{ flex: 1 }}>
        <ListItem
          //title={`Id: ${item.id}`}
          title={ title }
          //subtitle={`QR Code: ${item.QR_code_id===undefined?'No QR Code':item.QR_code_id}`}
          //subtitle={Object.values(item)[0]}
          textInput
          textInputEditable={ false }
          textInputValue={ ':      ' + Object.values(item)[0] }
          textInputStyle={{ textAlign: 'left' }}
          //textInputContainerStyle={{ borderWidth: 1 }}
          //leftIcon={{ name: 'chevron-right', color:'grey' }}
          containerStyle={ index%2?styles.listItemContainerOddStyle:styles.listItemContainerEvenStyle }
          //onPress={() => {this.renderData(item, item.children, item.parent)}}
          hideChevron
        />
//</View>
    )
  };

  renderFooter = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: '#CED0CE'
        }}
      />
    );
  };

  render(){
    const { containerStyle, textStyle, cardSectionStyle, headerStyle, searchBarStyle } = styles;
    const { visible, headerText, onClose, data} = this.props;
    const { details } = this.state;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
        <View style={ containerStyle }>
          <CardSection style={ headerStyle }>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={ textStyle }>
                {headerText}
              </Text>
            </View>
            <Icon name='close' onPress={ onClose }/>
          </CardSection>
          <View style={ cardSectionStyle }>
            <SearchBar
              round
              lightTheme
              showLoading
              containerStyle={ searchBarStyle }
              inputStyle={{ backgroundColor: '#fff' }}
              searchIcon={{ name: 'search', size: 30 }}
              //clearIcon={{ name: 'close' }}
              //onChangeText={console.log('a')}
              //onClear={console.log('a')}
              placeholder='Type Here...' />
              <FlatList
                data={this.props.data}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                ItemSeparatorComponent={this.renderSeparator}
                ListFooterComponent={this.renderFooter}
              />
            </View>
          </View>
      </Modal>
  )}
}

const styles = StyleSheet.create({
containerStyle: {
  backgroundColor: 'rgba(0, 0, 0, 0.25)',
  position: 'relative',
  flex: 1,
  //justifyContent: 'center',
  //flexDirection: 'row',
  padding: 15,
  ...Platform.select({
    ios: {
      marginTop: Expo.Constants.statusBarHeight,
    }
  }),
},
headerStyle: {
  //justifyContent: 'space-between',
  //flexDirection: 'row',
  //backgroundColor: '#d03c1b',
  borderBottomWidth: 0,
  //backgroundColor:'#ecedf2',
  backgroundColor:'#ECEDF2',
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0
},
searchBarStyle: {
  borderTopWidth: 0,
  borderBottomWidth: 2,
  //borderBottomColor: '#838383',
  borderBottomColor: '#DDD',
  backgroundColor: '#ECEDF2',
},
listItemContainerEvenStyle: {
   borderBottomWidth: 0,
   backgroundColor: '#fff',
},
listItemContainerOddStyle: {
   borderBottomWidth: 0,
   backgroundColor: '#f5f5f5',
},
cardSectionStyle: {
  justifyContent: 'flex-start',
  backgroundColor: '#fff',
  borderRadius: 0,
  flex: 1,
  },
textStyle: {
  //flex: 1,
  fontSize: 15,
  textAlign: 'center',
  fontWeight: 'bold',
  //justifyContent: 'center',
  //textAlignVertical : 'bottom',
  //color: '#838383',
  marginLeft: 5,
  //alignSelf: 'center',
  //textShadowColor: '#000',
  //textShadowOffset: { width: 0, height: 2 },
  lineHeight: 30
},
qrContainerStyle: {
  justifyContent: 'center',
  borderColor: '#434343',
  borderRadius: 50,
  //borderWidth: 1,
  padding: 16,
  backgroundColor: '#838383'
},
});

export { CenterModal };
