import React, { Component } from 'react';
import { Header, ListItem, Text, Icon } from 'react-native-elements';
import { ScrollView, View, Image, FlatList } from 'react-native';
import { Card, CardSection } from '../common'
import data from './LibraryList.json';
import QRCode from 'react-native-qrcode';
import _ from 'lodash';

//const { UIManager } = NativeModules;
//UIManager.setLayoutAnimationEnabledExperimental(true);

class  DataPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parent: data,
      child: data.children,
      back: undefined,
      childCollapsed: false,
      parentCollapsed: true
  };
}

componentDidMount() {
  this.mapParent(data);
  const clone = Object.assign({}, ...data);
  console.log(clone);
  //console.log(data);
  //this.renderData(data, data.children);
}

mapParent = (items) => {
  _.map(items.children, (item) => {
    item.parent = items;
      _.map(item.children, (child) => {
        child.parent = item;
      });
  });
  return items;
}

renderData = (parent, child, back) => {
  this.setState({
    parent,
    child,
    back
  });
}

renderSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: '#CED0CE',
        marginLeft: 42
      }}
    />
  );
};

renderItem = ({ item }) => {
  return (
    <ListItem
      title={`Id: ${item.id}`}
      subtitle={`QR Code: ${item.QR_code_id}`}
      rightIcon={<QRCode value={item.QR_code_id} size={ 30 }/>}
      leftIcon={{ name: 'level-down', type: 'entypo', color:'#517fa4' }}
      containerStyle={{ borderBottomWidth: 0, backgroundColor: '#fff' }}
      onPress={() => {this.renderData(item, item.children, item.parent)}}
    />
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

renderChild () {
  const { child, childCollapsed } = this.state;
  if (child !== undefined && childCollapsed){
    return (
      <Card>
        <CardSection style={{ justifyContent: 'space-between', backgroundColor:'#ecedf2' }}>
          <Text h4>{ _.head(child).type }</Text>
          <Icon name='keyboard-arrow-down' color='grey' onPress={() => this.setState({childCollapsed: false})} />
        </CardSection>
      </Card>
    )
  } else if (child !== undefined && childCollapsed === false){
    return (
      <Card>
        <CardSection style={{ justifyContent: 'space-between', backgroundColor:'#ecedf2' }}>
          <Text h4>{ _.head(child).type }</Text>
          <Icon name='keyboard-arrow-up' color='grey' onPress={() => this.setState({childCollapsed: true})} />
        </CardSection>
        <FlatList
          data={child}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
        />
      </Card>
    )
  }
}

keyExtractor = (item) => item.id;

renderHeaderBack() {
  const { back } = this.state;
  if (back!==undefined){
    return (
        <Icon name='arrow-back' color='#fff' onPress={() =>
          this.renderData(
            back,
            back.children,
            back.parent
        )}/>
    )
  }
}

render() {
  const { parent } = this.state;
  return (
    <View style={{ flex: 1, backgroundColor:'#f5f5f5' }}>
      <Image source= { require('../../img/bg2.png')} style= {{position:'absolute', top: 68, resizeMode: 'cover', flex: 1}} />
      <Header
        backgroundColor='#d03c1b'
        outerContainerStyles={{ borderBottomWidth:0 }}
        leftComponent={this.renderHeaderBack()}
        centerComponent={<Image source={ require ('../../img/flash.png') }
        style={{resizeMode: 'stretch', height: 20, width: 100 }}/>}
        rightComponent={{ icon: 'home', color: '#fff' }}
      />
      {/*}<View style={{ backgroundColor:'#d03c1b' }}>
        <Text style={{ marginLeft: 15, fontSize: 15, color: 'white' }}>
          \\Frame\
        </Text>
      </View>*/}
      <ScrollView>
        <View style={{ height: 75 }} />
        <Card>
          <CardSection style={{ justifyContent: 'space-between', backgroundColor:'#ecedf2' }}>
            <Text h4>{parent.type}</Text>
            <Icon name='menu' color='grey' />
          </CardSection>
          <CardSection>
            <View style={{ justifyContent: 'center' }} >
              <QRCode value={parent.QR_code_id} size={ 50 }/>
            </View>
            <View style={{ paddingLeft: 10, justifyContent: 'center' }}>
              <Text>Id: {parent.id}</Text>
              <Text>QR code id: {parent.QR_code_id}</Text>
            </View>
          </CardSection>
        </Card>
        {this.renderChild()}
      </ScrollView>
    </View>
  );
}}

export default DataPage;
