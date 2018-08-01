import React, { Component } from 'react';
import { ListItem, Text } from 'react-native-elements';
import {
  View,
  FlatList
} from 'react-native';
import { Type } from './types';

class List extends Component {
  renderItemHeader = ({ item, index }) => {
    const title=<Text style={{ fontWeight: 'bold' }}>{ Object.keys(item)[0].toUpperCase() }</Text>;
    return (
      <ListItem
        title={ title }
        //subtitle={`QR Code: ${item.QR_code_id===undefined?'No QR Code':item.QR_code_id}`}
        //subtitle={Object.values(item)[0]}
        textInput
        textInputEditable={false}
        //textInputValue={ ':      ' + Object.values(item)[0] }
        textInputValue={Object.values(item)[0]}
        textInputStyle={{ textAlign: 'left' }}
        //textInputContainerStyle={{ flex:1, backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1 }}
        //leftIcon={{ name: 'chevron-right', color:'grey' }}
        containerStyle={index%2?{ borderBottomWidth: 0, backgroundColor: '#f5f5f5' }:{ borderBottomWidth: 0, backgroundColor: '#fff' }}
        //onPress={() => {this.renderData(item, item.children, item.parent)}}
        hideChevron
      />
    )
  }

  renderItemChildren = ({ item, index }) => {
    const { type, fetchHelper, navigate } = this.props;
    const title=(
      <View>
        <Text><Text style={{ fontWeight: 'bold' }}>{Type[type].htext1.label}: </Text>{item[Type[type].htext1.field]}</Text>
        <Text><Text style={{ fontWeight: 'bold' }}>{Type[type].htext2.label}: </Text>{item[Type[type].htext2.field]}</Text>
      </View>
    );

    return (
      <ListItem
        title={title}
        //subtitle={subtitle}
        leftIcon={{ name: 'level-down', type: 'entypo', color:'#ff9a1e', style:{ opacity: (100-index)/100 }}}
        //containerStyle={index%2?{ borderBottomWidth: 0, backgroundColor: '#f5f5f5' }:{ borderBottomWidth: 0, backgroundColor: '#fff' }}
        containerStyle={{ borderBottomWidth: 0, backgroundColor: '#fff' }}
        //onPress={() => fetchHelper({type: type, back_type: back_type} , {id: item[Type[type].htext1.field], qr: '', item})}//{ id: item[Type[type].htext1.field], qr: '' })}
        onPress={() => navigate('DataPage', { next: { type, id: item[Type[type].id], qr: '', item }})}//{ id: item[Type[type].htext1.field], qr: '' })}
      />
    )
  }

  keyExtractorHeader = (item) => Object.keys(item)[0];

  keyExtractorChild = (item) => item[Type[this.props.type].id];

  renderSeparator = () => {
    const margin = this.props.flag?0:42;

    return (
      <View
        style={{
          height: 1,
          backgroundColor: '#CED0CE',
          marginLeft: margin
        }}
      />
    )
  }

  render(){
    //console.log(this.props.navigation);
    return(
      <FlatList
        //style={{flex:1}}
        data={this.props.data}
        renderItem={this.props.flag?this.renderItemHeader:this.renderItemChildren}
        keyExtractor={this.props.flag?this.keyExtractorHeader:this.keyExtractorChild}
        ItemSeparatorComponent={this.renderSeparator}
        //ListFooterComponent={this.renderFooter}
        /*getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index
        })}*/
      />
    )
  }
}

export default List;
