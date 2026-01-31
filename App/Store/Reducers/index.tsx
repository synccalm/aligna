/*
 *   File : index.tsx
 *   Author URI : https://evoqins.com
 *   Description : index file for reducer
 *   Integrations : redux
 *   Version : v1.1
 */

import { combineReducers } from 'redux';

import Reducer from './reducer';

const rootReducer = combineReducers({
  Reducer,
});

export default rootReducer;
