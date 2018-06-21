import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Spinner = ({ size }) => {
  return (
    <View pointerEvents='none' style={styles.spinnerStyle}>
      <ActivityIndicator size={size || 'large'} />
    </View>
  );
};

const styles = {
  spinnerStyle: {
    position: 'absolute',
    backgroundColor: '#FFFCFF88',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export { Spinner };
