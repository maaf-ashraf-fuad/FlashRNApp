import React, { Component } from 'react';
import { Text, Icon } from 'react-native-elements';
import { Card, CardSection, ModalDropdown } from '../common';
import { connect } from 'react-redux';
import List from './List';
import { fetchHelper } from '../../actions';
import { TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';

const DEMO_OPTIONS_2 = ['option 1', 'option 2', 'option 3', 'option 4', 'option 5', 'option 6', 'option 7', 'option 8', 'option 9'];


class Children extends Component {
    render(){
      const { child, headerExpended, child_type, current, searchKeys } = this.props;
      if (child !== undefined && !headerExpended){
        return (
          <Card style={{
            //marginBottom: 350,
            borderBottomWidth: 1,
            flexShrink: 10
          }}>
            <CardSection style={{ justifyContent: 'space-between', backgroundColor:'#ecedf2' }}>
              <Text h4>{child_type}</Text>
              {/*<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Icon name='search' />
              </TouchableOpacity>*/}
            </CardSection>
            {/*}<ModalDropdown options={DEMO_OPTIONS_2} onSelect={null}>
              <View style={styles.dropdown}>
                <TextInput
                  underlineColorAndroid = 'transparent'
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  value={'walala'}
                  returnKeyType='next'
                />
              </View>
            </ModalDropdown>
            <CardSection style={{ margin: 0, backgroundColor:'#ecedf2' }}>
              <ModalDropdown options={searchKeys} onSelect={null}>
                <View style={styles.dropdown}>
                    <Text>Select</Text>
                    <Icon name={'expand-more'} iconStyle={{ marginRight: 5 }}/>
                </View>
              </ModalDropdown>
            </CardSection>*/}
            <List type={child_type} current={current}/>
          </Card>
        )
      }
      return null;
    }
}

const styles = StyleSheet.create({
    dropdown: {
        width: 90,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: '#ddd',
        borderWidth: 1,
        paddingVertical: 5,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30
        //margin: 10
    },
    input: {
      width: '50%',
      paddingLeft: 10,
      backgroundColor: '#fff',
      borderColor: '#ddd',
      borderWidth: 1,
      flex: 1.5,
    }
});

const mapStateToProps = ({ data: {headerExpended, headerMode, child_type, child, searchKeys}}) => {
  return { headerExpended, headerMode, child_type, child, searchKeys };
};

export default connect(mapStateToProps, { fetchHelper })(Children);
