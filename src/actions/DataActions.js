import NavigationService from '../navigation/NavigationService.js';
import { AsyncStorage, Alert } from 'react-native';
import { Permissions } from 'expo';

export const fetchHelper = (nav) => {
  const { type, id, qr, staff, item } = nav.next;
  //@commented@console.log('DataAction:fetchHelper');
  //@commented@console.log(nav.next);

  if (nav.action&&nav.action.type==='back'){
    NavigationService.back();
  }

  return (dispatch, getState) => {
    switch (type) {
      case 'Frame':
        dispatch({ type: 'Fetching_Data' });
        if (id!==undefined && (id === '' || id === null) ){
          return dispatch({ type: 'Frame_Fetch_Failed', payload: 'Please enter a value.' });
        }
        frameFetch(id, qr, getState().data.user.staff_user).then(
          ({ result, payload, ErrorMessage }) => {
            if (result==='Success'){
              return dispatch({ type: 'Frame_Fetch_Success', payload, nav: { ...nav, next: {...nav.next, type: 'Frame' }}});
            }
            return dispatch({ type: 'Frame_Fetch_Failed', payload: ErrorMessage })
          })
        .catch((error) => dispatch({ type: 'Frame_Fetch_Failed', payload: error.message }))
        .done();
        break;
      case 'Shelf':
        dispatch({ type: 'Fetching_Data'});
        if (id!==undefined && isNaN(id)){
          return dispatch({ type: 'Shelf_Fetch_Failed', payload: 'Please enter numbers only.' });
        } else if (id!==undefined && (id === '' || id === null)){
          return dispatch({ type: 'Shelf_Fetch_Failed', payload: 'Please enter a value.' });
        }
        shelfFetch(id, qr, getState().data.user.staff_user).then(
          ({ result, payload, ErrorMessage }) => {
            if (result==='Success'){
              return dispatch({ type: 'Shelf_Fetch_Success', payload, nav: { ...nav, next: {...nav.next, type: 'Shelf' }}});
            }
            return dispatch({ type: 'Shelf_Fetch_Failed', payload: ErrorMessage })
          })
        .catch((error) => dispatch({ type: 'Shelf_Fetch_Failed', payload: error.message }))
        .done();
        break;
      case 'Core':
        dispatch({ type: 'Fetching_Data'});
        return coreFetch(dispatch, item, nav);
      case 'NE':
        dispatch({ type: 'Fetching_Data'});
        if (id === '' || id === null){
          return dispatch({ type: 'NE_Fetch_Failed', payload: 'Please enter a value.' });
        }
        return neFetch(dispatch, id, nav);
      case 'Reset':
        return dispatch({ type: 'Reset_Data', nav });
      case 'QR':
        dispatch({ type: 'QR_Fetching_Data'});
        frameFetch(id, qr, getState().data.user.staff_user).then(
          ({ result, payload }) => {
            if (result==='Success'){
                return dispatch({ type: 'Frame_Fetch_Success', payload, nav: { ...nav, next: {...nav.next, type: 'Frame' }}});
            }
          shelfFetch(id, qr, getState().data.user.staff_user).then (
            ({ result, payload }) => {
              if (result==='Success'){
                return dispatch({ type: 'Shelf_Fetch_Success', payload, nav: { ...nav, next: {...nav.next, type: 'Shelf' }}});
              }
              throw new Error('No frame/shelf found on QR CODE ' + qr );
            })
          .catch((error) => dispatch({ type: 'QR_Fetch_Failed', payload: error.message }))
          .done();
        })
        .catch((error) => dispatch({ type: 'QR_Fetch_Failed', payload: error.message }))
        .done();
        break;
      default:
    }
  }
};

