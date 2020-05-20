import { ProductActionTypes, Load, LoadSuccess, LoadFail, UpdateProduct, UpdateProductSuccess, UpdateProductFail } from './product.actions';
import { ProductService } from './../product.service';
import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Product } from '../product';
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class ProductEffects {

    constructor(private actions$: Actions, private productService: ProductService) { }

    @Effect()
    loadProducts$: Observable<Action> = this.actions$.pipe(
        ofType(ProductActionTypes.Load),
        mergeMap((action: Load) => this.productService.getProducts().pipe(
            map((products: Product[]) => (new LoadSuccess(products))),
            catchError(err => of(new LoadFail(err)))
        ))
    );

    @Effect()
    updateProduct$: Observable<Action> = this.actions$.pipe(
        ofType(ProductActionTypes.UpdateProduct),
        map((action: UpdateProduct) => action.payload),
        mergeMap((product: Product) =>
            this.productService.updateProduct(product).pipe(
                map(updatedProduct => (new UpdateProductSuccess(updatedProduct))),
                catchError(err => of(new UpdateProductFail(err)))
            )
        )
    );
}
