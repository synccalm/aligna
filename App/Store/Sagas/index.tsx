import { all, fork } from 'redux-saga/effects';
import { watchSignIn, watchUser } from './sagas';

// combining all sagas to rootSaga
export function* rootSaga(): Generator {
  yield all([fork(watchUser), fork(watchSignIn)]);
}
