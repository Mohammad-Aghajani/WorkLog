import { combineReducers } from 'redux';
import { HomeReducer } from './home_reducer';


const rootReducer = combineReducers({
  records: HomeReducer,
});

export default rootReducer;
