import React from 'react';
import { View, StyleSheet } from 'react-native';

const CardSection = (props) => {
  const combineStyles = StyleSheet.flatten([styles.containerStyle, props.style]);
  return (
    <View style={combineStyles}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    borderBottomWidth: 1,
    borderRadius: 3,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  }
});

export { CardSection };
