import _ from 'lodash';

const INITIAL_STATE = {
  headerExpended: false,
  headerMode: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'Update_Menu_State':
      //console.log(action.payload);
      return { ...state,
          ...action.payload
      };
    case 'Update_Menu_Anchor':
      /*console.log('action.payload.popoverAnchor-------------------------------');
      console.log(action.payload.popoverAnchor);
      console.log('state.popoverAnchor----------------------------------------');
      console.log(state.popoverAnchor);
      console.log('same?: ', _.isEqual(action.payload.popoverAnchor, state.popoverAnchor));*/
      if (_.isEqual(action.payload.popoverAnchor, state.popoverAnchor)){
        return state;
      }

      return { ...state,
          ...action.payload
      };
    default:
      return state;
  }
};
