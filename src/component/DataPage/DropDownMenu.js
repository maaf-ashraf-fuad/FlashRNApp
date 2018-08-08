import React, { PureComponent } from 'react';
import { Icon } from 'react-native-elements';
import { Popover, PopoverController } from 'react-native-modal-popover';
import { TouchableOpacity, View, StyleSheet, Easing } from 'react-native';
import { Button } from '../common';
import _ from 'lodash';
import NavigationService from '../../navigation/NavigationService.js';

class DropDownMenu extends PureComponent {
  render() {
    const {
      type,
      qr_code_id,
      setMenuState,
      headerExpended
    } = this.props;
    return(
    <PopoverController>
      {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => {

        const handlePressView = () => {
          _.delay(closePopover, 50);
          setMenuState({
             headerExpended: true,
             headerMode: 'View'
          });
        }

        const handlePressClose = () => {
          setMenuState({
             headerExpended: false,
             headerMode: ''
          });
        }

        const onPressEdit = () => {
          _.delay(closePopover, 50);
          setMenuState({
             headerExpended: true,
             headerMode: 'Edit'
          });
        }

        const onPressTransfer = () => {
          _.delay(closePopover, 50);
          setMenuState({
             headerExpended: true,
             headerMode: 'Transfer'
          });
        }

        const onPressQR = () => {
          _.delay(closePopover, 50);
          NavigationService.navigate('Scan', {
               next: {
               type: `Update_${type}_QR`
              }}
          );
        }

        return (
        <React.Fragment>
          <TouchableOpacity
            ref={setPopoverAnchor}
            onPress={headerExpended?handlePressClose:openPopover}
          >
            {headerExpended?
                <Icon name='close' />:
                <Icon name='dots-vertical' type='material-community' />
            }
          </TouchableOpacity>
          <Popover
            contentStyle={styles.content}
            arrowStyle={styles.arrow}
            backgroundStyle={styles.background}
            visible={popoverVisible}
            onClose={closePopover}
            fromRect={{...popoverAnchorRect, y: popoverAnchorRect.y - 23}}
            placement='bottom'
            duration={ 0 }
            supportedOrientations={['portrait', 'landscape']}
          >
            <Button
              onPress={handlePressView}
              buttonText={`View ${type} Details`}
              iconName='view-list'
            />
            {type === 'Core'?
                <View>
                  <Button
                    renderDivider
                    onPress={onPressEdit}
                    buttonText={`Edit ${type} Details`}
                    iconName='edit'
                  />
                  <Button
                    renderDivider
                    onPress={onPressTransfer}
                    buttonText='Transfer Core'
                    iconName='swap-horiz'
                  />
                </View>:null
            }
            {!qr_code_id?
              <Button
                renderDivider
                onPress={onPressQR}
                buttonText='Update QR Code'
                iconName='qrcode'
                iconType='font-awesome'
              />
              :null
            }
          </Popover>
        </React.Fragment>
      );}}
    </PopoverController>
  )}
}

const styles = StyleSheet.create({
  content: {
    padding: 7,
    borderRadius: 3,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 1,
  },
  arrow: {
    borderTopColor: '#fff',
  },
  background: {
    backgroundColor: 'rgba(0, 0, 255, 0)',
  },
});

export default DropDownMenu;
