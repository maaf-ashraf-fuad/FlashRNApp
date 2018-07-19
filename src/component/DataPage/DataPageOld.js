import React, { Component } from 'react';
import { Header, ListItem, Text, Icon} from 'react-native-elements';
import { Popover } from 'react-native-modal-popover';
import {
  findNodeHandle,
  NativeModules,
  Platform,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  FlatList,
  StyleSheet,
  Easing,
  TextInput,
  KeyboardAvoidingView,
  Alert
  //LayoutAnimation
} from 'react-native';
import data from './LibraryList.json';
import QRCode from 'react-native-qrcode-svg';
import _ from 'lodash';
import { Card, CardSection, Button } from '../common';

//const { UIManager } = NativeModules;
//NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);

class  DataPage extends Component {

  constructor(props) {
    super(props);
    this.mapParent(data);
    this.state = {
      parent: undefined,
      child: undefined,
      back: undefined,
      parentDetails: [],
      headerExpended: false,
      headerMode: null,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      editCore: { ne_id: '', ne_shelf: '', ne_slot: '', ne_port: '', cct_name: '', status: '' }
  };
}

componentDidMount () {
  this.initData();
}

initData (){
  const { parent, child, parentDetails, back } = this.state;
  const qrData = this.props.navigation.getParam('qrData', undefined);
  const level = this.props.navigation.getParam('level', undefined);
  const mode = this.props.navigation.getParam('mode', undefined);
  const item = this.props.navigation.getParam('item', undefined);
  const id = this.props.navigation.getParam('id', undefined);
  console.log ('DataPage - level: ' + level, 'mode: ' + mode, 'id: ' + id, 'qrData: ' + qrData);

  /*console.log(
    qrData, level, mode, item, id
  );*/

  let result = undefined;
  let details = undefined;

  if (level!==undefined && mode!==undefined){
      if (mode==='Menu' && (qrData!==undefined || id!==undefined)){
          if (level === 'Frame'){
            //result = data;
            //qrData!==undefined?result = _.find(data.children, { QR_code_id: qrData }):result = _.find(data.children, { id });
            if (qrData!==undefined) {
              if (data.QR_code_id===qrData){
                result = data;
                details = _.map(
                       _.toPairs(
                         _.omitBy(result, (val, key) => key === 'children' || key === 'parent')
                       ), d => _.fromPairs([d])
                     );
              }
            } else {
              if (data.id===id){
                result = data;
                details = _.map(
                       _.toPairs(
                         _.omitBy(result, (val, key) => key === 'children' || key === 'parent')
                       ), d => _.fromPairs([d])
                     );
            }
          }
          } else if (level === 'Shelf'){

            qrData!==undefined?result = _.find(data.children, { QR_code_id: qrData }):result = _.find(data.children, { id });
            if (result!==undefined){
                details = _.map(
                       _.toPairs(
                         _.omitBy(result, (val, key) => key === 'children' || key === 'parent')
                       ), d => _.fromPairs([d])
                     );
          } else {
            console.log ('Menu: Children not found');
          }
        } else {
          console.log ('Menu: ' + level + ' not found.')
        }
    } else if (mode==='UpdateQR') {
      /*result = _.find(data.children, { id });
      result.QR_code_id = qrData;
      details = _.map(
               _.toPairs(
                 _.omitBy(result, (val, key) => key === 'children' || key === 'parent')
               ), d => _.fromPairs([d])
             );*/
      result = item;
      result.QR_code_id = qrData;
      details = _.map(
               _.toPairs(
                 _.omitBy(result, (val, key) => key === 'children' || key === 'parent')
               ), d => _.fromPairs([d])
             );
    } else if (mode==='Transfer') {

      let ne_id = '', ne_shelf = '', ne_slot = '', ne_port = '';

      result = item;

      ne_id = result.ne_id;
      ne_shelf = result.ne_shelf;
      ne_slot = result.ne_slot;
      ne_port = result.ne_port;

      //console.log (ne_id, ne_shelf, ne_slot, ne_port);

      const temp = _.find(result.parent.children, { QR_code_id: qrData });
      if (temp === undefined) {
          Alert.alert('FLASH', 'Target Core QR Code is not valid.');
      } else {
        result.ne_id = temp.ne_id;
        result.ne_shelf = temp.ne_shelf;
        result.ne_slot = temp.ne_slot;
        result.ne_port = temp.ne_port;

        temp.ne_id = ne_id;
        temp.ne_shelf = ne_shelf;
        temp.ne_slot = ne_slot;
        temp.ne_port = ne_port;

        details = _.map(
                 _.toPairs(
                   _.omitBy(result, (val, key) => key === 'children' || key === 'parent')
                 ), d => _.fromPairs([d])
               );
      }
    }
}

if (result===undefined) {
  if (id!==undefined) {
    //Alert.alert ('FLASH', 'No ' + {level} +' network element found for searched Id: ' + {id} + '. Please go back to Main Menu to retry.');
    Alert.alert ('FLASH', `No ${level} network element found for searched Id: '${id}'. Kindly retry.`);
  } else if (qrData!==undefined){
    Alert.alert ('FLASH', `No ${level} network element found for scanned QR. Kindly retry.`);
  } else {
    Alert.alert ('FLASH', 'No network element found. Kindly retry.');
  }
  //this.props.navigation.navigate('Menu');
} else {
  this.setState({
    parent: result,
    child: result.children,
    back: result.parent,
    parentDetails: details
  })
}
  /*if (qrData!==undefined){
    result = _.find(data, { QR_code_id: qrData });
    console.log ('parent:' + result);
    if (result!==undefined){
        details = _.map(
               _.toPairs(
                 _.omitBy(result, (val, key) => key === 'children' || key === 'parent')
               ), d => _.fromPairs([d])
             );
    } else {
        result = _.find(data.children, { QR_code_id: qrData });
        console.log ('children:' + result);
        if (result!==undefined){
            details = _.map(
                   _.toPairs(
                     _.omitBy(result, (val, key) => key === 'children' || key === 'parent')
                   ), d => _.fromPairs([d])
                 );
        } else {
            console.log ('not found!');
        }
    }
  }*/
}

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

setButton = () => {
  const handle = findNodeHandle(this.button);
  if (handle) {
    NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
      //console.log('x0:' + x0, y0, width, height, x, y);
      this.setState({ popoverAnchor: { x, y: (Platform.OS === 'android'?y-23:y-5) , width, height } });
      //this.setState({ popoverAnchor: { x, y, width, height } });
    });
  }
};

