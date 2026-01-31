/*
 *   File : sagas.ts
 *   Author URI : https://evoqins.com
 *   Description : sagas
 *   Integrations : redux-saga/effects
 *   Version : v1.1
 */

import { takeEvery, put } from 'redux-saga/effects';

// Define a proper type for the action
interface Action<T = any> {
  type: string;
  payload?: T;
}

function* _user(data: Action): Generator {
  try {
    yield put({
      type: 'USER',
      payload: data.payload,
    });
  } catch (error) {
    console.log(error);
  }
}

function* _signIn(data: Action): Generator {
  try {
    yield put({
      type: 'SIGN_IN',
      payload: data.payload,
    });
  } catch (error) {
    console.log(error);
  }
}

// Generator: Watch profile
export function* watchUser(): Generator {
  yield takeEvery('USER_DATA', _user);
}

// Generator: Watch access token
export function* watchSignIn(): Generator {
  yield takeEvery('USER_TOKEN', _signIn);
}
