import { User } from '../user';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserActionTypes, MaskUserName, UserActions } from './user.actions';


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
export function reducer(state = initialUser, action: UserActions): UserState {

    switch (action.type) {
        case UserActionTypes.MaskUserName:
            return {
                ...state,
                maskUserName: action.payload
            };

        default:
            return state;
    }
}
