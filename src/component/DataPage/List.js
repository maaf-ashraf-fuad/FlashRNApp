import React, { PureComponent } from 'react';
import { ListItem, Icon } from 'react-native-elements';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity
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

  handleOnLayout = (event) => {
    const {x, y, width, height} = event.nativeEvent.layout;
    console.log ('x:', x);
    console.log ('y:', y);
    console.log ('width:', width);
    console.log ('height:', height);
  }

  getItemLayout = (data, index) => {
    const { type, flag } = this.props;
    const length = flag?41:19 * Object.keys(Type[type].child_fields).length + 25;
    return ({
    length,
    offset: length * index,
    index
  })
}

  renderItemChildren = ({ item, index }) => {
    const { type, fetchHelper, current } = this.props;
    const title = (
      <View>
        {
          Type[type].child_fields.map( subitem =>
            <Text key={subitem.key}><Text style={{ fontWeight: 'bold' }}>{subitem.label}</Text>{item[subitem.field]}</Text>
          )
        }
      </View>
    );

    const leftIcon = (
      <View style={{ borderColor: '#CED0CE', borderRightWidth: 1, marginRight: 15, paddingRight: 10 }}>
        <Text style={{ fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center' }}>{ index + 1 }</Text>
      </View>
    );

    /*return (
      <ListItem
        title={title}
        //leftIcon={{ name: 'level-down', type: 'entypo', color:'#ff9a1e' }}
        leftIcon={leftIcon}
        containerStyle={{ borderBottomWidth: 0, backgroundColor: '#fff' }}
        onPress={() => fetchHelper({ action: { type: 'push', routeName: 'DataPage' }, back: { ...current }, next: { type, id: item[Type[type].id], qr: '', item }})}
      />
    )*/

    return (
      <TouchableOpacity activeOpacity={0.9} style={index % 2?styles.rowEven:styles.rowOdd} onPress={() => fetchHelper({ action: { type: 'push', routeName: 'DataPage' }, back: { ...current }, next: { type, id: item[Type[type].id], qr: '', item }})}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ width: 38, alignItems: 'center'/*, paddingLeft: 15, paddingRight: 15*/ }}>
          <Text style={{ fontWeight: 'bold', textAlignVertical: 'center' }}>{ index + 1 }</Text>
        </View>
        {/*<View style={{ padding: 7.5, borderColor: '#d03c1b', borderTopWidth: 1.5, borderRightWidth: 1.5, transform: [{rotate: '45deg' }]}} />
        <View style={{ height: '15', borderColor: '#CED0CE', borderRightWidth: 1 }} />*/}
          <View style={{ flexDirection: 'column', justifyContent: 'space-around', alignItems: 'flex-start', marginVertical: 6, paddingTop: 6, paddingBottom: 6, paddingRight: 12, paddingLeft: 12, borderColor: '#CED0CE', borderLeftWidth: 1 }}>
            {
              Type[type].child_fields.map( subitem =>
                <Text style={{ textAlign: 'center', textAlignVertical: 'center'}} key={subitem.key}><Text style={{ fontWeight: 'bold' }}>{subitem.label}</Text>{item[subitem.field]}</Text>
              )
            }
          </View>
        </View>
        <Icon containerStyle={{ marginRight: 15 }} name='chevron-right' color='grey' />
      </TouchableOpacity>
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
          marginLeft: 0
        }}
      />
    )
  }

  render(){
    const { type, lastChildIndex } = this.props;
    return(
        <FlatList
          data={this.props.data}
          renderItem={this.props.flag?this.renderItemHeader:this.renderItemChildren}
          keyExtractor={this.props.flag?this.keyExtractorHeader:this.keyExtractorChild}
          ItemSeparatorComponent={this.renderSeparator}
          getItemLayout={this.getItemLayout}
          initialNumToRender={20}
          //style={{ marginBottom: 280 }}
          //initialScrollIndex={flag?0:indexClicked}
          //removeClippedSubviews={false}
        />
    )
  }
}

const styles = StyleSheet.create({
  rowOdd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  rowEven: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

const mapStateToProps = ({ data: { loading, error }}) => {
  return { loading, error };
};

export default connect(mapStateToProps, { fetchHelper })(List);
