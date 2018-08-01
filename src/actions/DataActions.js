import NavigationService from '../navigation/NavigationService.js';
import { AsyncStorage, Alert } from 'react-native';

export const fetchHelper = (nav) => {
  const { type, id, qr, staff, item } = nav.next;
  console.log('DataAction:fetchHelper');
  console.log(nav.next);

  if (nav.action&&nav.action.type==='back'){
    NavigationService.back();
  }

  return (dispatch, getState) => {
    //console.log('DataAction:13');
    //console.log(getState().data);//.otherRedducer;
    switch (type) {
      case 'Frame':
        dispatch({ type: 'Fetching_Data'});
        if (id!==undefined && (id === '' || id === null)){
          return dispatch({ type: 'Frame_Fetch_Failed', payload: 'Please enter a value.' });
        }
        return frameFetch(dispatch, id, qr, nav);
      case 'Shelf':
        dispatch({ type: 'Fetching_Data'});
        if (id!==undefined && isNaN(id)){
          return dispatch({ type: 'Shelf_Fetch_Failed', payload: 'Please enter numbers only.' });
        } else if (id!==undefined && (id === '' || id === null)){
          return dispatch({ type: 'Shelf_Fetch_Failed', payload: 'Please enter a value.' });
        }
        return shelfFetch(dispatch, id, qr, nav);
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
      default:
    }
  }
};

/*async getItem => () => {
  return await AsyncStorage.getItem(a);
}*/

export const login = (source = 'splash',  staff_user, staff_pass, staff_name ) => {
  //return { type: 'Navigate_To_Login' };
  console.log(source, staff_user, staff_pass, staff_name);
  if (source==='splash'){
    /*staff_name = await AsyncStorage.getItem('staff_name');
    staff_user = await AsyncStorage.getItem('flash_user');
    staff_pass = await AsyncStorage.getItem('flash_pass');
    console.log( source, staff_user, staff_pass, staff_name );*/
    if (staff_name===null||staff_name===undefined){
      //console.log( 'loginnn' );
      return { type: 'Navigate_To_Login' };
    }
  }
  //return async (dispatch, getState) => {
  return (dispatch) => {
    dispatch({ type: 'Fetching_Data' });
    
    if (source==='login'&&((staff_user===null||staff_user===undefined) && (staff_pass===null||staff_pass===undefined))){
      return dispatch({ type: 'Login_Failed', payload: 'Please enter your TM Staff Id and Password' });
    } else  if (source==='login'&&(staff_user===null||staff_user===undefined)) {
      return dispatch({ type: 'Login_Failed', payload: 'Please enter your TM Staff Id' });
    } else  if (source==='login'&&(staff_pass===null||staff_pass===undefined)){
      return dispatch({ type: 'Login_Failed', payload: 'Please enter your Password' });
    }
    //this.props.navigation.navigate('Menu')
    //return Login._submitForm();
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
      .then((response) => //response.json())
      {
        console.log('DataActions:84');
        console.log(response);
        if (response.status===800){
          return response.json();
        }
        throw new Error ('LDAP/Login Network Error [' + response.status + ']. Please try again later');
      })
      .then((responseJson) => {
        console.log('DataActions:loginLDAP');
        console.log(responseJson);
        if (responseJson.fullName === null) {
          //Alert.alert("Flash", staff_name + " need to re-login");
          if (source === 'splash'){
            return dispatch({ type: 'Navigate_To_Login' });
          }
          return dispatch({ type: 'Login_Failed', payload: 'Invalid TM Staff Id/password. Please try again.' });
        }
        else if (responseJson.fullName !== null) {
          //console.log('LDAP Pass');
          staff_name = responseJson.fullName;
          //SOA Check
          fetch('http://58.27.85.176/FLASH/VerifyUser',
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
              //console.log('DataActions:83');
              //console.log(response);
              if (response.ok===true){
                return response.json();
              }
              throw new Error ('FLASH/VerifyUser Network Error [' + response.status + ']. Please try again later');
            })
            .then((responseJson) => {
              console.log('DataActions:loginFlash');
              console.log(responseJson);
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
          //End SoA CHECK
        }
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

export const frameFetch = (dispatch, id, qr, nav) => {
    //fetch('http://10.54.1.15:8001/FLASH/listFrameUnit/Proxy_Services/PS_listFrameUnit',
    fetch('http://58.27.85.176/FLASH/QueryFrame',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          FRAME_NAME: id,
          QR_CODE: qr
        }
      )
    })
    .then((response) => {
      //console.log('DataActions:83');
      //console.log(response);
      if (response.ok===true){
        return response.json();
      }
      throw new Error ('FLASH/QueryFrame Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      console.log('DataAction:frameFetch');
      console.log(responseJson);
      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'Frame_Fetch_Success', payload: responseJson, nav });
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      //console.error(error);
      dispatch({ type: 'Frame_Fetch_Failed', payload: error.message});
    })
    .done();
};

export const shelfFetch = (dispatch, id, qr, nav) => {
    fetch('http://58.27.85.176/FLASH/QueryShelf',
    {
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
        }
      )
    })
    .then((response) => {
      //console.log('DataActions:83');
      //console.log(response);
      if (response.ok===true){
        return response.json();
      }
      throw new Error ('FLASH/QueryShelf Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      console.log('DataAction:shelfFetch');
      console.log(responseJson);
      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'Shelf_Fetch_Success', payload: responseJson, nav });
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      //console.error(error);
      dispatch({ type: 'Shelf_Fetch_Failed', payload: error.message});
    })
    .done();
};

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
      //console.log('DataActions:83');
      //console.log(response);
      if (response.ok===true){
        return response.json();
      }
      throw new Error ('FLASH/QueryNEID Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      console.log('DataAction:neFetch');
      console.log(responseJson);
      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'NE_Fetch_Success', payload: responseJson, nav });
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      //console.error(error);
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

