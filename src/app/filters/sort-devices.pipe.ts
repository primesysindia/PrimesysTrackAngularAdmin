import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortDevices'
})
export class SortDevicesPipe implements PipeTransform {

  transform(items: any, sortType: string): any {
    if(!sortType)
    {
      return items;
    }
    else{
      if(sortType == 'KeyMan'){
        return items.filter(value =>{
          value.name.indexOf()
          return value.name.startsWith('K/') == true
        })
      }
      else if(sortType == 'PatrolMan'){
        return items.filter(value =>{
          return value.name.startsWith('P/') == true
        })
      }
     
      else{
        return items;
      }
    }
  }

}
