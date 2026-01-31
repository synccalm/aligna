/*
 *   File : reducer.ts
 *   Author URI : https://evoqins.com
 *   Description : reducers
 *   Integrations : null
 *   Version : v1.1
 */

// State type
interface State {
  USER_DATA: Record<string, unknown>;
  ACCESS_TOKEN: string;
}

// Action type
interface Action {
  type: 'USER' | 'SIGN_IN';
  payload: any; // you can refine this if you know the exact payload shape
}

// Initial state
const initialState: State = {
  USER_DATA: {},
  ACCESS_TOKEN: '',
};

// Reducer
const Reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'USER': {
      return {
        ...state,
        USER_DATA: action.payload,
      };
    }
    case 'SIGN_IN': {
      return {
        ...state,
        ACCESS_TOKEN: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default Reducer;
