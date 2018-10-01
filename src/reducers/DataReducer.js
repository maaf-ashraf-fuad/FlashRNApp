import _ from 'lodash';
import NavigationService from '../navigation/NavigationService.js';
import { AsyncStorage, Alert } from 'react-native';
import { BarCodeScanner } from 'expo';
import { Type } from '../component/DataPage/types';

const INITIAL_STATE = {
  parent: undefined,
  parentDetails: undefined,
  child: undefined,
  childDetails: {
    childPage: 0,
    slicedChild: undefined
  },
  parent_type: undefined,
  child_type: undefined,
  searchType: 'Frame',
  searchText: '',//'PUJ_ODF001',
  localImage: undefined,
  error: '',
  loading: false,
  coreLoading: false,
  headerExpended: false,
  headerMode: null,
  toCore: {
    from_pair_id: '',
    to_pair_id: '',
    frame_name: '',
    cable_name: '',
    cable_core_no: '',
  },
  toCoreDetails: {
    frame_name: '',
    cable_name: '',
    cable_core_no: '',
  },
  editCore: {
    ne_id: '',
    ne_shelf: '',
    ne_slot: '',
    ne_port: '',
    cct_name: '',
    to_ne_id: '',
    to_ne_shelf: '',
    to_ne_slot: '',
    to_ne_port: '',
    to_cct_name: '',
    status: ''
  },
  user: { staff_name: undefined, staff_user: undefined, staff_pass: undefined },
  qrType: [ BarCodeScanner.Constants.BarCodeType.qr ],
  qrFlash: 'off',
  hasCameraPermission: false,
  showCopyModal: false
};

isArray = (a) => (!!a) && (a.constructor === Array);

navigationHelper = ({ action, next, back }) => {
  switch (action.type) {
    case 'navigate':
      return NavigationService.navigate(action.routeName, { next, back });
    case 'push':
      return NavigationService.push(action.routeName, { next, back });
    case 'replace':
      return NavigationService.replace(action.routeName, { next, back });
    /*case 'back':
      return NavigationService.back();*/
    default:
      return null;
  }
};

