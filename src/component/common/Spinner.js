import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Spinner = ({ size, border = false, color = '#000' }) => {
  return (
    <View pointerEvents='none' style={styles.spinnerStyle}>
      <ActivityIndicator color={color} style={ border && styles.containerStyle } size={size || 'large'} />
    </View>
  );
};

const styles = {
  spinnerStyle: {
    position: 'absolute',
    backgroundColor: 'transparent',//'#FFFCFF88',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    flex: 1,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerStyle: {
    padding: 5,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: '#fff',
    /*shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 10,*/
  }
};

export { Spinner };
