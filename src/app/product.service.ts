import { Inject, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BackendUri } from './app-settings';
import { Product } from './product';
import { ProductFilter } from './product-filter';

@Injectable()
export class ProductService {

  constructor(
    private _http: Http,
    @Inject(BackendUri) private _backendUri) { }

  getProducts(filter: ProductFilter): Observable<Product[]> {

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
    | Pink Path                                                        |
    |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
    | Pide al servidor que te retorne los productos ordenados de más   |
    | reciente a menos, teniendo en cuenta su fecha de publicación.    |
    |                                                                  |
    | En la documentación de 'JSON Server' tienes detallado cómo hacer |
    | la ordenación de los datos en tus peticiones, pero te ayudo      |
    | igualmente. La querystring debe tener estos parámetros:          |
    |                                                                  |
    |   _sort=publishedDate&_order=DESC                                |
    |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
    | Red Path                                                         |
    |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
    | Pide al servidor que te retorne los productos filtrados por      |
    | texto y/ por categoría.                                          |
    |                                                                  |
    | En la documentación de 'JSON Server' tienes detallado cómo       |
    | filtrar datos en tus peticiones, pero te ayudo igualmente. La    |
    | querystring debe tener estos parámetros:                         |
    |                                                                  |
    |   - Búsqueda por texto:                                          |
    |       q=x (siendo x el texto)                                    |
    |   - Búsqueda por categoría:                                      |
    |       category.id=x (siendo x el identificador de la categoría)  |
    |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
    | Yellow Path                                                      |
    |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
    | Pide al servidor que te retorne los productos filtrados por      |
    | estado.                                                          |
    |                                                                  |
    | En la documentación de 'JSON Server' tienes detallado cómo       |
    | filtrar datos en tus peticiones, pero te ayudo igualmente. La    |
    | querystring debe tener estos parámetros:                         |
    |                                                                  |
    |   - Búsqueda por estado:                                         |
    |       state=x (siendo x el estado)                               |
    |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    /* Añado los filtros deseados. Por defecto, para los filtros por precio, se ordena por precio del producto y para los demás filtros, por fecha de publicación. Si se he seleccionado una ordenación, se usa la ordenación seleccionada */
    let filtro: string;
    let orden: string;
  
    if (filter !== null) {
      //Inicializo el filtro y la ordenación
      filtro = "";
      orden = "";
      //Si hay un texto introducido, añado el texto al filtro.
      if (filter.text !== undefined) {
        filtro = filtro.concat(`q=${filter.text}`);
        orden = (`_sort=publishedDate&_order=DESC`);
      }
      //Si hay una categoria seleccionada, añado la categoria al filtro
      if (filter.category !== undefined && +filter.category !== 0) {
        filtro = filtro.concat(`&category.id=${filter.category}`)
        orden = (`_sort=publishedDate&_order=DESC`);
      }
      //Si hay un estado seleccionado, añado el estado al filtro
      if (filter.state !== undefined && filter.state !== "-") {
        //Si el estado es favoritos, añado los favoritos al filtro
        if (filter.state === "fav") {
          for( let key in localStorage) {
            filtro = filtro.concat(`&id=${key}`);
          }
          orden = (`_sort=publishedDate&_order=DESC`);
        //Si no es favoritos, añado el estado seleccionado
        } else {
          filtro = filtro.concat(`&state=${filter.state}`);
          orden = (`_sort=publishedDate&_order=DESC`);
        }
      }
      //Si hay un rango de precios seleccionado, añado el rango al filtro
      if ((filter.minPrice !== undefined && filter.minPrice !== "") || (filter.maxPrice !== undefined && filter.maxPrice !== "")) {
        if ((+filter.minPrice > 0 || filter.minPrice === undefined || filter.minPrice === "") && (+filter.maxPrice > 0 || filter.maxPrice === undefined || filter.maxPrice === "")) {
          if (filter.minPrice === '' || filter.minPrice === undefined) {
            // Filtro menor que máximo
            filtro = filtro.concat(`&price_lte=${filter.maxPrice}`);
            orden = (`_sort=price&_order=ASC`);
          } else if (filter.maxPrice === '' || filter.maxPrice === undefined) {
            // Filtro mayor que mínimo
            filtro = filtro.concat(`&price_gte=${filter.minPrice}`);
            orden = (`_sort=price&_order=ASC`);
          } else {
            // Filtro entre mínimo y máximo
            filtro = filtro.concat(`&price_gte=${filter.minPrice}&price_lte=${filter.maxPrice}`);
            orden = (`_sort=price&_order=ASC`);
          }
        }
      }
      //Si hay un usuario seleccionado, añado el usuario al filtro
      if (filter.user !== undefined && +filter.user !== 0) {
        filtro = filtro.concat(`&seller.id=${filter.user}`)
        orden = (`_sort=publishedDate&_order=DESC`);
      }
      
      /*Si hay ordenación seleccionada, añado la ordenación. Por defecto dejo las añadidas en los filtros, si hay alguna ordenación definida, la pongo en sustitución de la de defecto. */
      if (filter.orden !== undefined || filter.orden !== "") {
        switch (filter.orden) {
          case "precio" :
            orden =(`_sort=price&_order=ASC`);
            break;
          case "publicacion" :
            orden = (`_sort=publishedDate&_order=DESC`);
            break;
          case "alfa" :
            orden = (`_sort=name&_order=ASC`);
            break;
        }
      }
    }
    // Añadimos al get los parámetros deseados para ordenar los productos "filtro" y "orden".
    return this._http
      .get(`${this._backendUri}/products?${orden}&${filtro}`)
      .map((data: Response): Product[] => Product.fromJsonToList(data.json()));
  }

  getProduct(productId: number): Observable<Product> {
    return this._http
      .get(`${this._backendUri}/products/${productId}`)
      .map((data: Response): Product => Product.fromJson(data.json()));
  }

  // Recojo la lista de productos vendidos para resetearla
  getSoldProducts(filter: ProductFilter): Observable<Product[]> {
    return this._http
      .get(`${this._backendUri}/products?state=${filter.state}`)
      .map((data: Response): Product[] => Product.fromJsonToList(data.json()));
  }

  buyProduct(productId: number): Observable<Product> {
    const body: any = { 'state': 'sold' };
    return this._http
      .patch(`${this._backendUri}/products/${productId}`, body)
      .map((data: Response): Product => Product.fromJson(data.json()));
  }

  setProductAvailable(productId: number): Observable<Product> {
    const body: any = { 'state': 'selling' };
    return this._http
      .patch(`${this._backendUri}/products/${productId}`, body)
      .map((data: Response): Product => Product.fromJson(data.json()));
  }

}
