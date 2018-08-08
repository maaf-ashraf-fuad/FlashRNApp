import React, { Component } from 'react';
import { Text, Icon } from 'react-native-elements';
import { Card, CardSection } from '../common';
import { connect } from 'react-redux';
import List from './List';
import { fetchHelper } from '../../actions';
import { TouchableOpacity, TextInput } from 'react-native';

class Children extends Component {
    render(){
      const { child, headerExpended, child_type, current } = this.props;
      if (child !== undefined && !headerExpended){
        return (
          <Card style={{ borderBottomWidth: 1 }}>
            <CardSection style={{ justifyContent: 'space-between', backgroundColor:'#ecedf2' }}>
              <Text h4>{child_type}</Text>
              {/*}<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Icon name='search' />
              </TouchableOpacity>*/}
            </CardSection>
            <List data={child} type={child_type} current={current}/>
          </Card>
        )
      }
      return null;
    }
}

const mapStateToProps = ({ data: {headerExpended, headerMode, child_type, child}}) => {
  return { headerExpended, headerMode, child_type, child};
};

export default connect(mapStateToProps, { fetchHelper })(Children);
