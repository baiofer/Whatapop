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

    // Monto el filtro necesario en función de las diferentes opciones entre el 
    //texto y la categoria del 'filter'. filter.category puede ser undefined o 
    //0 y en ambos casos no se debe aplicar el filtro por categoria.
    let filtro: string;

    if (filter !== null) {
      console.log(filter);
      //Inicializo el filtro
      filtro = '';
      //Añado el texto si procede
      if (filter.text !== undefined) {
        filtro = filtro.concat(`q=${filter.text}`);
      }
      //Añado la categoria si procede
      if (filter.category !== undefined && +filter.category !== 0) {
        filtro = filtro.concat(`&category.id=${filter.category}`)
      }
      //Añado el estado si procede
      if (filter.state !== undefined && filter.state !== "-") {
        filtro = filtro.concat(`&state=${filter.state}`);
      }
      
      //Añado el precio si procede
      if (filter.minPrice !== undefined && filter.maxPrice !== undefined) {
        /*
        if ((+filter.minPrice > 0 || filter.minPrice === '') && (+filter.maxPrice > 0 || filter.maxPrice === '')) {
          if (filter.minPrice === '') {
            filtro = filtro.concat();
            //FILTRO    filter1.precio = {$lt:parseInt(rangoPrecio[1])};
          } else if (filter.maxPrice === '') {
            filtro = filtro.concat();
            // FILTRO   filter1.precio = {$gte:parseInt(rangoPrecio[0])};
          } else {
            filtro = filtro.concat();
            //  FILTROfilter1.precio = {$lt:parseInt(rangoPrecio[1]), $gte:parseInt(rangoPrecio[0])};
          }
        }*/
      }
    }

   


 
        
      








    // Añadimos al get los parámetros deseados para ordenar los productos (`q=${filter.text}&category.id=${filter.category}`;). Añadimos tambien el filtro deseado.
    return this._http
      .get(`${this._backendUri}/products?_sort=publishedDate&_order=DESC&${filtro}`)
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
