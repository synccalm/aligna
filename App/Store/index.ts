import { createStore, applyMiddleware } from 'redux';
const createSagaMiddleware = require('redux-saga').default;

import rootReducer from './Reducers/index';
import { rootSaga } from './Sagas/index';

// Middleware: Redux Saga
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

// Redux: Store
const Store = createStore(rootReducer, applyMiddleware(...middlewares));

// Run Saga
sagaMiddleware.run(rootSaga);

// Export
export { Store };
