import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Icon, Divider } from 'react-native-elements';

class Button extends Component {

render() {
  const {
    onPress,
    disabled = false,
    buttonText,
    renderDivider,
    iconName,
    iconType,
    iconStyle,
    iconColor,
    buttonStyle,
    textStyle,
    containerStyle,
    border = false,
    setRef,
    onLayout
  } = this.props;
  const combinedButtonStyles = StyleSheet.flatten([ border?styles.buttonStyle:styles.menuStyle, buttonStyle, { opacity: disabled?0.5:1 } ]);
  const combinedTextStyles = StyleSheet.flatten([ border?styles.buttontextStyle:styles.menutextStyle, textStyle, { opacity: disabled?0.5:1 } ]);
  const combinedContainerStyles = StyleSheet.flatten([ border&&{ flex: 1 }, styles.containerStyle, containerStyle ]);

  return (
    <View onLayout={onLayout} style={combinedContainerStyles}>
      { renderDivider?<Divider style={styles.dividerStyle} />:null }
      <TouchableOpacity ref={setRef} disabled={disabled} style={combinedButtonStyles} onPress={onPress}>
        { buttonText!==undefined?<Text style={ combinedTextStyles }>{buttonText}</Text>:null }
        {/*<Icon name={iconName} color={iconColor} type={iconType} iconStyle={ disabled?combinedIconDisabledStyles:iconStyle} />*/}
        { iconName!==undefined?<Icon name={iconName} color={iconColor} type={iconType} iconStyle={iconStyle} />:null }
      </TouchableOpacity>
    </View>
  );
}}

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
  },
  menuStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  menutextStyle: {
    textAlignVertical: 'center',
    marginRight: 20
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffb347',
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    borderColor: '#fa9200',
    margin: 5,
  },
  buttontextStyle: {
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  dividerStyle: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#CED0CE'
  }
});

export { Button };