export const shelfUpdateQR = ( frame_unit_id, qr_code_id) => {
  return (dispatch, getState) => {
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
      //console.log('DataActions:83');
      //console.log(response);
      if (response.ok===true){
        return response.json();
      }
      throw new Error ('FLASH/UpdateQROnFrameUnit Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      console.log('DataAction:shelfUpdateQR');
      console.log(responseJson);
      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'Shelf_Update_QR_Success', payload: qr_code_id });
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      //console.error(error);
      dispatch({ type: 'Shelf_Update_QR_Failed', payload: error.message});
    })
    .done();
  }
};

export const coreUpdateQR = ( frame_unit_id, pair_id, qr_code_id ) => {
  return (dispatch, getState) => {
    //fetch('http://10.54.1.15:8001/FLASH/listFrameUnit/Proxy_Services/PS_listFrameUnit',
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
          User: getState().data.user.staff_user
        }
      )
    })
    .then((response) => {
      //console.log('DataActions:83');
      //console.log(response);
      if (response.ok===true){
        return response.json();
      }
      throw new Error ('FLASH/UpdateQROnPatching Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      console.log('DataAction:coreUpdateQR');
      console.log(responseJson);
      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'Core_Update_QR_Success', payload: qr_code_id });
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      //console.error(error);
      dispatch({ type: 'Core_Update_QR_Failed', payload: error.message});
    })
    .done();
  }
};

export const coreUpdateDetails = ( frame_unit_id, pair_id, qr_code_id, ne_id, ne_shelf, ne_slot, ne_port, cct_name, User) => {
  return (dispatch) => {
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
          qr_code_id,
          New_ne_id: ne_id,
          New_ne_shelf: ne_shelf,
          New_ne_slot: ne_slot,
          New_ne_port: ne_port,
          New_cct_name: cct_name,
          User
        }
      )
    })
    .then((response) => {
      //console.log('DataActions:83');
      //console.log(response);
      if (response.ok===true){
        return response.json();
      }
      throw new Error ('FLASH/UpdateNEOnPatching Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      console.log('DataAction:coreUpdateDetails');
      console.log(responseJson);
      if (responseJson.ErrorCode === '00'){
        return dispatch({ type: 'Core_Update_Details_Success', payload: { ne_id, ne_shelf, ne_slot, ne_port, cct_name }});
      }
      throw new Error(responseJson.ErrorMessage);
    })
    .catch((error) => {
      //console.error(error);
      dispatch({ type: 'Core_Update_Details_Failed', payload: error.message});
    })
    .done();
  }
};

//export const transferCore = ( From_frame_unit_id, To_frame_unit_id, From_pair_id, To_pair_id, STAFF_ID) => {
export const transferCore = ( From_frame_unit_id, To_frame_unit_id, From_pair_id, To_pair_id) => {
  //console.log('From_frame_unit_id: ', From_frame_unit_id);
  //console.log('To_frame_unit_id: ', To_frame_unit_id);
  //console.log('From_pair_id: ', From_pair_id);
  //console.log('To_pair_id: ', To_pair_id);
  //console.log('STAFF_ID: ', STAFF_ID);
  return (dispatch, getState) => {
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
          From_frame_unit_id,
          To_frame_unit_id,
          From_pair_id,
          To_pair_id,
          User: getState().data.user.staff_user
        }
      )
    })
    .then((response) => {
      //console.log('DataActions:83');
      //console.log(response);
      if (response.ok===true){
        return response.json();
      }
      throw new Error('FLASH/TransferCore Network Error [' + response.status + ']. Please try again later');
    })
    .then((responseJson) => {
      console.log('DataAction:transferCore');
      console.log(responseJson);
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
