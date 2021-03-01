import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceUnderscore'
})
export class ReplaceUnderscorePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value? value.replace(/_/g, " ") : value;
  }

}