mapParent = (items) => {
  _.map(items.children, (item) => {
    item.parent = items;
      _.map(item.children, (child) => {
        child.parent = item;
      });
  });
  return items;
}

updateCore = () => {
  const {
    parent,
    editCore: {
      ne_id,
      ne_shelf,
      ne_slot,
      ne_port,
      cct_name,
      status,
    }} = this.state;

  /*if (ne_id!==null && ne_id!==undefined && ne_id!==''){
    parent.ne_id = ne_id;
  }

  if (ne_shelf!==null && ne_shelf!==undefined && ne_shelf!==''){
    parent.ne_shelf = ne_shelf;
  }

  if (ne_slot!==null && ne_slot!==undefined && ne_slot!==''){
    parent.ne_slot = ne_slot;
  }

  if (ne_port!==null && ne_port!==undefined && ne_port!==''){
    parent.ne_port = ne_port;
  }

  if (cct_name!==null && cct_name!==undefined && cct_name!==''){
  parent.cct_name = cct_name;
  }

  if (status!==null && status!==undefined && status!==''){
  parent.status = status;
}*/

  parent.ne_id = ne_id;
  parent.ne_shelf = ne_shelf;
  parent.ne_slot = ne_slot;
  parent.ne_port = ne_port;
  parent.cct_name = cct_name;
  parent.status = status;

  const parentDetails = _.map(
         _.toPairs(
           _.omitBy(parent, (val, key) => key === 'children' || key === 'parent')
         ), d => _.fromPairs([d])
       );

  this.setState({
    parentDetails,
    headerExpended: false,
    editCore: {
      ne_id: '',
      ne_shelf: '',
      ne_slot: '',
      ne_port: '',
      cct_name: '',
      status: ''
    }});
}

