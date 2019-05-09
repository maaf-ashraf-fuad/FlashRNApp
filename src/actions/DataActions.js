import NavigationService from '../navigation/NavigationService.js';
import { AsyncStorage, Alert,Platform } from 'react-native';
import { Permissions } from 'expo';

export const fetchHelper = (nav) => {
  const { type, id, qr, item } = nav.next;

  if (nav.action&&nav.action.type==='back'){
    NavigationService.back();
  }

  if (nav.action&&nav.action.type==='reset'){
    NavigationService.popToTop();
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
      case 'Cable_Id':
        dispatch({ type: 'Fetching_Data'});
        if (id === '' || id === null){
          return dispatch({ type: 'Cable_Fetch_Failed', payload: 'Please enter a value.' });
        }
        return cableFetch(dispatch, id, null, nav);
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
                coreQRFetch(qr, getState().data.user.staff_user).then (
                  ({ result, payload }) => {
                    if (result==='Success'){
                      return dispatch({ type: 'Core_Fetch_Success', payload: payload.FU_Detail, nav: { ...nav, next: {...nav.next, type: 'Core' }}});
                    }
                    throw new Error('No frame/shelf/core found on QR CODE ' + qr );
                  })
                .catch((error) => dispatch({ type: 'QR_Fetch_Failed', payload: error.message }))
                .done();
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
    fetch('https://euct.tm.com.my/api/api/LoginApi',
    {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            STAFF_ID: staff_user,
            PASSWORD: staff_pass,
          }
        )
      })
      .then((response) =>
      {
        if (response.status===200){
          return response.json();
        }
        throw new Error ('LDAP/Login Network Error [' + response.status + ']. Please try again later');
      })
      .then((responseJson) => {
        if (!responseJson.data.NAME) {
          if (source === 'splash'){
            return dispatch({ type: 'Navigate_To_Login' });
          }
          return dispatch({ type: 'Login_Failed', payload: 'Invalid TM Staff Id/password. Please try again.' });
        }
        staff_name = responseJson.data.NAME;
        /*DMZfetch('http://58.27.85.176/FLASH/VerifyUser',
        fetch('http://10.54.1.15:8001/FLASH/verifyAccess/Proxy_Services/PS_Flash_verifyAccess2',//*/
        fetch('http://tmsoaosb.intra.tm/FLASH/verifyAccess/Proxy_Services/PS_Flash_verifyAccess2',
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

            /*DEBUG
            console.log(' ');
            console.log('DataActions:loginFlash Input');
            console.log('STAFF_ID:', staff_user);
            console.log(' ');
            console.log('DataActions:loginFlash Response');
            console.log(responseJson);
            */

            if (responseJson.ErrorCode === '00') {
              Alert.alert("FLASH", "Welcome "+staff_name + " on Flash App in " +  Platform.OS+Platform.Version + " platform");
              AsyncStorage.setItem('flash_user', staff_user);
              AsyncStorage.setItem('flash_pass', staff_pass);
              AsyncStorage.setItem('flash_name', staff_name);
              return dispatch({type: 'Login_Success', payload: { staff_name, staff_pass, staff_user }});
            }
            else if (source==='splash'){
              return dispatch({ type: 'Navigate_To_Login' });
            }

            throw new Error ('You are not authorized for FLASH. Please contact your system administrator');

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
    /*DMZconst response = await fetch('http://58.27.85.176/FLASH/QueryFrame', {
    const response = await fetch('http://10.54.1.15:8001/FLASH/listFrameUnit/Proxy_Services/PS_listFrameUnit', {//*/
    const response = await fetch('http://tmsoaosb.intra.tm/FLASH/listFrameUnit/Proxy_Services/PS_listFrameUnit', {
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
    /*DEBUG
    console.log(' ');
    console.log('DataActions:frameFetch Input');
    console.log('FRAME_NAME:', id);
    console.log('QR_CODE:', qr);
    console.log('USER:', user);
    console.log(' ');
    console.log('DataActions:frameFetch Response');
    console.log(responseJson);
    */
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
    /*DMZconst response = await fetch('http://58.27.85.176/FLASH/QueryShelf', {
    const response = await fetch('http://10.54.1.15:8001/FLASH/listFrameUnitDetail/Proxy_Services/PS_listFrameUnitDetail', {//*/
    const response = await fetch('http://tmsoaosb.intra.tm/FLASH/listFrameUnitDetail/Proxy_Services/PS_listFrameUnitDetail', {
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
    /*DEBUG
    console.log(' ');
    console.log('DataActions:shelfFetch Input');
    console.log('frame_unit_id:', id);
    console.log('QR_CODE:', qr);
    console.log('User:', user);
    console.log(' ');
    console.log('DataActions:shelfFetch Response');
    console.log(responseJson);
    */

    if (responseJson.ErrorCode === '00'){
      return Promise.resolve({ result: 'Success', payload: responseJson });
    }

    return Promise.resolve({ result: 'Not Found', ErrorCode: responseJson.ErrorCode, ErrorMessage: responseJson.ErrorMessage });

  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
}

export async function coreQRFetch (qr, user) {
  try {
    /*DMZconst response = await fetch('http://58.27.85.176/FLASH/frameUnitDetailOnQR', {
    const response = await fetch('http://10.54.1.15:8001/FLASH/frameUnitDetailOnQR/Proxy_Services/PS_frameUnitDetailOnQR', {//*/
    const response = await fetch('http://tmsoaosb.intra.tm/FLASH/frameUnitDetailOnQR/Proxy_Services/PS_frameUnitDetailOnQR', {

      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          QR_CODE: qr,
          USER: user
        }
      )
    })
    if (response.ok!==true){
      throw new Error ('FLASH/coreQRFetch Network Error [' + response.status + ']. Please try again later');
    }
    const responseJson = await response.json();
    /*DEBUG
    console.log(' ');
    console.log('DataActions:coreQRFetch Input');
    console.log('QR_CODE:', qr);
    console.log('USER:', user);
    console.log(' ');
    console.log('DataActions:coreQRFetch Response');
    console.log(responseJson);
    */

    if (responseJson.ErrorCode === '00'){
      return Promise.resolve({ result: 'Success', payload: responseJson });
    }

    return Promise.resolve({ result: 'Not Found', ErrorCode: responseJson.ErrorCode, ErrorMessage: responseJson.ErrorMessage });

  } catch (error) {
    return Promise.reject(new Error(error.message));
  }
}

export const neFetch = (dispatch, id, nav) => {
    /*DMZfetch('http://58.27.85.176/FLASH/QueryNEID',
    fetch('http://10.54.1.15:8001/FLASH/frameUnitDetailOnNe/Proxy_Services/PS_frameUnitDetailOnNe',//*/
    fetch('http://tmsoaosb.intra.tm/FLASH/frameUnitDetailOnNe/Proxy_Services/PS_frameUnitDetailOnNe',
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
      /*DEBUG
      console.log(' ');
      console.log('DataActions:neFetch Input');
      console.log('NE_ID:', id);
      console.log(' ');
      console.log('DataActions:neFetch Response');
      console.log(responseJson);
      */

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

export const cableFetch = (dispatch, cable_id, core_id, nav) => {
    /*DMZfetch('http://58.27.85.176/FLASH/frameUnitDetailOnCable',
    fetch('http://10.54.1.15:8001/FLASH/frameUnitDetailOnCable/Proxy_Services/PS_frameUnitDetailOnCable',//*/
    fetch('http://tmsoaosb.intra.tm/FLASH/frameUnitDetailOnCable/Proxy_Services/PS_frameUnitDetailOnCable',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          CABLE_ID: cable_id,
          CAB_CORE_ID: core_id,
        }
      )
    })
    .then((response) => {
      if (response.ok===true){
        return response.json();
      }
      throw new Error ('FLASH/QueryCableID Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      /*DEBUG
      console.log(' ');
      console.log('DataActions:cableFetch Input');
      console.log('CABLE_ID:', cable_id);
      console.log('CAB_CORE_ID:', core_id);
      console.log(' ');
      console.log('DataActions:cableFetch Response');
      console.log(responseJson);
      */

      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'Cable_Fetch_Success', payload: responseJson, nav });
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      dispatch({ type: 'Cable_Fetch_Failed', payload: error.message});
    })
    .done();
};

export const logout = () => {
  return ({ type: 'Logout' });
};

export const coreFetch = (dispatch, payload, nav) => {
  return dispatch({ type: 'Core_Fetch_Success', payload, nav });
};

export const coreRefresh = ( core_id ) => {
  return (dispatch) => {
      /*DMZfetch('http://58.27.85.176/FLASH/frameUnitDetailOnCable',
      fetch('http://10.54.1.15:8001/FLASH/frameUnitDetailOnCable/Proxy_Services/PS_frameUnitDetailOnCable',//*/
      fetch('http://tmsoaosb.intra.tm/FLASH/frameUnitDetailOnCable/Proxy_Services/PS_frameUnitDetailOnCable',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
        },
        body: JSON.stringify(
          {
            CABLE_ID: null,
            CAB_CORE_ID: core_id,
          }
        )
      })
      .then((response) => {
        if (response.ok===true){
          return response.json();
        }
        throw new Error ('FLASH/refreshCore Network Error [' + response.status + ']. Please try again later');
      })
      .then((responseJson) => {
        /*DEBUG
        console.log(' ');
        console.log('DataActions:coreRefresh Input');
        console.log('CABLE_ID:', 'null');
        console.log('CAB_CORE_ID:', core_id);
        console.log(' ');
        console.log('DataActions:coreRefresh Response');
        console.log(responseJson);
        */

        if (responseJson.ErrorCode === '00'){
          return dispatch({ type: 'Core_Refresh_Success', payload: responseJson });
        }
        throw new Error(responseJson.ErrorMessage);
      })
      .catch((error) => {
        dispatch({ type: 'Core_Refresh_Failed', payload: error.message});
      })
      .done();
  };
};

