import React, { Component } from 'react';
import { Header, ListItem, Text, Icon, Divider } from 'react-native-elements';
import { Popover } from 'react-native-modal-popover';
import { findNodeHandle, NativeModules, Platform, TouchableOpacity, ScrollView, View, Image, FlatList, StyleSheet } from 'react-native';
import { Card, CardSection, CenterModal, Button } from '../common'
import data from './LibraryList.json';
import QRCode from 'react-native-qrcode-svg';
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
      parentDetails: [],
      showModal: false,
      showPopover: false,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 }
  };
}

componentDidMount() {
  this.mapParent(data);
  this.renderData(data, data.children);
}

/*componentWillUpdate() {
  LayoutAnimation.spring();
}*/

renderData = (parent, child, back, parentDetails) => {
  parentDetails = _.map(
         _.toPairs(
           _.omitBy(parent, (val, key) => key === 'children' || key === 'parent')
         ), d => _.fromPairs([d])
       );
  this.setState({
    parent,
    child,
    back,
    parentDetails
  });
}

setButton = (e) => {
  const handle = findNodeHandle(this.button);
  if (handle) {
    NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
      //console.log('x0:' + x0, y0, width, height, x, y);
      this.setState({ popoverAnchor: { x, y: (Platform.OS === 'android'?y-23:y-5) , width, height } });
      //this.setState({ popoverAnchor: { x, y, width, height } });
    });
  }
};

openPopover = () => this.setState({ showPopover: true, showModal: false  });

closePopover = () => this.setState({ showPopover: false });

openModal = () => this.setState({ showPopover: false, showModal: true });

closeModal = () => this.setState({ showModal: false });

