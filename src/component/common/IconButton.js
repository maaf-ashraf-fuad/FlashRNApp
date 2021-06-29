import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { Icon } from 'react-native-elements';

class IconButton extends Component {

setRef(ref) {
        this.inputRef = ref;
    }

render() {
  const {
    onPress,
    disabled,
    buttonText,
    raised,
    rounded,
    iconName,
    iconType,
    iconStyle,
    iconSize,
    buttonStyle,
    setRef,
    onLayout,
    iconColor,
    bgColor
  } = this.props;
  const combinedIconDisabledStyles = StyleSheet.flatten([styles.iconDisabledStyle, iconStyle]);
  //const combinedButtonStyles = StyleSheet.flatten([styles.buttonStyle, buttonStyle, raised&&styles.raisedStyle, rounded&&styles.roundedStyle]);


  return (
    <View style={ styles.containerStyle }>
      <TouchableOpacity
        ref={setRef}
        disabled={disabled || false}
        style={[
        raised && styles.raisedStyle,
        styles.buttonStyle,
        {
          backgroundColor: bgColor || '#32506d',
          height: 42,
          width: 42,
        },
        ]}
        onPress={onPress}
        onLayout={onLayout}
      >
        <Icon
          name={iconName}
          type={iconType}
          color={iconColor || 'white'}
          size={iconSize}
          iconStyle={ disabled?combinedIconDisabledStyles:iconStyle}
        />
      </TouchableOpacity>
      { buttonText!==undefined?<Text style={ disabled?styles.textDisabledStyle:styles.textStyle }>{ buttonText }</Text>:null }
    </View>
  );
}}

IconButton.defaultProps = {
  raised: true,
  iconColor: 'white',
  iconSize: 25,
};

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  buttonStyle: {
    margin: 7,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  raisedStyle: {
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0, 0.4)',
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  textStyle: {
    alignSelf: 'center'
  },
  textDisabledStyle: {
    alignSelf: 'center',
    color: '#666'
  },
  iconDisabledStyle: {
    color: '#666'
  },
});

export { IconButton };