export default (state = INITIAL_STATE, action) => {
  let parent = '';
  let child = '';
  //console.log('reducer type: ', action.type);
  switch (action.type) {
    case 'Navigate_To_Login':
      NavigationService.replace('Login', {});
      return {
        ...state,
        loading: false,
        error: ''
      };
    case 'Login_Success':
      NavigationService.replace('Menu', {});
      return {
        ...state,
        loading: false,
        error: '',
        user: { ...action.payload }
      };
    case 'Login_Failed':
      return { ...state, loading: false, error: _.replace(action.payload, /\([0-9]*\)/, '') };
    case 'Logout':
      AsyncStorage.clear();
      NavigationService.replace('Login', {});
      return { ...state, ...INITIAL_STATE};
    case 'Fetching_Data':
      return { ...state, loading: true, error: '', headerExpended: false, headerMode: null };
    case 'QR_Fetching_Data':
      return { ...state, loading: true, error: '', qrType: []};
    case 'Updating_Core':
      //return { ...state, loading: true, error: '', headerExpended: false, headerMode: null };
      return { ...state, coreLoading: true };
    case 'Reset_Data':
      //this.navigationHelper(action.nav);
      return { ...state, ...INITIAL_STATE, user: { ...state.user }};
    case 'Update_Menu_State':
      return { ...state, error: '', ...action.payload };
    case 'QR_Fetch_Failed':
      return { ...state,
          loading: false,
          searchType: 'Frame',
          error: _.replace(action.payload, /\([0-9]*\)/, '')
    };
    case 'Frame_Fetch_Failed':
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
    case 'Cable_Fetch_Failed':
      return { ...state,
        loading: false,
        searchType: 'Cable_Id',
        error: _.replace(action.payload, /\([0-9]*\)/, '')
      };
    case 'Frame_Fetch_Success':
      //parent = _.mapValues(_.mapKeys(_.omitBy(action.payload, (val, key) => key === 'LIST_FRAME_UNIT' || key === 'ErrorCode' || key === 'ErrorMessage' || key === 'TMSOA_Status' || key === 'xmlns' || key === 'xmlns:env' || key === 'xmlns:ns2' || key === 'xmlns:wsa'), (val, key) => key.toLowerCase()), (val) => val==='Null'?null:val);
      parent = _.reduce(action.payload, (details, i, j) => {
                        if (!Type.excludeFromResponse.includes(j)) {
                          details[j.toLowerCase()] = i === 'Null'?null:i;
                        }
                        return details;
                      }, {});
      child = this.isArray(action.payload.LIST_FRAME_UNIT)?action.payload.LIST_FRAME_UNIT:[action.payload.LIST_FRAME_UNIT];
      this.navigationHelper(action.nav);
      return { ...state,
          //parent: _.mapValues(_.mapKeys(_.omitBy(action.payload, (val, key) => key === 'LIST_FRAME_UNIT' || key === 'ErrorCode' || key === 'ErrorMessage' || key === 'TMSOA_Status' || key === 'xmlns' || key === 'xmlns:env' || key === 'xmlns:ns2' || key === 'xmlns:wsa'), (val, key) => key.toLowerCase()), (val) => val==='Null'?null:val),
          //child: _.map(Object.values(_.pick(action.payload, ['LIST_FRAME_UNIT']))[0], (val) => _.mapValues(val, (val) => val==='Null'?null:val)),
          parent,
          child,
          /*parentDetails: _.reduce(parent, (details, i, j) => {
                            if (!Type.excludeFromDetails.includes(j)) {
                              details.push({[j]:i});
                            }
                            return details;
                          }, []),*/
          parentDetails: _.reduce(parent, (details, i, j) => {
                            if (!Type.excludeFromDetails.includes(j)) {
                              details.push({ 'name': j, 'value': i, 'key': details.length.toString() });
                            }
                            return details;
                          }, []),
          parent_type: 'Frame',
          child_type: 'Shelf',
          loading: false,
          error: '',
          lastIndex: 0,
      };

    case 'Shelf_Fetch_Success':
      parent = _.reduce(action.payload, (details, i, j) => {
                      if (!Type.excludeFromResponse.includes(j)) {
                        details[j.toLowerCase()] = i==='Null'?null:i;
                      }
                      return details;
                    }, {});
      //child = this.isArray(action.payload.FU_Detail)?action.payload.FU_Detail:[action.payload.FU_Detail];
      if (this.isArray(action.payload.FU_Detail)){
        child = _.map(action.payload.FU_Detail, ( i, j )=> {
          i.key = j.toString();
          return i;
        });
      } else {
        child = [action.payload.FU_Detail];
        child.key = '0';
      }

      this.navigationHelper(action.nav);
      return { ...state,
        parent,
        child,
        /*parentDetails: _.reduce(parent, (details, i, j) => {
                          if (!Type.excludeFromDetails.includes(j)) {
                            details.push({[j]:i});
                          }
                          return details;
                        }, []),*/
        parentDetails: _.reduce(parent, (details, i, j) => {
                          if (!Type.excludeFromDetails.includes(j)) {
                            details.push({ 'name': j, 'value': i, 'key': details.length.toString() });
                          }
                          return details;
                        }, []),
        parent_type: 'Shelf',
        child_type: 'Core',
        loading: false,
        error: '',
        lastIndex: action.nav.next.lastIndex,
      };
    case 'Core_Fetch_Success':
      this.navigationHelper(action.nav);
      parent = _.mapValues(action.payload, (val) => val==='Null'?null:val);
      return { ...state,
        parent,
        child: undefined,
        /*parentDetails: _.reduce(parent, (details, i, j) => {
                          if (!Type.excludeFromDetails.includes(j)) {
                            details.push({[j]:i});
                          }
                          return details;
                        }, []),*/
        parentDetails: _.reduce(parent, (details, i, j) => {
                          if (!Type.excludeFromDetails.includes(j) && j !== 'key') {
                            details.push({ 'name': j, 'value': i, 'key': details.length.toString() });
                          }
                          return details;
                        }, []),
        parent_type: 'Core',
        child_type: undefined,
        loading: false,
        error: '',
        editCore: {
          frame_unit_id: parent.frame_unit_id,
          pair_id: parent.pair_id,
          ne_id: parent.ne_id,
          ne_shelf: parent.ne_shelf,
          ne_slot: parent.ne_slot,
          ne_port: parent.ne_port,
          cct_name: parent.cct_name,
          to_ne_id: parent.to_ne_id,
          to_ne_shelf: parent.to_ne_shelf,
          to_ne_slot: parent.to_ne_slot,
          to_ne_port: parent.to_ne_port,
          to_cct_name: parent.to_cct_name,
          status: parent.Cable_core_status
        },
        toCore: {
          ...INITIAL_STATE.toCore,
          from_pair_id: parent.pair_id,
          //cable_core_id: parent.Cable_core_id
        },
        lastIndex: 0,
      }
    case 'Core_Refresh_Success':
      parent = _.mapValues(action.payload, (val) => val==='Null'?null:val);
      return { ...state,
        parent,
        child: undefined,
        /*parentDetails: _.reduce(parent, (details, i, j) => {
                          if (!Type.excludeFromDetails.includes(j)) {
                            details.push({[j]:i});
                          }
                          return details;
                        }, []),*/
        parentDetails: _.reduce(parent, (details, i, j) => {
                          if (!Type.excludeFromDetails.includes(j) && j !== 'key') {
                            details.push({ 'name': j, 'value': i, 'key': details.length.toString() });
                          }
                          return details;
                        }, []),
        parent_type: 'Core',
        child_type: undefined,
        loading: false,
        error: '',
        editCore: {
          frame_unit_id: parent.frame_unit_id,
          pair_id: parent.pair_id,
          ne_id: parent.ne_id,
          ne_shelf: parent.ne_shelf,
          ne_slot: parent.ne_slot,
          ne_port: parent.ne_port,
          cct_name: parent.cct_name,
          to_ne_id: parent.to_ne_id,
          to_ne_shelf: parent.to_ne_shelf,
          to_ne_slot: parent.to_ne_slot,
          to_ne_port: parent.to_ne_port,
          to_cct_name: parent.to_cct_name,
          status: parent.Cable_core_status
        },
        toCore: {
          ...INITIAL_STATE.toCore,
          from_pair_id: parent.pair_id
        },
        lastIndex: 0,
      }
    case 'NE_Fetch_Success':
      if (this.isArray(action.payload.FU_Detail)){
        child = _.map(action.payload.FU_Detail, ( i, j )=> {
          i.key = j.toString();
          return i;
        });
      } else {
        child = [action.payload.FU_Detail];
        child.key = '0';
      }
      this.navigationHelper(action.nav);
      return { ...state,
          parent: undefined,
          //child: _.map(Object.values(_.pick(action.payload, ['FU_Detail']))[0], (val) => _.mapValues(val, (val) => val==='Null'?null:val)),
          child,
          parentDetails: undefined,
          parent_type: 'NE',
          child_type: 'Core',
          loading: false,
          error: '',
          lastIndex: action.nav.next.lastIndex,
      };
    case 'Cable_Fetch_Success':
      if (this.isArray(action.payload.FU_Detail)){
        child = _.map(action.payload.FU_Detail, ( i, j )=> {
          i.key = j.toString();
          return i;
        });
      } else {
        child = [action.payload.FU_Detail];
        child.key = '0';
      }
      this.navigationHelper(action.nav);
      return { ...state,
          parent: undefined,
          //child: _.map(Object.values(_.pick(action.payload, ['FU_Detail']))[0], (val) => _.mapValues(val, (val) => val==='Null'?null:val)),
          child,
          parentDetails: undefined,
          parent_type: 'Cable_Id',
          child_type: 'Core',
          loading: false,
          error: '',
          lastIndex: action.nav.next.lastIndex,
      };
    case 'Core_Set_Values':
      return { ...state,
        loading: false,
        error: '',
        editCore: {...state.editCore,
          [action.payload.prop]: action.payload.value
      }};
    case 'Transfer_Core_Set_Values':
      return { ...state,
        loading: false,
        error: '',
        toCore: {...state.toCore,
          [action.payload.prop]: action.payload.value
        }};
    case 'User_Set_Values':
      return { ...state,
        loading: false,
        error: '',
        user: {...state.user,
          [action.payload.prop]: action.payload.value
        }};
    case 'Core_Reset_Value':
      return { ...state,
      editCore: {
        ne_id: state.parent.ne_id,
        ne_shelf: state.parent.ne_shelf,
        ne_slot: state.parent.ne_slot,
        ne_port: state.parent.ne_port,
        cct_name: state.parent.cct_name,
        to_ne_id: state.parent.to_ne_id,
        to_ne_shelf: state.parent.to_ne_shelf,
        to_ne_slot: state.parent.to_ne_slot,
        to_ne_port: state.parent.to_ne_port,
        to_cct_name: state.parent.to_cct_name,
        status: state.parent.status
      }};
    case 'Frame_Update_QR_Success':
      NavigationService.pop();
      Alert.alert('Flash 2.0', 'Frame QR Code successfully updated!');
      return { ...state,
        parent: {
          ...state.parent,
          qr_code_id: action.payload
        },
        loading: false,
        error: ''
      };
    case 'Frame_Update_QR_Failed':
      return { ...state,
        loading: false,
        error: _.replace(action.payload, /\([0-9]*\)/, ''),
      };
    case 'Shelf_Update_QR_Success':
      NavigationService.pop();
      Alert.alert('Flash 2.0', 'Shelf QR Code successfully updated!');
      return { ...state,
        parent: {
          ...state.parent,
          qr_code_id: action.payload
        },
        loading: false,
        error: ''
      };
    case 'Shelf_Update_QR_Failed':
      return { ...state,
        loading: false,
        error: _.replace(action.payload, /\([0-9]*\)/, ''),
      };
    case 'Core_Update_QR_Success':
      NavigationService.pop();
      Alert.alert('Flash 2.0', 'Core QR Code successfully updated!');
      return { ...state,
        parent: {
          ...state.parent,
          qr_code_id: action.payload
        },
        loading: false,
        error: ''
      };
    case 'Core_Update_QR_Failed':
      return { ...state,
        loading: false,
        error: _.replace(action.payload, /\([0-9]*\)/, '')
      };
    case 'Core_Update_Details_Success':
      Alert.alert('Flash 2.0', 'Core details successfully updated!');
      return { ...state,
        parent: { ...state.parent, ...action.payload
        },
        coreLoading: false,
        headerExpended: false,
        headerMode: null,
        error: ''
      }
    case 'Core_Update_Details_Failed':
      Alert.alert('Flash 2.0', _.replace(action.payload, /\([0-9]*\)/, ''));
      return { ...state,
        coreLoading: false,
        error: _.replace(action.payload, /\([0-9]*\)/, '')
      }
    case 'Transfer_Core_Success':
      Alert.alert('Flash 2.0', 'Core successfully trasferred!');
      return { ...state,
        coreLoading: false,
        headerExpended: false,
        headerMode: null,
        toCore: {
          ...INITIAL_STATE.toCore,
          from_pair_id: state.parent.pair_id
        },
        toCoreDetails: INITIAL_STATE.toCoreDetails,
        error: ''
      }
    case 'Core_Refresh_Failed':
      //NavigationService.pop();
      Alert.alert('Flash 2.0', _.replace(action.payload, /\([0-9]*\)/, ''));
      return { ...state,
        coreLoading: false,
        loading: false,
        toCore: { ...INITIAL_STATE.toCore, from_pair_id: state.parent.pair_id},
        toCoreDetails: INITIAL_STATE.toCoreDetails,
        error: _.replace(action.payload, /\([0-9]*\)/, '')
      }
    case 'Transfer_Core_Failed':
      //NavigationService.pop();
      Alert.alert('Flash 2.0', _.replace(action.payload, /\([0-9]*\)/, ''));
      return { ...state,
        coreLoading: false,
        loading: false,
        toCore: { ...INITIAL_STATE.toCore, from_pair_id: state.parent.pair_id},
        toCoreDetails: INITIAL_STATE.toCoreDetails,
        error: _.replace(action.payload, /\([0-9]*\)/, '')
      }
    case 'Transfer_Core_Reset_Value':
      return { ...state,
        coreLoading: false,
        toCore: { ...INITIAL_STATE.toCore, from_pair_id: state.parent.pair_id},
        toCoreDetails: INITIAL_STATE.toCoreDetails,
        error: ''
      }
    case 'Transfer_Core_Fetch_Shelf_Success':
      parent = !this.isArray(action.payload.FU_Detail)?{[action.payload.FU_Detail.Cable_name]:[action.payload.FU_Detail.Cable_core_no]}:
                _.reduce(action.payload.FU_Detail, (details, i) => {
                  if (i.Cable_name!==null||i.Cable_name!=='Null') {
                    if ((i.Cable_core_no!==null||i.Cable_core_no!=='Null')&&(i.Cable_core_status.toLowerCase()==='free'||i.Cable_core_status.toLowerCase()==='spare')) {
                      if (details[i.Cable_name]===undefined){
                        details[i.Cable_name] = [];
                      }
                      details[i.Cable_name].push(i.Cable_core_no);
                    }
                  }
                  return details;
                }, {});
      child = !this.isArray(action.payload.FU_Detail)?[action.payload.FU_Detail.Cable_name]:
                _.map(parent, (i, j) => j);
      NavigationService.pop();
      return { ...state,
        coreLoading: false,
        loading: false,
        error: '',
        toCore: {
          ...state.toCore,
          frame_name: action.payload.FRAME_NAME,
          cable_name: _.head(child),
          cable_core_no: _.head(parent[_.head(child)]),
        },
        toCoreDetails: {
          frame_name: action.payload.FRAME_NAME,
          cable_name: child,
          cable_core_no: parent
          /*cable_core_no: !this.isArray(action.payload.FU_Detail)?[action.payload.FU_Detail.Cable_core_no]:_.reduce(action.payload.FU_Detail, (details, i) => {
                          if (i.Cable_core_no!==null||i.Cable_core_no!=='Null') {
                            !details.includes(i.Cable_core_no)&&details.push(i.Cable_core_no);
                          }
                            return details;
                        }, []),*/
        }
      }
    case 'Transfer_Core_Fetch_Shelf_Failed':
      //NavigationService.pop();
      return { ...state,
        coreLoading: false,
        loading: false,
        toCore: INITIAL_STATE.toCore,
        toCoreDetails: INITIAL_STATE.toCoreDetails,
        error: _.replace(action.payload, /\([0-9]*\)/, '')
      }
    case 'Camera_Permission_Granted':
      return { ...state,
        hasCameraPermission: true,
        error: '',
        loading: false,
        qrType: INITIAL_STATE.qrType
      }
    case 'Camera_Permission_Denied':
      return { ...state,
        hasCameraPermission: false,
        loading: false,
        error: _.replace(action.payload, /\([0-9]*\)/, ''),
        qrType: []
      }
    default:
      return state;
  }
};
