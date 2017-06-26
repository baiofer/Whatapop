import { Component, OnInit, Input } from '@angular/core';

import { ConfirmationService } from 'primeng/primeng';

import { Product } from '../product'

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.css']
})
export class LikeComponent implements OnInit {

  @Input() producto: Product;

  favPulsado: boolean;

  constructor(
    private _confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    if (this.producto) {
      if (localStorage.getItem(this.producto.id.toString())) {
        this.favPulsado = false;
      } else {
        this.favPulsado = true;
      }
    } else {
      this.favPulsado = true;
    }
  }

  pulsado(this) {
    if (typeof(Storage) !== "undefined") {
      const favorito = localStorage.getItem(this.producto.id);
      if (favorito !== "favorito") {
        this.favPulsado = false;
        localStorage.setItem(this.producto.id, "favorito");
      } else {
        this.favPulsado = true;
        localStorage.removeItem(this.producto.id);
      }
    } else {
      //No se permite el webStorage
      this._confirmationService.confirm({
        message: `No se pueden manejar favoritos. Esta versión de navegador no soporta WebStorage`,
        accept: () => {}
      });
    }
  }
}
