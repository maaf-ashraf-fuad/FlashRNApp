import _ from 'lodash';
import NavigationService from '../navigation/NavigationService.js';
import { AsyncStorage, Alert } from 'react-native';

const INITIAL_STATE = {
  parent: undefined,
  child: undefined,
  parent_type: undefined,
  child_type: undefined,
  searchType: 'Frame',
  searchText: '',
  error: '',
  loading: false,
  coreLoading: false,
  headerExpended: false,
  headerMode: null,
  User: '',
  toCore: { To_frame_unit_id: '', To_pair_id: ''},
  editCore: { ne_id: '', ne_shelf: '', ne_slot: '', ne_port: '', cct_name: '', status: '' },
  user: { staff_name: undefined, staff_user: undefined, staff_pass: undefined }
};

isArray = (a) => {
    return (!!a) && (a.constructor === Array);
};

navigationHelper = ({ action, next, back }) => {
  //console.log('DataReducer:navigationHelper');
  //console.log(action);
  switch (action.type) {
    case 'navigate':
      return NavigationService.navigate(action.routeName, { next, back });
    case 'push':
      return NavigationService.push(action.routeName, { next, back });
    case 'replace':
      return NavigationService.push(action.routeName, { next, back });
    /*case 'back':
      return NavigationService.back();*/
    default:
      return null;
  }
};

