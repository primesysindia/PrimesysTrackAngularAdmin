/* Filter for searching device from the list */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findDevice'
})
export class FindDevicePipe implements PipeTransform {

  transform(items: any, searchText: string): any {
      if(!searchText)
      {
        return items;
      }
      else{
        return items.filter(value => { 
          return (value.name.toLowerCase().includes(searchText) || value.name.includes(searchText)) == true
        })
      }
       
   }

}
