import _ from 'lodash';

const INITIAL_STATE = {
  parent: undefined,
  child: undefined,
  parent_type: undefined,
  child_type: undefined,
  error: '',
  loading: null
};

export default (state = INITIAL_STATE, action) => {
  //let parent = '';
  //let child = '';

  switch (action.type) {
    case 'Frame_Fetch_Success':
      //state.parent = _.omitBy(action.payload, (val, key) => key === 'LIST_FRAME_UNIT' || key === 'ErrorCode' || key === 'ErrorMessage' || key === 'TMSOA_Status' || key === 'xmlns' || key === 'xmlns:env' || key === 'xmlns:ns2' || key === 'xmlns:wsa');
      //state.child = _.mapKeys(_.pick(action.payload, ['LIST_FRAME_UNIT']), (val, key) => key.replace('',''));
      //state.child = Object.values(_.pick(action.payload, ['LIST_FRAME_UNIT']))[0];
      //console.log (action.payload);

      //parent = _.mapKeys(_.omitBy(action.payload, (val, key) => key === 'LIST_FRAME_UNIT' || key === 'ErrorCode' || key === 'ErrorMessage' || key === 'TMSOA_Status' || key === 'xmlns' || key === 'xmlns:env' || key === 'xmlns:ns2' || key === 'xmlns:wsa'), (val, key) => key.replace('','').toLowerCase());
      //parent = _.omitBy(action.payload, (val, key) => key === 'LIST_FRAME_UNIT' || key === 'ErrorCode' || key === 'ErrorMessage' || key === 'TMSOA_Status' || key === 'xmlns' || key === 'xmlns:env' || key === 'xmlns:ns2' || key === 'xmlns:wsa');
      //parent.type = 'Frame';
      //child = _.map(Object.values(_.pick(action.payload, ['LIST_FRAME_UNIT']))[0], (val) => _.mapKeys(val, (val, key) => key.replace('','')));
      //child = Object.values(_.pick(action.payload, ['LIST_FRAME_UNIT']))[0];
      console.log (action.payload);
      return { ...state,
          parent: _.mapKeys(_.omitBy(action.payload, (val, key) => key === 'LIST_FRAME_UNIT' || key === 'ErrorCode' || key === 'ErrorMessage' || key === 'TMSOA_Status' || key === 'xmlns' || key === 'xmlns:env' || key === 'xmlns:ns2' || key === 'xmlns:wsa'), (val, key) => key.replace('','').toLowerCase()),
          child: Object.values(_.pick(action.payload, ['LIST_FRAME_UNIT']))[0],
          parent_type: 'Frame',
          child_type: 'Shelf'
      };
      case 'Shelf_Fetch_Success':
        //state.parent = _.omitBy(action.payload, (val, key) => key === 'LIST_FRAME_UNIT' || key === 'ErrorCode' || key === 'ErrorMessage' || key === 'TMSOA_Status' || key === 'xmlns' || key === 'xmlns:env' || key === 'xmlns:ns2' || key === 'xmlns:wsa');
        //state.child = _.mapKeys(_.pick(action.payload, ['LIST_FRAME_UNIT']), (val, key) => key.replace('',''));
        //state.child = Object.values(_.pick(action.payload, ['LIST_FRAME_UNIT']))[0];
        //console.log (action.payload);

        //parent = _.mapKeys(_.omitBy(action.payload, (val, key) => key === 'FU_Detail' || key === 'ErrorCode' || key === 'ErrorMessage' || key === 'TMSOA_Status' || key === 'xmlns' || key === 'xmlns:env' || key === 'xmlns:ns2' || key === 'xmlns:wsa'), (val, key) => key.replace('','').toLowerCase());
        //parent = _.omitBy(action.payload, (val, key) => key === 'LIST_FRAME_UNIT' || key === 'ErrorCode' || key === 'ErrorMessage' || key === 'TMSOA_Status' || key === 'xmlns' || key === 'xmlns:env' || key === 'xmlns:ns2' || key === 'xmlns:wsa');
        //parent.type = 'Shelf';
        //child = _.map(Object.values(_.pick(action.payload, ['LIST_FRAME_UNIT']))[0], (val) => _.mapKeys(val, (val, key) => key.replace('','')));
        //child = Object.values(_.pick(action.payload, ['FU_Detail']))[0];
        //console.log (action.payload);
        return { ...state,
            parent: _.mapKeys(_.omitBy(action.payload, (val, key) => key === 'FU_Detail' || key === 'ErrorCode' || key === 'ErrorMessage' || key === 'TMSOA_Status' || key === 'xmlns' || key === 'xmlns:env' || key === 'xmlns:ns2' || key === 'xmlns:wsa'), (val, key) => key.replace('','').toLowerCase()),
            child: Object.values(_.pick(action.payload, ['FU_Detail']))[0],
            parent_type: 'Shelf',
            child_type: 'Core'
        };
    default:
      return state;
  }
};