export default (state = INITIAL_STATE, action) => {
  let parent = '';
  let child = '';
  //console.log ('props:', this.props);

  switch (action.type) {
    case 'Navigate_To_Login':
      NavigationService.replace('Login', {});
      return state;
    case 'Login_Success':
      NavigationService.replace('Menu', {});
      return { ...state, loading: false, user: { ...action.payload }};
    case 'Login_Failed':
      return { ...state, loading: false, error: _.replace(action.payload, /\([0-9]*\)/, '') };
    case 'Logout':
      AsyncStorage.clear();
      NavigationService.replace('Login', {});
      return { ...state, ...INITIAL_STATE};
    case 'Fetching_Data':
      //return { ...state, loading: true, error: '', headerExpended: false, headerMode: null };
      return { ...state, loading: true };
    case 'Updating_Core':
      //return { ...state, loading: true, error: '', headerExpended: false, headerMode: null };
      return { ...state, coreLoading: true };
    case 'Reset_Data':
      this.navigationHelper(action.nav);
      return { ...state, ...INITIAL_STATE, user: { ...state.user }};
    case 'Update_Menu_State':
      return { ...state, error: '', ...action.payload };
    case 'Frame_Fetch_Failed':
      /*if(action.alert){
        Alert.alert ('Flash 2.0', _.replace(action.payload, /\([0-9]*\)/, ''));
      }*/

      return { ...state,
          loading: false,
          searchType: 'Frame',
          error: _.replace(action.payload, /\([0-9]*\)/, '')
    };
    case 'Shelf_Fetch_Failed':
    return { ...state,
      loading: false,
      searchType: 'Shelf',
      error: _.replace(action.payload, /\([0-9]*\)/, '')
    };
    case 'NE_Fetch_Failed':
    return { ...state,
      loading: false,
      searchType: 'NE',
      error: _.replace(action.payload, /\([0-9]*\)/, '')
    };
    case 'Frame_Fetch_Success':
      //child = _.pick(action.payload, ['LIST_FRAME_UNIT']).LIST_FRAME_UNIT;
      /*child = action.payload.LIST_FRAME_UNIT;
      //console.log('isArray: ', this.isArray(child));
      if (this.isArray(child)){
        child = _.map(child, (val) => _.mapValues(val, (val) => val === 'Null'?null:val));
      } else {
        child = [_.mapValues(child, (val) => val === 'Null'?null:val)];
      }*/
      //NavigationService.push('DataPage', { next: { type: action.type, id: action.payload.id }, back: { type: 'Reset' } });
      if (this.isArray(action.payload.LIST_FRAME_UNIT)){
        child = action.payload.LIST_FRAME_UNIT;
      } else {
        child = [action.payload.LIST_FRAME_UNIT];
      }
      this.navigationHelper(action.nav);
      return { ...state,
          parent: _.mapValues(_.mapKeys(_.omitBy(action.payload, (val, key) => key === 'LIST_FRAME_UNIT' || key === 'ErrorCode' || key === 'ErrorMessage' || key === 'TMSOA_Status' || key === 'xmlns' || key === 'xmlns:env' || key === 'xmlns:ns2' || key === 'xmlns:wsa'), (val, key) => key.toLowerCase()), (val) => val==='Null'?null:val),
          //child: _.map(Object.values(_.pick(action.payload, ['LIST_FRAME_UNIT']))[0], (val) => _.mapValues(val, (val) => val==='Null'?null:val)),
          child,
          parent_type: 'Frame',
          child_type: 'Shelf',
          loading: false,
          error: ''
      };

    case 'Shelf_Fetch_Success':
      /*//child = _.pick(action.payload, ['FU_Detail']).FU_Detail;
      child = action.payload.FU_Detail;
      //console.log('isArray: ', this.isArray(child));
      if (this.isArray(child)){
        child = _.map(child, (val) => _.mapValues(val, (val) => val === 'Null'?null:val));
      } else {
        child = [_.mapValues(child, (val) => val === 'Null'?null:val)];
      }*/
      if (this.isArray(action.payload.FU_Detail)){
        child = action.payload.FU_Detail;
      } else {
        child = [action.payload.FU_Detail];
      }
      this.navigationHelper(action.nav);
      return { ...state,
        parent: _.mapValues(_.mapKeys(_.omitBy(action.payload, (val, key) => key === 'FU_Detail' || key === 'ErrorCode' || key === 'ErrorMessage' || key === 'TMSOA_Status' || key === 'xmlns' || key === 'xmlns:env' || key === 'xmlns:ns2' || key === 'xmlns:wsa'), (val, key) => key.toLowerCase()), (val) => val==='Null'?null:val),
        child,
        parent_type: 'Shelf',
        child_type: 'Core',
        loading: false,
        error: ''
      };
    case 'Core_Fetch_Success':
      this.navigationHelper(action.nav);
      console.log(action.payload);
      parent = _.mapValues(action.payload, (val) => val==='Null'?null:val);
      return { ...state,
        parent,
        child: undefined,
        parent_type: 'Core',
        child_type: undefined,
        loading: false,
        error: '',
        editCore: {
          ne_id: parent.ne_id,
          ne_shelf: parent.ne_shelf,
          ne_slot: parent.ne_slot,
          ne_port: parent.ne_port,
          cct_name: parent.cct_name,
          status: parent.status
        },
        toCore: INITIAL_STATE.toCore
      }
    case 'NE_Fetch_Success':
      //console.log('ne_fetch: ', action.payload);
      if (this.isArray(action.payload.FU_Detail)){
        child = action.payload.FU_Detail;
      } else {
        child = [action.payload.FU_Detail];
      }
      this.navigationHelper(action.nav);
      return { ...state,
          parent: undefined,
          //child: _.map(Object.values(_.pick(action.payload, ['FU_Detail']))[0], (val) => _.mapValues(val, (val) => val==='Null'?null:val)),
          child,
          parent_type: 'NE',
          child_type: 'Core',
          loading: false,
          error: ''
      };
    case 'Core_Set_Values':
      return { ...state, error: '', editCore: {...state.editCore, [action.payload.prop]: action.payload.value }};
    case 'Transfer_Core_Set_Values':
      return { ...state, error: '', toCore: {...state.toCore, [action.payload.prop]: action.payload.value }};
    case 'User_Set_Values':
      return { ...state, error: '', user: {...state.user, [action.payload.prop]: action.payload.value }};
    case 'Core_Reset_Value':
      return { ...state,
      editCore: {
        ne_id: state.parent.ne_id,
        ne_shelf: state.parent.ne_shelf,
        ne_slot: state.parent.ne_slot,
        ne_port: state.parent.ne_port,
        cct_name: state.parent.cct_name,
        status: state.parent.status
      }};
    case 'Shelf_Update_QR_Success':
      NavigationService.pop();
      return { ...state,
        parent: {
          ...state.parent,
          qr_code_id: action.payload
        },
        error: '',
        loading: false,
      };
    case 'Shelf_Update_QR_Failed':
      return { ...state,
        error: _.replace(action.payload, /\([0-9]*\)/, ''),
        loading: false,
      };
    case 'Core_Update_QR_Success':
      NavigationService.pop();
      return { ...state,
        parent: {
          ...state.parent,
          qr_code_id: action.payload
        },
        error: '',
        loading: false,
      };
    case 'Core_Update_QR_Failed':
      return { ...state,
        error: _.replace(action.payload, /\([0-9]*\)/, ''),
        loading: false,
      };
    case 'Core_Update_Details_Success':
      return { ...state,
        parent: { ...state.parent, ...action.payload
        },
          coreLoading: false,
        error: 'Core details successfully updated!'
      }
    case 'Core_Update_Details_Failed':
      return { ...state,
        coreLoading: false,
        error: 'Core details successfully updated!'
      }
    case 'Transfer_Core_Success':
      return { ...state,
        coreLoading: false,
        error: 'Core successfully trasferred!'
      }
    case 'Transfer_Core_Failed':
      return { ...state,
        coreLoading: false,
        error: _.replace(action.payload, /\([0-9]*\)/, '')
      }
    default:
      return state;
  }
};