export const login = (source = 'splash',  staff_user, staff_pass, staff_name ) => {
  if (source==='splash'&&!staff_name){
    return { type: 'Navigate_To_Login' };
  }
  return (dispatch) => {
    dispatch({ type: 'Fetching_Data' });

    if (source==='login'&&((staff_user===null||staff_user===undefined) && (staff_pass===null||staff_pass===undefined))){
      return dispatch({ type: 'Login_Failed', payload: 'Please enter your TM Staff Id and Password' });
    } else  if (source==='login'&&(staff_user===null||staff_user===undefined)) {
      return dispatch({ type: 'Login_Failed', payload: 'Please enter your TM Staff Id' });
    } else  if (source==='login'&&(staff_pass===null||staff_pass===undefined)){
      return dispatch({ type: 'Login_Failed', payload: 'Please enter your Password' });
    }
    fetch('https://tmbill.tm.com.my/EZiBillWeb/Login/json/ldap',
    {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            username: staff_user,
            password: staff_pass,
          }
        )
      })
      .then((response) =>
      {
        if (response.status===800){
          return response.json();
        }
        throw new Error ('LDAP/Login Network Error [' + response.status + ']. Please try again later');
      })
      .then((responseJson) => {
        if (!responseJson.fullName) {
          if (source === 'splash'){
            return dispatch({ type: 'Navigate_To_Login' });
          }
          return dispatch({ type: 'Login_Failed', payload: 'Invalid TM Staff Id/password. Please try again.' });
        }
        staff_name = responseJson.fullName;
        fetch('http://58.27.85.176/FLASH/VerifyUser',
        //fetch('http://10.54.1.15:8001/FLASH/verifyAccess/Proxy_Services/PS_Flash_verifyAccess2',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
            },
            body: JSON.stringify(
              {
                STAFF_ID: staff_user,
              }
            )
          })
          .then((response) => {
            if (response.ok===true){
              return response.json();
            }
            throw new Error ('FLASH/VerifyUser Network Error [' + response.status + ']. Please try again later');
          })
          .then((responseJson) => {
            //@commented@console.log('DataActions:loginFlash');
            //@commented@console.log(responseJson);
            if (responseJson.ErrorCode === '00') {
              Alert.alert("Welcome", staff_name,
                [
                  {
                    text: 'OK', onPress: () => {
                      AsyncStorage.setItem('flash_user', staff_user);
                      AsyncStorage.setItem('flash_pass', staff_pass);
                      AsyncStorage.setItem('flash_name', staff_name);
                      return dispatch({type: 'Login_Success'});
                    }
                  }
                ]
              );
            }
            else if (source==='splash'){
              return dispatch({ type: 'Navigate_To_Login' });
            } else {
              throw new Error ('You are not authorized for Flash 2.0. Please contact your system administrator');
            }
          })
          .catch((error) => {
            if (source==='splash'){
              return dispatch({ type: 'Navigate_To_Login' });
            }
              return dispatch({ type: 'Login_Failed', payload: error.message });
          })
          .done()
      })
      .catch((error) => {
        if (source==='splash'){
          return dispatch({ type: 'Navigate_To_Login' });
        }
          return dispatch({ type: 'Login_Failed', payload: error.message });
      })
      .done();
  }
};

export const setMenuState = (menuState) => {
  return {
    type: 'Update_Menu_State',
    payload: menuState
  };
};

export const resetMenuState = () => {
  return {
    type: 'Reset_Menu_State'
  };
};

export const coreResetValues = () => {
  return {
    type: 'Core_Reset_Value'
  }
}

export const transferCoreResetValues = () => {
  return {
    type: 'Transfer_Core_Reset_Value'
  }
}

export const coreSetValues = ({ prop, value }) => {
  return {
    type: 'Core_Set_Values',
    payload: { prop, value }
  };
};

export const updateTransferCoreValues = ({ prop, value }) => {
  return {
    type: 'Transfer_Core_Set_Values',
    payload: { prop, value }
  };
};

export const updateUserValues = ({ prop, value }) => {
  return {
    type: 'User_Set_Values',
    payload: { prop, value }
  };
};

export async function frameFetch (id, qr, user) {
  try {
    //const response = await fetch('http://10.54.1.15:8001/FLASH/listFrameUnit/Proxy_Services/PS_listFrameUnit', {
    const response = await fetch('http://58.27.85.176/FLASH/QueryFrame', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          FRAME_NAME: id,
          QR_CODE: qr,
          USER: user
        }
      )
    })

    if (response.ok!==true){
      throw new Error ('FLASH/QueryFrame Network Error [' + response.status + ']. Please try again later');
    }

    const responseJson = await response.json();

    //@commented@console.log('DataAction:frameFetch');
    //@commented@console.log(responseJson);

    if (responseJson.ErrorCode === '00'){
      return Promise.resolve({ result: 'Success', payload: responseJson });
    }

    return Promise.resolve({ result: 'Not Found', ErrorCode: responseJson.ErrorCode, ErrorMessage: responseJson.ErrorMessage });

  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
}

