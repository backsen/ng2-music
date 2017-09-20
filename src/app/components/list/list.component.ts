import { Component , ViewEncapsulation , Input ,Output , EventEmitter} from '@angular/core';

import { ListService } from './list.service';

@Component({
  selector: 'music-list',
  // encapsulation: ViewEncapsulation.None,
  template: require('./list.html'),
  styles:[require('./list.scss')],
  providers : [ListService]
})
export class List {

  public titles:Array<Object> = [];

  @Input() public rows:Array<Object> = [];
  @Input() public btns:Array<Object> = [];

  @Output() btnClick = new EventEmitter<any>();

  constructor(
    public service : ListService
  ){

    this.service.getTableTitle().then(
      res => {
        this.titles = res;
      }
    )

  }

  public getData(row , item){
    let tdData = item['code'].split('.').reduce((prev: any, curr: string) => prev[curr], row);
    if(item['type'] && item['type'] == "durationByMin"){
      let min:any = (tdData / 60);
      let sec:any = (tdData % 60);
      min = min < 10 ? `0${parseInt("" + min)}` : parseInt("" + min);
      sec = sec < 10 ? `0${sec}` : sec;
      let duration = `${min}:${sec}`;
      return duration;
    }
    return tdData;
  }




}
