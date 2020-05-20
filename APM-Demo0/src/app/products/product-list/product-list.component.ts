import { ToggleProductCode, ProductActionTypes, SetCurrentProduct, InitializeCurrentProduct, Load, ProductActions } from './../state/product.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { Store, select } from '@ngrx/store';

import * as fromProduct from '../state/product.reducer';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  pageTitle = 'Products';
  errorMessage: string;
  displayCode: boolean;
  products: Product[];
  componentActive = true;

  // Used to highlight the selected product in the list
  currentProduct: Product | null;
  errorMessage$: Observable<string>;

  constructor(private productService: ProductService, private store: Store<fromProduct.State>) { }

  ngOnInit(): void {

    // Before using the selector 
    // this.productService.selectedProductChanges$.subscribe(
    //   selectedProduct => this.currentProduct = selectedProduct
    // );

    // TODO: Unsubscribe
    this.store.pipe(select(fromProduct.productsSelector),
      takeWhile(() => this.componentActive))
      .subscribe(
        currentProduct => this.currentProduct = this.currentProduct
      );

    this.errorMessage$ = this.store.pipe(select(fromProduct.getError));

    this.store.dispatch(new Load());
    this.store.pipe(select(fromProduct.productsSelector)).subscribe((products: Product[]) => this.products = products);

    this.productService.getProducts().subscribe({
      next: (products: Product[]) => this.products = products,
      error: (err: any) => this.errorMessage = err.error
    });

    // TODO: Unsubscribe
    this.store.pipe(select(fromProduct.getShowProductCodeSelector)).subscribe(
      productCode => {
        this.displayCode = productCode;
      }
    );

    // Hardcoded selector example - DO NOT USE
    //
    // this.store.pipe(select('products')).subscribe(
    //   products => {
    //       this.displayCode = products.showProductCode;
    //   }
    // );
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Previous action without using the actions defined in product.actions.ts
  // We defined the actions and created a class which stores the payload for each of them for type safety
  //
  // checkChanged(value: boolean): void {
  //   this.store.dispatch({
  //     type: 'TOGGLE_PRODUCT_CODE',
  //     payload: value
  //   });
  // }

  checkChanged(value: boolean): void {
    this.store.dispatch(new ToggleProductCode(value));
  }

  newProduct(): void {
    this.store.dispatch(new InitializeCurrentProduct());
  }

  // newProduct(): void {
  //   this.productService.changeSelectedProduct(this.productService.newProduct());
  // }

  productSelected(product: Product): void {
    this.store.dispatch(new SetCurrentProduct(product));

    // before dispatching this was the 'classic' way of keeping an eye on the selected product
    // this.productService.changeSelectedProduct(product);
  }
}