renderHeaderBack() {
  const { back, headerExpended } = this.state;
  if (back!==undefined){
    return (
        <Button iconName='arrow-back' disabled={headerExpended} iconColor='#fff' onPress={() =>
          this.renderData(
            back,
            back.children,
            back.parent
        )}/>
    )
  }
}

renderHeaderHome() {
  const { headerExpended } = this.state;
  return (
      <Button iconName='home' disabled={headerExpended} iconColor='#fff' onPress={() =>
        this.props.navigation.navigate('Menu')
      }/>
  )
}

renderParent () {
  const { parent, parentDetails, showHeaderMenu, popoverAnchor, headerExpended, headerMode } = this.state;
  if (parent !== undefined){
    return (
      <Card>
        <CardSection style={{ justifyContent: 'space-between', backgroundColor:'#ecedf2' }}>
          {
            headerExpended?
              {
                View: <Text h4>{parent.type}: View Details</Text>,
                Edit: <Text h4>{parent.type}: Edit Details</Text>,
                Transfer: <Text h4>{parent.type}: Current</Text>,
              }
            [headerMode]:<Text h4>{parent.type}</Text>
          }
          {
            headerExpended?
            <Button
              onPress={() => this.setState({ headerExpended: false })}
              iconName='close'
            />:
            <Button
              setRef={r => {this.button = r}}
              onPress={() => this.setState({ showHeaderMenu: true })}
              onLayout={this.setButton}
              iconName='dots-vertical'
              iconType='material-community'
            />
          }
          <Popover
            contentStyle={styles.content}
            arrowStyle={styles.arrow}
            visible={showHeaderMenu}
            fromRect={popoverAnchor}
            backgroundStyle={styles.background}
            onClose={() => this.setState({ showHeaderMenu: false })}
            onDismiss={() => this.setState({ showHeaderMenu: false })}
            placement='bottom'
            supportedOrientations={['portrait', 'landscape']}
            easing={show => show?Easing.elastic(1):Easing.out(Easing.quad)}
            //default: easing={(show) => show?Easing.out(Easing.back(1.70158)):Easing.inOut(Easing.quad)}
            duration={ 300 }
            useNativeDriver
          >
            <Button
              onPress={() => this.setState({ headerExpended: true, headerMode: 'View', showHeaderMenu: false })}
              //onPress={this.print(parent)}
              buttonText={`View ${parent.type} Details`}
              iconName='view-list'
            />
            {parent.type === 'Core'?
              <Button
                renderDivider
                onPress={() => this.setState({
                  headerExpended: true,
                  headerMode: 'Edit',
                  showHeaderMenu: false,
                  editCore: {
                    ne_id: parent.ne_id,
                    ne_shelf: parent.ne_shelf,
                    ne_slot: parent.ne_slot,
                    ne_port: parent.ne_port,
                    cct_name: parent.cct_name,
                    status: parent.status
                }})}
                buttonText={`Edit ${parent.type} Details`}
                iconName='edit'
              />:null
            }
            {parent.QR_code_id === undefined || parent.QR_code_id === null || parent.QR_code_id === ""?
              <Button
                renderDivider
                onPress={() => this.props.navigation.navigate('Scan', {
                  mode: 'UpdateQR',
                  //id: parent.parent.id,
                  item: parent,
                  level: 'Core'
                })}
                buttonText='Update QR Code'
                iconName='qrcode'
                iconType='font-awesome'
              />:null
            }
            {parent.type === 'Core'?
              <Button
                renderDivider
                onPress={() => this.props.navigation.navigate('Scan', {
                  mode: 'Transfer',
                  //id: parent.parent.id,
                  item: parent,
                  level: 'Core'
                })}
                /*onPress={() => this.setState({
                  headerExpended: true,
                  headerMode: 'Transfer',
                  showHeaderMenu: false
                })}*/
                buttonText='Transfer Core'
                iconName='swap-horiz'
              />:null
            }
          </Popover>
        </CardSection>
        <CardSection>
          <View style={ styles.qr } >
          {
            parent.QR_code_id===undefined || parent.QR_code_id=== null?
            <Icon name='do-not-disturb-alt' size={50} />:
            <QRCode value={parent.QR_code_id} size={50} />
          }
          </View>
          {/*}<View style={{ paddingLeft: 10, justifyContent: 'center' }}>
            <Text><Text style={{ fontWeight: 'bold' }}>ID: </Text>{parent.id}</Text>
            {
              parent.QR_code_id===undefined || parent.QR_code_id=== null?
              <Text style={{ fontWeight: 'bold' }}>QR Code: <Text style={{ fontWeight: 'bold', color: 'red' }}>No QR Code</Text></Text>:
              <Text><Text style={{ fontWeight: 'bold' }}>QR Code: </Text>{parent.QR_code_id}</Text>
            }
          </View>*/}
          {this.renderHeaderMain()}
        </CardSection>
      </Card>
    )
  }
}

