import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userSearch'
})
export class UserSearchPipe implements PipeTransform {

  transform(items: any, searchText: string): any {
    if(!searchText)
    {
      return items;
    }
    else{
      return items.filter(value => { 
       var data = (value.userName.toLowerCase().includes(searchText) || value.userName.includes(searchText)) == true
        // console.log(data)
        return data;
      })
    }
     
 }

}
