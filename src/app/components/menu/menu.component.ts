import { Component , ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'music-menu',
  encapsulation: ViewEncapsulation.None,
  template: require('./menu.html'),
  styles:[require('./menu.scss')],
})
export class Menu {


  public menus:Array<Object> = [
    {
      name : "自建歌单",
      class : "",
      childrens : [
        {
          name : "我喜欢",
          url : "like",
          icon : "ion-ios-heart-outline menu-like",
          class : ""
        }
      ]
    }
  ];

  constructor(){


  }

}
