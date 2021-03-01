import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchDevice'
})
export class SearchDevicePipe implements PipeTransform {

  transform(items: any, searchText: string): any {
    if(!searchText)
    {
      return items;
    }
    else{
      return items.filter(value => { 
        return (value.Name.toLowerCase().includes(searchText) || value.Name.includes(searchText)) == true
      })
    }
     
 }

}
