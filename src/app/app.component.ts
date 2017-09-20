import { Component , ViewEncapsulation} from '@angular/core';
import { AppEvent } from './app.event';
@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  template: require('./app.html'),
  styles:[require('./app.scss')],
  providers : []
})
export class AppComponent {

  public app:Object = {
    version : "1.0",
    name : "酷狗音乐",
    desc : "不负好声音"
  };
  public bgTimer:any = null;
  public bgImgs:Array<Object> = ['http://singerimg.kugou.com/v2/singer_portrait/20140411/20140411104509574.jpg'];
  public bgIndex:number = 0;
  public isImgBg:boolean = true;

  public view:Object = {
    playListHide : true
  }

  constructor(
    public events : AppEvent
  ){
    this.initEvent();
  }

  public setImgBg(){
    this.bgTimer = setInterval(() => {

    })
  }

  public appClick(event){
    event.stopPropagation();
    this.view['playListHide'] = true;
    this.events.do("app.main.click" , event);
  }

  public initEvent(){

    this.events.one("play.list.view" , (data) => {

      this.view['playListHide'] = !this.view['playListHide'];

    });

    this.events.one("play.bg.img" , (data) => {


      if(data && data.length){
        this.bgImgs = data;
        this.bgIndex = 0;
        this.setImgBg();
        this.isImgBg = true;
      }

    })


  }

}