renderHeaderMain () {
  const { parent } = this.state;

  if (parent.type === 'Frame'){
  return (
        <View style={{ paddingLeft: 10, justifyContent: 'center' }}>
          <Text><Text style={{ fontWeight: 'bold' }}>Name: </Text>{parent.name}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>ID: </Text>{parent.id}</Text>
          {
            parent.QR_code_id===undefined || parent.QR_code_id=== null?
            <Text style={{ fontWeight: 'bold' }}>QR Code: <Text style={{ fontWeight: 'bold', color: 'red' }}>No QR Code</Text></Text>:
            <Text><Text style={{ fontWeight: 'bold' }}>QR Code: </Text>{parent.QR_code_id}</Text>
          }
        </View>
      )
  } else if (parent.type === 'Core'){
  return (
        <View style={{ paddingLeft: 10, justifyContent: 'center' }}>
          <Text><Text style={{ fontWeight: 'bold' }}>ID: </Text>{parent.id}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>NE Id: </Text>{parent.ne_id}</Text>
          {
            parent.QR_code_id===undefined || parent.QR_code_id=== null?
            <Text style={{ fontWeight: 'bold' }}>QR Code: <Text style={{ fontWeight: 'bold', color: 'red' }}>No QR Code</Text></Text>:
            <Text><Text style={{ fontWeight: 'bold' }}>QR Code: </Text>{parent.QR_code_id}</Text>
          }
        </View>
      )
  } else {
  return (
        <View style={{ paddingLeft: 10, justifyContent: 'center' }}>
          <Text><Text style={{ fontWeight: 'bold' }}>ID: </Text>{parent.id}</Text>
          {
            parent.QR_code_id===undefined || parent.QR_code_id=== null?
            <Text style={{ fontWeight: 'bold' }}>QR Code: <Text style={{ fontWeight: 'bold', color: 'red' }}>No QR Code</Text></Text>:
            <Text><Text style={{ fontWeight: 'bold' }}>QR Code: </Text>{parent.QR_code_id}</Text>
          }
        </View>
      )
  }
}