export const frameUpdateQR = ( IN_FRAME_NAME, QR_CODE) => {
  return (dispatch, getState) => {
    dispatch({ type: 'QR_Fetching_Data'});
    /*DMZfetch('http://58.27.85.176/FLASH/updateQrOnFrame',
    fetch('http://10.54.1.15:8001/FLASH/updateQrOnFrame/Proxy_Services/PS_Flash_updateQrOnFrame',//*/
    fetch('http://tmsoaosb.intra.tm/FLASH/updateQrOnFrame/Proxy_Services/PS_Flash_updateQrOnFrame',
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
      /*DEBUG
      console.log(' ');
      console.log('DataActions:frameUpdateQR Input');
      console.log('IN_FRAME_NAME:', IN_FRAME_NAME);
      console.log('QR_CODE:', QR_CODE);
      console.log('USER_ID:', getState().data.user.staff_user);
      console.log(' ');
      console.log('DataActions:frameUpdateQR Response');
      console.log(responseJson);
      */

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
    /*DMZfetch('http://58.27.85.176/FLASH/UpdateQROnFrameUnit',
    fetch('http://10.54.1.15:8001/FLASH/updateQrOnFrameUnit/Proxy_Services/PS_updateQrOnFrameUnit',//*/
    fetch('http://tmsoaosb.intra.tm/FLASH/updateQrOnFrameUnit/Proxy_Services/PS_updateQrOnFrameUnit',
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
      /*DEBUG
      console.log(' ');
      console.log('DataActions:shelfUpdateQR Input');
      console.log('frame_unit_id:', frame_unit_id);
      console.log('qr_code_id:', qr_code_id);
      console.log('User:', getState().data.user.staff_user);
      console.log(' ');
      console.log('DataActions:shelfUpdateQR Response');
      console.log(responseJson);
      */

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
    /*DMZfetch('http://58.27.85.176/FLASH/UpdateQROnPatching',
    fetch('http://10.54.1.15:8001/FLASH/updateQrOnPatching/Proxy_Services/PS_updateQrOnPatching',//*/
    fetch('http://tmsoaosb.intra.tm/FLASH/updateQrOnPatching/Proxy_Services/PS_updateQrOnPatching',
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
      /*DEBUG
      console.log(' ');
      console.log('DataActions:coreUpdateQR Input');
      console.log('frame_unit_id:', frame_unit_id);
      console.log('pair_id:', pair_id);
      console.log('qr_code_id:', qr_code_id);
      console.log('STAFF_ID:', getState().data.user.staff_user);
      console.log(' ');
      console.log('DataActions:coreUpdateQR Response');
      console.log(responseJson);
      */

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
  const { frame_unit_id, pair_id, ne_id, ne_shelf, ne_slot, ne_port, cct_name, to_ne_id, to_ne_shelf, to_ne_slot, to_ne_port, to_cct_name, status, cable_core_id } = input;

  return (dispatch, getState) => {
    dispatch({ type: 'Updating_Core'});
    /*DMZfetch('http://58.27.85.176/FLASH/UpdateNEOnPatching',
    fetch('http://10.54.1.15:8001/FLASH/updateNeOnPatching/Proxy_Services/PS_updateNeOnPatching',//*/
    fetch('http://tmsoaosb.intra.tm/FLASH/updateNeOnPatching/Proxy_Services/PS_updateNeOnPatching',
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
      /*DEBUG
      console.log(' ');
      console.log('DataActions:coreUpdateDetails Input');
      console.log('frame_unit_id:', frame_unit_id);
      console.log('pair_id:', pair_id);
      console.log('New_ne_id:', ne_id);
      console.log('New_ne_shelf:', ne_shelf);
      console.log('New_ne_slot:', ne_slot);
      console.log('New_ne_port:', ne_port);
      console.log('New_cct_name:', cct_name);
      console.log('TO_NE_ID:', to_ne_id);
      console.log('TO_NE_SHELF:', to_ne_shelf);
      console.log('TO_NE_SLOT:', to_ne_slot);
      console.log('TO_NE_PORT:', to_ne_port);
      console.log('TO_CCT_NAME:', to_cct_name);
      console.log('TO_CORE_STATUS:', status);
      console.log('STAFF_ID:', getState().data.user.staff_user);
      console.log(' ');
      console.log('DataActions:coreUpdateDetails Response');
      console.log(responseJson);
      */

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
  const { from_pair_id, to_pair_id, frame_name, cable_name, cable_core_no , cable_core_id} = input;
  return (dispatch, getState) => {
    dispatch({ type: 'Updating_Core'});
    if (!from_pair_id||!frame_name||!cable_name||!cable_core_no){
      return dispatch({ type: 'Transfer_Core_Failed', payload: 'Please fill in all required fields' });
    }

    /*DMZfetch('http://58.27.85.176/FLASH/TransferCore',
    fetch('http://10.54.1.15:8001/FLASH/transferCore/Proxy_Services/PS_transferCore',//*/
    fetch('http://tmsoaosb.intra.tm/FLASH/transferCore/Proxy_Services/PS_transferCore',
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
          //TO_PAIR_ID: to_pair_id,
          FRAME_NAME: frame_name,
          CABLE_NAME: cable_name,
          CABLE_CORE_NO: cable_core_no,
          STAFF_ID: getState().data.user.staff_user
        }
      )
    })
    .then((response) => {
      if (response.ok===true){
        return response.json();
      }
      throw new Error('FLASH/TransferCore Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      /*DEBUG
      console.log(' ');
      console.log('DataActions:transferCore Input');
      console.log('FROM_PAIR_ID:', from_pair_id);
      console.log('FRAME_NAME:', frame_name);
      console.log('CABLE_NAME:', cable_name);
      console.log('CABLE_CORE_NO:', cable_core_no);
      console.log('STAFF_ID:', getState().data.user.staff_user);
      console.log(' ');
      console.log('DataActions:transferCore Response');
      console.log(responseJson);
      */

      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'Transfer_Core_Success'});
        //dispatch({ type: 'Transfer_Core_Success'});
        //return coreRefresh (cable_core_id);
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
      Permissions.askAsync(Permissions.CAMERA_ROLL)
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
