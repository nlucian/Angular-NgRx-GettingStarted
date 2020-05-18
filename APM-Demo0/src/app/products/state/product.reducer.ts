import { Product } from './../product';
import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

// application DTO's or states
export interface State extends fromRoot.State {
    products: ProductState;
}

export interface ProductState {
    showProductCode: boolean;
    currentProduct: Product;
    products: Product[];
}

const initialState: ProductState = {
    showProductCode: true,
    currentProduct: null,
    products: []
};

// selectors
const getProductsFeatureState = createFeatureSelector<ProductState>('products');

// currentProduct selector
export const getCurrentProductSelector = createSelector(
    getProductsFeatureState,
    state => state.showProductCode
);

// productsArray selector selector
export const productsSelector = createSelector(
    getProductsFeatureState,
    state => state.products
);

// productCode Selector
export const getShowProductCodeSelector = createSelector(
    getProductsFeatureState,    // selector required to retrieve the desired bit of state - feature selector function
    state => state.showProductCode // projector function - gets the result of the selector function
);

// reducer
export function reducer(state = initialState, action): ProductState {
    switch (action.type) {

        case 'TOGGLE_PRODUCT_CODE':
            console.log('existing state ', JSON.stringify(state));
            console.log('action ', action.payload);
            return {
                ...state,
                showProductCode: action.payload
            };

        default:
            return state;
    }
}
