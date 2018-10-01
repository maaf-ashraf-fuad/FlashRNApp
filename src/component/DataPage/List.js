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
import { connect } from 'react-redux';
import { Spinner } from '../common';
import { fetchHelper } from '../../actions';
import _ from 'lodash';

class List extends PureComponent {

  constructor(props) {
      super(props);
      this.state = {
        data: props.flag?props.parentDetails:props.lastIndex>=20?_.slice(props.child, 0, props.lastIndex+2):_.slice(props.child, 0, 20),
        page: 1,
        seed: 20,
        error: null,
        more: props.flag?false:props.child.length > 20,
        refreshing: false
      };
  }

  lastTap = null;

  handleLoadMore = () => {
    const { child } = this.props;
    const { page, seed, data } = this.state;
    /*console.log (((page + 1) * seed), child.length);
    this.setState(
      {
        data: _.slice(child, 0, (page + 1) * seed),
        page: page + 1,
        more: ((page + 1) * seed) <= child.length,
      }
    );*/
    this.setState(
      {
        data: _.slice(child, 0, data.length + seed),
        page: page + 1,
        more: (data.length + seed) <= child.length,
      }
    );
  }

  handleHeaderOnPress(val){
    const { onPress } = this.props;
      const now = Date.now();
      if (this.lastTap && (now - this.lastTap) < 300) {
        val&&onPress(val);
      } else {
        this.lastTap = now;
      }
  }


  handleChildOnPress(item, index){
    const { current, type, fetchHelper } = this.props;
    //requestAnimationFrame(() =>
    fetchHelper({ action: { type: 'push', routeName: 'DataPage' },
                    back: { ...current, lastIndex: index },
                    next: { type, id: item[Type[type].id], qr: '', item: type==='Core'?item:null }});
  }

  /*renderItemHeader = ({ item, index }) => {
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
}*/

  renderItemHeader = ({ item, index }) => {
    const title=<Text style={{ fontWeight: 'bold' }}>{item.name.toUpperCase()}</Text>;
    return (
      <ListItem
        title={ title }
        textInput
        textInputEditable={false}
        onPress={()=>this.handleHeaderOnPress(item.value)}
        textInputValue={item.value}
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
            <Text key={subitem.key}><Text style={{ fontWeight: 'bold' }}>{subitem.label}</Text>{item[subitem.field]!=='Null'?item[subitem.field]:null}</Text>
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
      //<TouchableOpacity activeOpacity={0.9} style={index % 2?styles.rowEven:styles.rowOdd} onPress={ fetchHelper({ action: { type: 'push', routeName: 'DataPage' }, back: { ...current, lastIndex: index + 1 }, next: { type, id: item[Type[type].id], qr: '', item }})}>
      <TouchableOpacity activeOpacity={0.9} style={index % 2?styles.rowEven:styles.rowOdd} onPress={ () => this.handleChildOnPress(item, index) }>
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

  keyExtractor = (item) => {
    const { flag, type } = this.props;
    if (flag){
      return item.key;
    }
    return item[Type[type].key];
  }

  renderSeparator = () => {
    //const margin = this.props.flag?0:42;

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

  renderEmptyList = () => {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Spinner />
      </View>
    )
  }

  renderFooter = () => {
    if (!this.props.flag) return null;

    return (
      <View
        style={{
          padding: 5,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text>Double tap to copy value to Clipboard</Text>
      </View>
    );
  };

  render(){
    const { type, lastChildIndex, child, parentDetails, flag, lastIndex } = this.props;
    const { more } = this.state;
    return(
        <FlatList
          //data={flag?parentDetails:child}
          data={this.state.data}
          renderItem={flag?this.renderItemHeader:this.renderItemChildren}
          //keyExtractor={flag?this.keyExtractorHeader:this.keyExtractorChild}
          keyExtractor={this.keyExtractor}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
          getItemLayout={this.getItemLayout}
          initialNumToRender={20}
          maxToRenderPerBatch={5}
          onEndReachedThreshold={1}
          onEndReached={more&&this.handleLoadMore}
          //CellRendererComponent={this.renderEmptyList}
          //style={{ marginBottom: 280 }}
          initialScrollIndex={flag?0:lastIndex}
          //removeClippedSubviews={false}
          //removeClippedSubviews
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

const mapStateToProps = ({ data: { loading, error, parentDetails, child, lastIndex }}) => {
  return { loading, error, child, parentDetails, lastIndex };
};

export default connect(mapStateToProps, { fetchHelper })(List);
