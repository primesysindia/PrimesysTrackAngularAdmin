import { Pipe, PipeTransform } from '@angular/core';
import { SlimLoadingBarEventType } from 'ng2-slim-loading-bar';
import { MatTreeFlatDataSource } from '@angular/material';

@Pipe({
  name: 'filterDevices'
})
export class FilterDevicesPipe implements PipeTransform {

  transform(items: any, sortType: string): any {
    if(!sortType)
    {
      return items;
    }
    else {
      if(sortType == 'On'){
        return items.filter(item => item.isConnected === true);
      }
      else if(sortType == 'Off'){
        return items.filter(item => item.isConnected === false);
      }
      else if(sortType == 'All'){
        return items;
      }  
      else if(sortType == 'Keyman'){
        return items.filter(value =>{
          value.name.indexOf()
          return value.name.startsWith('K/') == true
        })
      }
      else if(sortType == 'Patrolman'){
        return items.filter(value =>{
          value.name.indexOf()
          return value.name.startsWith('P/') == true
        })
      }

      else{
        console.log("else alll")
        return items;
      }
    }
  }
}
