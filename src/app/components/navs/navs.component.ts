import { Component , ViewEncapsulation , Input , Output , EventEmitter , OnInit} from '@angular/core';

@Component({
  selector: 'music-navs',
  encapsulation: ViewEncapsulation.None,
  template: require('./navs.html'),
  styles:[require('./navs.scss')],
})
export class Navs {

  @Input() public datas:Array<Object> = [];

  @Output() onClick = new EventEmitter<any>();

  constructor(){

  }

  ngOnInit(){

    let setActive = true;

    this.datas.forEach(
      item =>{
        if(item['active']){
          setActive = false;
        }
      }
    )

    if(setActive && this.datas.length){
      this.datas[0]['active'] = true;
    }

  }


  public navClick(data){

    this.datas.forEach((item) => {
      item['active'] = false;
    })

    data['active'] = true;

    this.onClick.emit(data);
  }



}
