import { Component , ViewEncapsulation , Input , Output , EventEmitter , OnInit} from '@angular/core';
import { AppEvent } from '../../app.event';
@Component({
  selector: 'music-layer',
  encapsulation: ViewEncapsulation.None,
  template: require('./layer.html'),
  styles:[require('./layer.scss')],
  providers : []
})
export class Layer {

  @Input() public data:Array<Object> = [];
  @Input() public btns:Array<Object> = [];

  public hidden:boolean = false;

  constructor(
    public events : AppEvent
  ){

  }


  public btnClick(data){
    this.events.do("search.btn.click" , data);
  }
  public listClick(data){

    this.events.do("search.list.click" , data);

  }

}
