import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { Card, CardSection } from '../common';
import { connect } from 'react-redux';
import List from './List';
import { fetchHelper } from '../../actions';


class Children extends Component {
    render(){
      //console.log(this.props);
      const { child, headerExpended, child_type, navigate } = this.props;
      if (child !== undefined && !headerExpended){
        return (
          <Card style={{ borderBottomWidth: 1 }}>
            <CardSection style={{ backgroundColor:'#ecedf2' }}>
              <Text h4>{child_type}</Text>
            </CardSection>
            <List data={child} type={child_type} navigate={navigate}/>
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
