import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Icon, Divider } from 'react-native-elements';

class Button extends Component {

setRef(ref) {
        this.inputRef = ref;
    }

render() {
  const {
    onPress,
    disabled = false,
    buttonText,
    renderDivider,
    iconName,
    iconType,
    iconStyle,
    buttonStyle,
    setRef,
    onLayout
  } = this.props;
  const combinedIconDisabledStyles = StyleSheet.flatten([styles.iconDisabledStyle, iconStyle]);
  const combinedButtonStyles = StyleSheet.flatten([styles.buttonStyle, buttonStyle]);

  return (
    <View style={ styles.containerStyle }>
      { renderDivider?<Divider style={ styles.dividerStyle } />:null }
      <TouchableOpacity ref={setRef} disabled={disabled} style={ combinedButtonStyles } onPress={onPress} onLayout={onLayout} >
        { buttonText!==undefined?<Text style={ disabled?styles.textDisabledStyle:styles.textStyle }>{ buttonText }</Text>:null }
        <Icon name={iconName} type={iconType} iconStyle={ disabled?combinedIconDisabledStyles:iconStyle} />
      </TouchableOpacity>
    </View>
  );
}}

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textStyle: {
    alignSelf: 'center',
    marginRight: 20
  },
  textDisabledStyle: {
    alignSelf: 'center',
    marginRight: 20,
    color: '#666'
  },
  iconDisabledStyle: {
    color: '#666'
  },
  dividerStyle: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#CED0CE'
  }
});

export { Button };
