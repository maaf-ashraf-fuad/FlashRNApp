import React, { PureComponent } from 'react';
import { ListItem, Text } from 'react-native-elements';
import {
  View,
  FlatList
} from 'react-native';
import { Type } from './types';
import NavigationService from '../../navigation/NavigationService.js';
import { connect } from 'react-redux';
import { fetchHelper } from '../../actions';

class List extends PureComponent {

  handleHeaderOnPress = (val) => {
    const { onPress } = this.props;
    val&&onPress(val);
  };

  renderItemHeader = ({ item, index }) => {
    const title=<Text style={{ fontWeight: 'bold' }}>{ Object.keys(item)[0].toUpperCase() }</Text>;
    return (
      <ListItem
        title={ title }
        textInput
        textInputEditable={false}
        onPress={()=>this.handleHeaderOnPress(Object.values(item)[0])}
        textInputValue={Object.values(item)[0]}
        textInputStyle={{ textAlign: 'left' }}
        containerStyle={index%2?{ borderBottomWidth: 0, backgroundColor: '#f5f5f5' }:{ borderBottomWidth: 0, backgroundColor: '#fff' }}
        hideChevron
      />
    )
  }

  renderItemChildren = ({ item }) => {
    const { type, fetchHelper, current } = this.props;
    const title=(
      <View>
        {
          Type[type].child_fields.map( subitem =>
            <Text key={subitem.key}><Text style={{ fontWeight: 'bold' }}>{subitem.label}</Text>{item[subitem.field]!=='Null'?item[subitem.field]:null}</Text>
          )
        }
      </View>
    );

    return (
      <ListItem
        title={title}
        leftIcon={{ name: 'level-down', type: 'entypo', color:'#ff9a1e' }}
        containerStyle={{ borderBottomWidth: 0, backgroundColor: '#fff' }}
        onPress={() => fetchHelper({ action: { type: 'push', routeName: 'DataPage' }, back: { ...current }, next: { type, id: item[Type[type].id], qr: '', item }})}
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
    return(
      <FlatList
        data={this.props.data}
        renderItem={this.props.flag?this.renderItemHeader:this.renderItemChildren}
        keyExtractor={this.props.flag?this.keyExtractorHeader:this.keyExtractorChild}
        ItemSeparatorComponent={this.renderSeparator}
        /*getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index
        })}*/
      />
    )
  }
}

const mapStateToProps = ({ data: { loading, error }}) => {
  return { loading, error };
};

export default connect(mapStateToProps, { fetchHelper })(List);
