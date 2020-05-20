import { Product } from './../product';
import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductActions, ToggleProductCode, ProductActionTypes } from './product.actions';

// application DTO's or states
export interface State extends fromRoot.State {
    products: ProductState;
}

export interface ProductState {
    showProductCode: boolean;
    currentProductId: number | null;
    products: Product[];
    error: string;
}

const initialState: ProductState = {
    showProductCode: true,
    currentProductId: null,
    products: [],
    error: ''
};

// selectors
const getProductsFeatureState = createFeatureSelector<ProductState>('products');

// error selector
export const getError = createSelector(
    getProductsFeatureState,
    state => state.error
);

export const getCurrentProductId = createSelector(
    getProductsFeatureState,
    state => state.currentProductId
);

// currentProduct selector
export const getCurrentProductSelector = createSelector(
    getProductsFeatureState,
    getCurrentProductId,
    (state, currentProductId) => {
        if (currentProductId === 0) {
            return {
                id: 0,
                productName: '',
                productCode: 'New',
                description: '',
                starRating: 0
            };
        } else {
            return currentProductId ? state.products.find(p => p.id === currentProductId) : null;
        }
    }
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
export function reducer(state = initialState, action: ProductActions): ProductState {
    switch (action.type) {
        case ProductActionTypes.ToggleProductCode:
            return {
                ...state,
                showProductCode: action.payload
            };

        case ProductActionTypes.SetCurrentProduct:
            return {
                ...state,
                currentProductId: action.payload.id
            };

        case ProductActionTypes.ClearCurrentProduct:
            return {
                ...state,
                currentProductId: null
            };

        case ProductActionTypes.InitializeCurrentProduct:
            return {
                ...state,
                currentProductId: 0
            };

        case ProductActionTypes.LoadSuccess:
            return {
                ...state,
                products: action.payload,
                error: ''
            };

        case ProductActionTypes.LoadFail:
            return {
                ...state,
                products: [],
                error: action.payload
            };

        case ProductActionTypes.UpdateProductSuccess:
            const updatedProducts = state.products.map(
                item => action.payload.id === item.id ? action.payload : item);
            return {
                ...state,
                products: updatedProducts,
                currentProductId: action.payload.id,
                error: ''
            };

        default:
            return state;
    }
}