export async function shelfFetch (id, qr, user) {
  try {
    //const response = await fetch('http://10.54.1.15:8001/FLASH/listFrameUnitDetail/Proxy_Services/PS_listFrameUnitDetail', {
    const response = await fetch('http://58.27.85.176/FLASH/QueryShelf', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          frame_unit_id: id,
          QR_CODE: qr,
          User: user
        }
      )
    })

    if (response.ok!==true){
      throw new Error ('FLASH/QueryShelf Network Error [' + response.status + ']. Please try again later');
    }

    const responseJson = await response.json();

    //@commented@console.log('DataAction:shelfFetch');
    //@commented@console.log(responseJson);

    if (responseJson.ErrorCode === '00'){
      return Promise.resolve({ result: 'Success', payload: responseJson });
    }

    return Promise.resolve({ result: 'Not Found', ErrorCode: responseJson.ErrorCode, ErrorMessage: responseJson.ErrorMessage });

  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
}

export const neFetch = (dispatch, id, nav) => {
    //fetch('http://10.54.1.15:8001/FLASH/listFrameUnit/Proxy_Services/PS_listFrameUnit',
    fetch('http://58.27.85.176/FLASH/QueryNEID',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          NE_ID: id
        }
      )
    })
    .then((response) => {
      if (response.ok===true){
        return response.json();
      }
      throw new Error ('FLASH/QueryNEID Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      //@commented@console.log('DataAction:neFetch');
      //@commented@console.log(responseJson);
      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'NE_Fetch_Success', payload: responseJson, nav });
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      dispatch({ type: 'NE_Fetch_Failed', payload: error.message});
    })
    .done();
};

export const logout = () => {
  return ({ type: 'Logout' });
};

export const coreFetch = (dispatch, payload, nav) => {
  return dispatch({ type: 'Core_Fetch_Success', payload, nav });
};

export const frameUpdateQR = ( IN_FRAME_NAME, QR_CODE) => {
  return (dispatch, getState) => {
    dispatch({ type: 'QR_Fetching_Data'});
    //fetch('http://10.54.1.15:8001/FLASH/updateQrOnFrame/Proxy_Services/PS_Flash_updateQrOnFrame',
    fetch('http://58.27.85.176/FLASH/updateQrOnFrame',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          IN_FRAME_NAME,
          QR_CODE,
          USER_ID: getState().data.user.staff_user
        }
      )
    })
    .then((response) => {
      if (response.ok===true){
        return response.json();
      }
      throw new Error ('FLASH/UpdateQROnFrame Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      //@commented@console.log('DataAction:frameUpdateQR');
      //@commented@console.log(responseJson);
      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'Frame_Update_QR_Success', payload: QR_CODE });
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      return dispatch({ type: 'Frame_Update_QR_Failed', payload: error.message});
    })
    .done();
  }
};

export const shelfUpdateQR = ( frame_unit_id, qr_code_id) => {
  return (dispatch, getState) => {
    dispatch({ type: 'QR_Fetching_Data'});
    //fetch('http://10.54.1.15:8001/FLASH/updateQrOnFrameUnit/Proxy_Services/PS_updateQrOnFrameUnit',
    fetch('http://58.27.85.176/FLASH/UpdateQROnFrameUnit',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          frame_unit_id,
          qr_code_id,
          User: getState().data.user.staff_user
        }
      )
    })
    .then((response) => {
      if (response.ok===true){
        return response.json();
      }
      throw new Error ('FLASH/UpdateQROnFrameUnit Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      //@commented@console.log('DataAction:shelfUpdateQR');
      //@commented@console.log(responseJson);
      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'Shelf_Update_QR_Success', payload: qr_code_id });
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      dispatch({ type: 'Shelf_Update_QR_Failed', payload: error.message});
    })
    .done();
  }
};

export const coreUpdateQR = ( frame_unit_id, pair_id, qr_code_id ) => {
  return (dispatch, getState) => {
    dispatch({ type: 'QR_Fetching_Data'});
    //fetch('http://10.54.1.15:8001/FLASH/updateQrOnPatching/Proxy_Services/PS_updateQrOnPatching',
    fetch('http://58.27.85.176/FLASH/UpdateQROnPatching',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          frame_unit_id,
          pair_id,
          qr_code_id,
          STAFF_ID: getState().data.user.staff_user
        }
      )
    })
    .then((response) => {
      if (response.ok===true){
        return response.json();
      }
      throw new Error ('FLASH/UpdateQROnPatching Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      //@commented@console.log('DataAction:coreUpdateQR');
      //@commented@console.log(responseJson);
      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'Core_Update_QR_Success', payload: qr_code_id });
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      dispatch({ type: 'Core_Update_QR_Failed', payload: error.message});
    })
    .done();
  }
};

