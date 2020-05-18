import { User } from '../user';
import { createFeatureSelector, createSelector } from '@ngrx/store';


export interface UserState { 
    maskUserName: boolean;
    currentUser: User;
}

const initialUser = {
    maskUserName: true,
    currentUser: null
};

// selectors
const getUserState = createFeatureSelector<UserState>('users');

export const userNameMaskSelector = createSelector(
    getUserState,
    state => state.maskUserName
);

// reducer
export function reducer(state = initialUser, action): UserState {

    switch (action.type) {
        case 'MASK_USER_NAME':
            return {
                ...state,
                maskUserName: action.payload
            };

        default:
            return state;
    }
}