mapParent = (items) => {
  _.map(items.children, (item) => {
    item.parent = items;
      _.map(item.children, (child) => {
        child.parent = item;
      });
  });
  return items;
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
  const title = <Text><Text style={{ fontWeight: 'bold' }}>ID: </Text>{item.id}</Text>;
  const subtitle = item.QR_code_id===undefined || item.QR_code_id=== null?
    <Text style={{ fontWeight: 'bold' }}>QR Code: <Text style={{ fontWeight: 'bold', color: 'red' }}>No QR Code</Text></Text>:
    <Text><Text style={{ fontWeight: 'bold' }}>QR Code: </Text>{item.QR_code_id}</Text>;

  return (
    <ListItem
      //title={`Id: ${item.id}`}
      title={title}
      //subtitle={`QR Code: ${item.QR_code_id===undefined?'No QR Code':item.QR_code_id}`}
      subtitle={subtitle}
      //leftIcon={{ name: 'level-down', type: 'entypo', color:'#517fa4' }}
      leftIcon={{ name: 'level-down', type: 'entypo', color:'#ff9a1e' }}
      containerStyle={{ borderBottomWidth: 0, backgroundColor: '#fff' }}
      onPress={() => {this.renderData(item, item.children, item.parent)}}
      //onPress={() => this.setState({ showModal:true })}

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
  const { child } = this.state;
  if (child !== undefined){
    return (
      <Card>
        <CardSection style={{ backgroundColor:'#ecedf2' }}>
          <Text h4> { _.head(child).type }</Text>
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

renderHome() {
    return (
        <Icon name='home' color='#fff' onPress={() => console.log('Home')}/>
    )
}

render() {
  const { parent, parentDetails, showPopover, popoverAnchor, showModal } = this.state;

  return (
    <View style={{ flex: 1, backgroundColor:'#f5f5f5' }}>
      <Image source= { require('../../img/bg2.png')} style= {{position:'absolute', top: 68, resizeMode: 'cover', flex: 1}} />
      <Header
        backgroundColor='#d03c1b'
        outerContainerStyles={{ borderBottomWidth:0 }}
        leftComponent={ this.renderHeaderBack() }
        centerComponent={<Image source={ require('../../img/flash.png') }
        style={{ resizeMode: 'stretch', height: 20, width: 100 }}/>}
        //rightComponent={{ icon: 'home', color: '#fff' }}
        rightComponent={ this.renderHome() }
      />
      <ScrollView>
        <View style={{ height: 70 }} />
        <Card>
          <CardSection style={{ justifyContent: 'space-between', backgroundColor:'#ecedf2' }}>
            <Text h4> {parent.type}</Text>
            <Button
              //buttonStyle={{ justifyContent: 'center' }}
              setRef={r => {this.button = r}}
              onPress={this.openPopover}
              onLayout={this.setButton}
              iconName='dots-vertical'
              iconType='material-community'
              //iconStyle={{ color: 'grey' }}
            />
            <Popover
              contentStyle={styles.content}
              arrowStyle={styles.arrow}
              visible={showPopover}
              fromRect={popoverAnchor}
              backgroundStyle={styles.background}
              //onClose={this.closePopover}
              onClose={this.closePopover}
              onDismiss={this.closePopover}
              placement='bottom'
              supportedOrientations={['portrait', 'landscape']}
            >
              <Button
                onPress={this.openModal}
                //onPress={this.print(parent)}
                buttonText={`${parent.type==='Core'?'View/Edit':'View'} ${parent.type} Details`}
                iconName='edit'
                iconType='font-awesome'
              />
              {parent.QR_code_id === undefined || parent.QR_code_id === null || parent.QR_code_id === ""?
                <Button
                  renderDivider
                  onPress={this.openModal}
                  buttonText='Update QR Code'
                  iconName='qrcode'
                  iconType='font-awesome'
                  iconStyle={{ paddingRight: 5 }}
                />:null
              }
              {parent.type === 'Core'?
                <Button
                  renderDivider
                  onPress={this.openModal}
                  buttonText='Transfer Core'
                  iconName='swap-horiz'
                />:null
              }
            </Popover>
            {/*}<PopoverController>
              {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => (
                <Fragment>
                  <TouchableOpacity style={{ justifyContent: 'center' }} ref={setPopoverAnchor} onPress={openPopover}>
                    <Icon name='menu' color='grey' />
                  </TouchableOpacity>
                  <Popover
                    contentStyle={styles.content}
                    arrowStyle={styles.arrow}
                    backgroundStyle={styles.background}
                    visible={popoverVisible}
                    onClose={closePopover}
                    fromRect={popoverAnchorRect}
                    placement='bottom'
                    supportedOrientations={['portrait', 'landscape']}
                  >
                    <Text>Hello from inside popover!</Text>
                  </Popover>
                </Fragment>
              )}
            </PopoverController>*/}
          </CardSection>
          <CardSection>
            <View style={ styles.qr } >
            {
              parent.QR_code_id===undefined || parent.QR_code_id=== null?
              <Icon name='do-not-disturb-alt' size={50} />:
              <QRCode value={parent.QR_code_id} size={50} />
            }
            </View>
            <View style={{ paddingLeft: 10, justifyContent: 'center' }}>
              <Text><Text style={{ fontWeight: 'bold' }}>ID: </Text>{parent.id}</Text>
              {
                parent.QR_code_id===undefined || parent.QR_code_id=== null?
                <Text style={{ fontWeight: 'bold' }}>QR Code: <Text style={{ fontWeight: 'bold', color: 'red' }}>No QR Code</Text></Text>:
                <Text><Text style={{ fontWeight: 'bold' }}>QR Code: </Text>{parent.QR_code_id}</Text>
              }
            </View>
          </CardSection>
        </Card>
        {this.renderChild()}
      </ScrollView>
      <CenterModal
        visible={showModal}
        headerText={`View ${parent.type} Details`}
        onClose={() => this.setState({ showModal: false })}
        onDismiss={() => this.setState({ showModal: false })}
        data={parentDetails}
      />
    </View>
  );
}}

const styles = StyleSheet.create({
  content: {
    padding: 7,
    //borderWidth: 1,
    borderRadius: 3,
    //borderColor: '#ddd',
    backgroundColor: '#fff',
    //borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 1,
  },
  qr: {
    justifyContent: 'center',
    borderColor: '#434343',
    borderWidth: 1,
    padding: 3,
    backgroundColor: '#838383'
  },
  arrow: {
    borderTopColor: '#fff',
  },
  background: {
    backgroundColor: 'rgba(0, 0, 255, 0)',
  },
});

export default DataPage;
