import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'allLocation'
})
export class AllLocationPipe implements PipeTransform {

  

  transform(items: any, sortType: string): any {
    let userType = localStorage.getItem('userType')
    if(!sortType)
    {
      return items;
    }
    else{
      if(sortType == 'all'){
        return items
      }
      else if(sortType == 'on'){
        if(userType == 'Child')
          return items.filter(value => {
            return value.icon.includes('Green_marker') == true
          })
        else
          return items.filter(value => {
            return value.icon.includes('GreenCar') == true
          })
      }
      else if(sortType == 'off'){
        if(userType == 'Child')
          return items.filter(value => {
            return value.icon.includes('Red_marker') == true
          })
        else
          return items.filter(value => {
            return value.icon.includes('RedCar') == true
          })
      }
      else if(sortType == 'stoppage'){
        return items.filter(value =>{
          return value.icon.includes('BlueCar') == true
        })
      }
      else{
        return items;
      }
    }
  }

}
