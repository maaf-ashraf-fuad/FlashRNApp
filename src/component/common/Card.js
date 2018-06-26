import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = (props) => {
  const combineStyles = StyleSheet.flatten([styles.containerStyle, props.style]);
  return (
    <View style={combineStyles}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 1,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10
  }
});

export { Card };
