import { combineReducers } from 'redux';
import DataReducer from './DataReducer';
import MenuReducer from './MenuReducer';

export default combineReducers({
  data: DataReducer,
  menu: MenuReducer
});
