import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import { Popover, PopoverController } from 'react-native-modal-popover';
import { TouchableOpacity, View, StyleSheet, Easing } from 'react-native';
import { Button } from '../common';
import _ from 'lodash';
//import { connect } from 'react-redux';
//import { setMenuState, setMenuAnchor  } from '../../actions';

class DropDownMenu extends Component {
  render() {
    const {
      type,
      qr_code_id,
      setMenuState,
      headerExpended,
      navigate
    } = this.props;
    //console.log('render DropDownMenu');
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
          navigate('Scan', {
               next: {
               type: `Update_${type}_QR`
              }}
          );
        }

        return (
        <React.Fragment>
          <TouchableOpacity
            ref={setPopoverAnchor}
            //onLayout={this.handleLayout}
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
            //easing={show => show?Easing.elastic(1):Easing.out(Easing.quad)}
            supportedOrientations={['portrait', 'landscape']}
          >
            <Button
              /*onPress={() => {
                closePopover();
                setMenuState({
                 headerExpended: true,
                 headerMode: 'View'
                });
              }}*/
              onPress={handlePressView}
              buttonText={`View ${type} Details`}
              iconName='view-list'
            />
            {type === 'Core'?(
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
                </View>
              ): null
            }
            {type !== 'Frame' && (qr_code_id === undefined || qr_code_id === null)?
              <Button
                renderDivider
                onPress={onPressQR}
                buttonText='Update QR Code'
                iconName='qrcode'
                iconType='font-awesome'
              />:null
            }
          </Popover>
        </React.Fragment>
      );}}
    </PopoverController>
  )

    /*return (
      <View>
        <TouchableOpacity
          ref={this.setRef}
          //onLayout={this.handleLayout}
          onPress={() => setMenuState({ showHeaderMenu: true })}
        >
          <Icon name='dots-vertical' type='material-community' />
        </TouchableOpacity>
        <Popover
          contentStyle={styles.content}
          arrowStyle={styles.arrow}
          visible={showHeaderMenu}
          fromRect={popoverAnchor}
          backgroundStyle={styles.background}
          onClose={() => setMenuState({ showHeaderMenu: false })}
          onDismiss={() => setMenuState({ showHeaderMenu: false })}
          placement='bottom'
          supportedOrientations={['portrait', 'landscape']}
          easing={show => show?Easing.elastic(1):Easing.out(Easing.quad)}
          //default: easing={(show) => show?Easing.out(Easing.back(1.70158)):Easing.inOut(Easing.quad)}
          //duration={ 300 }
        >
          <Button
            onPress={() => setMenuState({
              headerExpended: true,
              headerMode: 'View',
              showHeaderMenu: false
            })}
            buttonText={`View ${type} Details`}
            iconName='view-list'
          />
          {type === 'Core'?
            <Button
              renderDivider
              onPress={() => setMenuState({
                headerExpended: true,
                headerMode: 'Edit',
                showHeaderMenu: false
              })}
              buttonText={`Edit ${type} Details`}
              iconName='edit'
            />:null
          }
          {parent.qr_code_id === undefined || parent.qr_code_id === null || parent.qr_code_id === ""?
            <Button
              renderDivider
              onPress={() => this.props.navigation.navigate('Scan', {
                mode: 'UpdateQR',
                //id: parent.parent.id,
                item: parent,
                level: 'Core'
              })}
              buttonText='Update QR Code'
              iconName='qrcode'
              iconType='font-awesome'
            />:null
          }
          {type === 'Core'?
            <Button
              renderDivider
              onPress={() => this.props.navigation.navigate('Scan', {
                mode: 'Transfer',
                //id: parent.parent.id,
                item: parent,
                level: 'Core'
              })}
              /*onPress={() => this.setState({
                headerExpended: true,
                headerMode: 'Transfer',
                showHeaderMenu: false
              })}
              buttonText='Transfer Core'
              iconName='swap-horiz'
            />:null
          }
        </Popover>
      </View>
    )*/
  }
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
/*
const mapStateToProps = (state) => {
  //let data = _.omitBy(state.data, (val, key) => key === 'ns2:LIST_FRAME_UNIT' || key === 'parent');
  //data = _.mapKeys(data, (val, key) => key.replace('ns2:',''));
  //const a = state.data['ns2:LONGITUDE'];
  console.log (state.menu);
  return {...state.menu, parent: {...state.data.parent}};
};*/

//export default connect(mapStateToProps, { setMenuState, setMenuAnchor })(DropDownMenu);
//export default connect(null, { setMenuState, setMenuAnchor })(DropDownMenu);