renderExpendedHeader () {
  const { headerExpended, headerMode, parent, parentDetails, editCore } = this.state;
  if (headerExpended) {
    if (headerMode==='View'){
      return(
          <Card>
          <FlatList
            data={parentDetails}
            renderItem={this.renderItemHeader}
            keyExtractor={this.keyExtractorHeader}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            /*getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index
            })}*/
          />
          </Card>
      )
    } else if (headerMode==='Edit') {
      return(
        <Card>
          <CardSection style={styles.editRowOdd}>
            <Text style={styles.textBold}>NE_ID</Text>
            <TextInput
              underlineColorAndroid = 'transparent'
              style={styles.input}
              placeholder={parent.ne_id}
              autoCorrect={false}
              autoCapitalize={'none'}
              value={editCore.ne_id}
              onChangeText={ne_id => this.setState({ editCore: Object.assign({}, editCore, { ne_id })})}
              //onChangeText={ne_id => this.setState({ editCore: { ne_id }})}
            />
          </CardSection>
          <CardSection style={styles.editRowEven}>
            <Text style={styles.textBold}>NE_SHELF</Text>
            <TextInput
              underlineColorAndroid = 'transparent'
              style={styles.input}
              placeholder={parent.ne_shelf}
              autoCorrect={false}
              autoCapitalize={'none'}
              value={editCore.ne_shelf}
              onChangeText={ne_shelf => this.setState({ editCore: Object.assign({}, editCore, { ne_shelf })})}
            />
          </CardSection>
          <CardSection style={styles.editRowOdd}>
            <Text style={styles.textBold}>NE_SLOT</Text>
            <TextInput
              underlineColorAndroid = 'transparent'
              style={styles.input}
              placeholder={parent.ne_slot}
              autoCorrect={false}
              autoCapitalize={'none'}
              value={editCore.ne_slot}
              onChangeText={ne_slot => this.setState({ editCore: Object.assign({}, editCore, { ne_slot })})}
          />
          </CardSection>
          <CardSection style={styles.editRowEven}>
            <Text style={styles.textBold}>NE_PORT</Text>
            <TextInput
              underlineColorAndroid = 'transparent'
              style={styles.input}
              placeholder={parent.ne_port}
              autoCorrect={false}
              autoCapitalize={'none'}
              value={editCore.ne_port}
              onChangeText={ne_port => this.setState({ editCore: Object.assign({}, editCore, { ne_port })})}
            />
          </CardSection>
          <CardSection style={styles.editRowOdd}>
            <Text style={styles.textBold}>CIRCUIT_NAME</Text>
            <TextInput
              underlineColorAndroid = 'transparent'
              style={styles.input}
              placeholder={parent.cct_name}
              autoCorrect={false}
              autoCapitalize={'none'}
              value={editCore.cct_name}
              onChangeText={cct_name => this.setState({ editCore: Object.assign({}, editCore, { cct_name })})}
            />
          </CardSection>
          <CardSection style={styles.editRowEven}>
            <Text style={styles.textBold}>STATUS</Text>
            <TextInput
              underlineColorAndroid = 'transparent'
              style={styles.input}
              placeholder={parent.status}
              autoCorrect={false}
              autoCapitalize={'none'}
              value={editCore.status}
              onChangeText={status => this.setState({ editCore: Object.assign({}, editCore, { status })})}
            />
          </CardSection>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <Button border buttonText='Clear' onPress={() => this.setState({
              editCore: {
                ne_id: '',
                ne_shelf: '',
                ne_slot: '',
                ne_port: '',
                cct_name: '',
                status: ''
              }
             })} />
            <Button border buttonText='Update' onPress={() => this.updateCore()}/>
          </View>
        </Card>
      )
    } else if (headerMode==='Transfer') {
      return(
        <View style={{ justifyContent: 'center', flexDirection: 'column' }}>
          <Icon name='swap-vert' size={ 50 } iconStyle={{ padding: 15 }}/>
          <Card>
            <CardSection style={{ backgroundColor:'#ecedf2' }}>
              <Text h4>{ parent.type }: New</Text>
            </CardSection>
          </Card>
        </View>
      )
    }
  }
}

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
        containerStyle={index%2?{ borderBottomWidth: 0, backgroundColor: '#fff' }:{ borderBottomWidth: 0, backgroundColor: '#f5f5f5' }}
        //onPress={() => {this.renderData(item, item.children, item.parent)}}
        hideChevron
      />
  )
}

keyExtractorHeader = (item) => Object.keys(item)[0];

renderChild () {
  const { child, headerExpended } = this.state;
  if (child !== undefined && !headerExpended){
    return (
      <Card>
        <CardSection style={{ backgroundColor:'#ecedf2' }}>
          <Text h4>{ _.head(child).type }</Text>
        </CardSection>
        <FlatList
          data={child}
          renderItem={this.renderItemChildren}
          keyExtractor={this.keyExtractorChild}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
        />
      </Card>
    )
  }
}

