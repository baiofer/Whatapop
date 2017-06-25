import { Pipe, PipeTransform } from '@angular/core'
import * as moment from 'moment';
import 'moment/locale/es';

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
| Blue Path                                                        |
|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
| Crea el pipe PublicationDatePipe. Su cometido es, partiendo de   |
| una fecha dada, retornar una cadena de texto que exprese el      |
| tiempo que ha pasado desde dicha fecha hasta ahora. Por ejemplo: |
| hace 2 horas. Para esta tarea nos apoyamos en la librería        |
| Moment.js; ya tienes hecho el import correspondiente, solo       |
| tienes que usarla donde proceda. Haciendo                        |
| 'moment(fecha).fromNow()' obtenemos justo lo que necesitamos.    |
|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/* Decoramos la clase 'PublicationDatePipe' con el decorador 'Pipe' al
   que le asignamos el nombre 'PublicationDatePipe'  */
@Pipe({
    name: 'PublicationDatePipe'
})

/* Implementamos el interfaz 'PipeTransform' y realizamos el método
   'transform()' del mismo, usando la libreria moment. */
export class PublicationDatePipe implements PipeTransform {

    transform(fecha: any) {
        return moment(fecha).fromNow();
    }
}