export const coreUpdateDetails = ( input ) => {
  const { frame_unit_id, pair_id, ne_id, ne_shelf, ne_slot, ne_port, cct_name, to_ne_id, to_ne_shelf, to_ne_slot, to_ne_port, to_cct_name, status } = input;

  //@commented@console.log('coreUpdateDetails input:', input);
  return (dispatch, getState) => {
    dispatch({ type: 'Updating_Core'});
    fetch('http://58.27.85.176/FLASH/UpdateNEOnPatching',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          frame_unit_id,
          pair_id,
          New_ne_id: ne_id,
          New_ne_shelf: ne_shelf,
          New_ne_slot: ne_slot,
          New_ne_port: ne_port,
          New_cct_name: cct_name,
          TO_NE_ID: to_ne_id,
          TO_NE_SHELF: to_ne_shelf,
          TO_NE_SLOT: to_ne_slot,
          TO_NE_PORT: to_ne_port,
          TO_CCT_NAME: to_cct_name,
          TO_CORE_STATUS: status,
          STAFF_ID: getState().data.user.staff_user
        }
      )
    })
    .then((response) => {
      if (response.ok===true){
        return response.json();
      }
      throw new Error ('FLASH/UpdateNEOnPatching Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      //@commented@console.log('DataAction:coreUpdateDetails');
      //@commented@console.log(responseJson);
      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'Core_Update_Details_Success', payload: { ...input }});
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      dispatch({ type: 'Core_Update_Details_Failed', payload: error.message});
    })
    .done();
  }
};

export const transferCore = (input) => {
  const { from_pair_id, to_pair_id, frame_name, cable_name, cable_core_no } = input;
  //@commented@console.log('transferCore input:', input);
  return (dispatch, getState) => {
    dispatch({ type: 'Updating_Core'});
    if (!from_pair_id||!frame_name||!cable_name||!cable_core_no){
      return dispatch({ type: 'Transfer_Core_Failed', payload: 'Please fill in all required fields' });
    }

    fetch('http://58.27.85.176/FLASH/TransferCore',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          FROM_PAIR_ID: from_pair_id,
          TO_PAIR_ID: to_pair_id,
          FRAME_NAME: frame_name,
          CABLE_NAME: cable_name,
          CABLE_CORE_NO: cable_core_no,
          STAFF_ID: getState().data.user.staff_user
        }
      )
    })
    .then((response) => {
      //@disableHTTPrespons@//@commented@console.log('DataAction:transferCore response');
      //@disableHTTPrespons@//@commented@console.log(response);
      if (response.ok===true){
        return response.json();
      }
      throw new Error('FLASH/TransferCore Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      //@commented@console.log('DataAction:transferCore');
      //@commented@console.log(responseJson);
      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'Transfer_Core_Success'});
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      dispatch({ type: 'Transfer_Core_Failed', payload: error.message});
    })
    .done();
  }
};

export const transferCoreFetchShelf = (qr) => {
  return (dispatch, getState) => {
    dispatch({ type: 'QR_Fetching_Data'});
    shelfFetch('', qr, getState().data.user.staff_user).then (
    ({ result, ErrorMessage, payload }) => {
      if (result==='Success'){
        return dispatch({ type: 'Transfer_Core_Fetch_Shelf_Success', payload });
      }
      throw new Error(ErrorMessage);
    })
    .catch((error) => dispatch({ type: 'Transfer_Core_Fetch_Shelf_Failed', payload: error.message }))
    .done();
  }
};

export const requestCameraPermission = () => {
  return (dispatch, getState) => {
    if (!getState().data.hasCameraPermission){
      Permissions.askAsync(Permissions.CAMERA)
        .then(({ status }) => {
          if (status==='granted'){
            return dispatch({ type: 'Camera_Permission_Granted'});
          }
          throw new Error('Camera permission not granted. Press OK to retry');
        }
      )
      .catch((error) => {
        return dispatch({ type: 'Camera_Permission_Denied', payload: error.message});
      })
      .done();
    } else {
      return dispatch({ type: 'Camera_Permission_Granted'});
    }
  }
};
