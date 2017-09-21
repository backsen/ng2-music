import { Component , ViewEncapsulation , Input , ElementRef} from '@angular/core';
import { AppEvent } from '../../app.event';
@Component({
  selector: 'music-lyrics',
  // encapsulation: ViewEncapsulation.None,
  template: require('./lyrics.html'),
  styles:[require('./lyrics.scss')],
})
export class Lyrics {

  public time:any = 0;
  public lyrics:any = [];

  public index:number = 0;

  public height:number = 0;

  public mian:any = this.elementRef.nativeElement.querySelector("#lyricsId");

  public top:number = 0;

  constructor(
    public event : AppEvent,
    public elementRef : ElementRef
  ){

    this.event.one("play.time" , (data) => {
      this.time = data.toFixed(2);
      this.setShowIndex();
    });
    this.event.one("play.lyrics" , (data) => {
      this.lyrics = data;
      this.top = 0;
      this.index = 0;
    })
  }

  ngAfterViewInit(){
    this.mian = this.elementRef.nativeElement.querySelector("#lyricsId");
    this.height = (this.mian.offsetHeight) / 2 - 40;
  }

  public setShowIndex(){
    for(let i = 0 , len = this.lyrics.length; i < len; i++){
      let item = this.lyrics[i];
      let next = this.lyrics[i + 1] || {
        time : 0
      };
      if((this.time >= item['time'] && this.time <= next['time']) || (this.time >= item['time'] && i == len - 1)){
        this.index = i;
        break;
      }
    }

    if(this.index * 40 > this.height){
      this.top = this.index * 40 - this.height + 20;
    }
    this.top = this.top > this.mian.scrollHeight ? this.mian.scrollHeight - this.mian.offsetHeight : this.top;
  }



}