renderItemChildren = ({ item, index }) => {

  let title = '';
  if (item.type === 'Core'){
  title=
        <View>
          <Text><Text style={{ fontWeight: 'bold' }}>ID: </Text>{item.id}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>NE Id: </Text>{item.ne_id}</Text>
          {item.QR_code_id===undefined || item.QR_code_id === null?
            <Text style={{ fontWeight: 'bold' }}>QR Code: <Text style={{ fontWeight: 'bold', color: 'red' }}>No QR Code</Text></Text>:
            <Text><Text style={{ fontWeight: 'bold' }}>QR Code: </Text>{item.QR_code_id}</Text>
          }
        </View>;
  } else {
    title=
        <View>
          <Text><Text style={{ fontWeight: 'bold' }}>ID: </Text>{item.id}</Text>
          {item.QR_code_id===undefined || item.QR_code_id=== null?
            <Text style={{ fontWeight: 'bold' }}>QR Code: <Text style={{ fontWeight: 'bold', color: 'red' }}>No QR Code</Text></Text>:
            <Text><Text style={{ fontWeight: 'bold' }}>QR Code: </Text>{item.QR_code_id}</Text>}
        </View>;
  }

  /*const title = <Text><Text style={{ fontWeight: 'bold' }}>ID: </Text>{item.id}</Text>;
  const subtitle = item.QR_code_id===undefined || item.QR_code_id=== null?
    <Text style={{ fontWeight: 'bold' }}>QR Code: <Text style={{ fontWeight: 'bold', color: 'red' }}>No QR Code</Text></Text>:
    <Text><Text style={{ fontWeight: 'bold' }}>QR Code: </Text>{item.QR_code_id}</Text>;*/

  return (
    <ListItem
      title={title}
      //subtitle={subtitle}
      leftIcon={{ name: 'level-down', type: 'entypo', color:'#ff9a1e', style:{ opacity: (200-index)/200 }}}
      //containerStyle={index%2?{ borderBottomWidth: 0, backgroundColor: '#f5f5f5' }:{ borderBottomWidth: 0, backgroundColor: '#fff' }}
      containerStyle={{ borderBottomWidth: 0, backgroundColor: '#fff' }}
      onPress={() => {this.renderData(item, item.children, item.parent)}}
    />
  )
}

keyExtractorChild = (item) => item.id;

renderSeparator = () => {
  const margin = this.state.headerExpended?0:42;

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

renderFooter = () => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: '#CED0CE'
      }}
    />
  )
}

render() {
  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1, backgroundColor:'#f5f5f5' }}>
      <Image source= { require('../../img/bg2.png')} style= {{ position:'absolute', top: 68, resizeMode: 'cover'}} />
      <Header
        backgroundColor='#d03c1b'
        outerContainerStyles={{ borderBottomWidth:0 }}
        leftComponent={ this.renderHeaderBack() }
        centerComponent={<Image source={ require('../../img/flash.png') }
        style={{ resizeMode: 'stretch', height: 20, width: 100 }}/>}
        //rightComponent={{ icon: 'home', color: '#fff' }}
        rightComponent={ this.renderHeaderHome() }
      />
      <ScrollView>
        <View style={{ height: 70 }} />
        {this.renderParent()}
        {this.renderExpendedHeader()}
        {this.renderChild()}
      </ScrollView>
    </KeyboardAvoidingView>
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
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 1,
  },
  qr: {
    justifyContent: 'center',
    borderColor: '#434343',
    borderWidth: 1,
    padding: 3,
    backgroundColor: '#838383',
    borderRadius: 3,
  },
  arrow: {
    borderTopColor: '#fff',
  },
  textBold: {
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
  input: {
      width: '50%',
      paddingLeft: 10,
      backgroundColor: '#fff',
      borderColor: '#ddd',
      borderWidth: 1,
  },
  editRowOdd: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 5,
  },
  editRowEven: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 5,
  },
  background: {
    backgroundColor: 'rgba(0, 0, 255, 0)',
  },
});

export default DataPage;
