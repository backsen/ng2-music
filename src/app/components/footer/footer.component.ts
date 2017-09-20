import { Component , ViewEncapsulation , ElementRef} from '@angular/core';
import { AppEvent } from '../../app.event';
import { FooterService } from './footer.service';
import { AppSql } from '../../app.sql';
@Component({
  selector: 'music-footer',
  encapsulation: ViewEncapsulation.None,
  template: require('./footer.html'),
  styles:[require('./footer.scss')],
  providers : [FooterService , AppSql]
})
export class Footer {

  public playMusic:Object = {};
  public playList:Array<Object> = [];
  public playIndex:number = 0;
  public isDown:boolean = false;

  public isMove:boolean = false;

  public width:number = 0;
  public oldWidth:number = 0;
  public ele:any = {};
  public pageX: number = 0;

  public loopStatus:Array<Object> = [];

  public audioLoop:number = 0;

  public audio:any = {};

  public view:Object = {
    showLoopLayer : false
  }

  constructor(
    public elementRef : ElementRef,
    public event : AppEvent,
    public service : FooterService,
    private sql : AppSql
  ){

    this.loopStatus = this.service.loopStatus;

    document.body.addEventListener("mousemove" , this.mousemove.bind(this) , false);
    document.body.addEventListener("mouseup" , this.mouseup.bind(this) , false);
    document.body.addEventListener("click" , this.bodyClick.bind(this) , false);

    this.event.one("app.main.click" , (event) => {
      this.bodyClick(event);
    })

    this.event.one("play.click" , (data) => {

      if(data.length){
        this.playIndex = 0;
        this.playList = [].concat(data);
        this.setPlayMusic();
      }else{
        this.playList.push(data);
        this.playIndex = this.playList.length - 1;
        this.getSongInfo(data);
      }

    })

    this.event.one("play.list.add" , (data) => {
      let add = true;
      this.playList.forEach(
        item => {
          if(item['ID'] == data['ID']){
            add = false;
          }
        }
      )
      if(add){
        this.playList.push(data);
        this.event.do("play.list.data" , this.playList);
      }
    })

    this.event.one("play.list.click" , (index) => {
      this.playIndex = index;
      this.setSonging();
      this.getSongInfo(this.playList[this.playIndex]);
      this.event.do("play.list.data" , this.playList);
    })

    this.event.one("play.list.delete" , (index) => {
      this.deletePlayList(index);
    })

  }

  ngAfterViewInit(){
    this.audio = this.elementRef.nativeElement.querySelector("#audio");
    this.ele = this.elementRef.nativeElement.querySelector(".progress-wrap");
    this.audioEventListener();
  }

  public bodyClick(event){
    event.stopPropagation();
    this.view['showLoopLayer'] = false;
  }

  public setLike(){
    if(this.playMusic['active']){
      this.playMusic['active'] = false;
      this.sql.remove({ID : this.playMusic['data']['ID']});
      this.event.do("like.list.refresh" , true)
    }else{
      this.playMusic['active'] = true;
      delete this.playMusic['data']['class'];
      delete this.playMusic['data']['playSongMusic'];
      this.sql.add(this.playMusic['data']);
      this.event.do("like.list.refresh" , true)
    }
  }

  public progress(event){
    if(this.playMusic['url']){
      let width = event['offsetX'];
      let progress = width / this.ele.offsetWidth * 100;
      let currentTime = this.playMusic['timeLength'] / 100 * progress;
      this.audio.currentTime = currentTime;
    }
  }

  public deletePlayList(index){

    if(index == this.playIndex && this.playList.length > index){

      if(index == this.playList.length - 1){
        this.playIndex = 0;
      }

      this.playList.splice(index , 1);
      this.setSonging();
      this.getSongInfo(this.playList[this.playIndex]);

    }else if(this.playList.length > index){
      this.playList.splice(index , 1);
    }

    this.event.do("play.list.data" , this.playList);

  }

  public setPlayMusic(){
    this.playMusic = {};
    this.playList.forEach(
      (item , i) => {
        if(item['playSongMusic']){
          this.playIndex = i;
        }
      }
    )
    this.getSongInfo(this.playList[this.playIndex] || {});
  }

  public setSonging(){
    this.playList.forEach(
      (item , i) => {
        item['playSongMusic'] = false;
      }
    )
    if(this.playList.length > this.playIndex)
    this.playList[this.playIndex]['playSongMusic'] = true;
  }

  public audioEventListener(){
    this.audio.addEventListener("play" , this.play.bind(this) , false);
    this.audio.addEventListener("pause" , this.pause.bind(this) , false);
    this.audio.addEventListener("timeupdate" , this.timeupdate.bind(this) , false);
  }

  public play(){
    this.playMusic['play'] = true;
  }

  public pause(){
    this.playMusic['play'] = false;
  }

  public musicStatus(){
    if(this.playMusic['url']){
      if(this.playMusic['play']){
        this.audio.pause();
      }else{
        this.audio.play();
      }
    }
  }

  public timeupdate(){
    if(this.audio.ended){
      this.next();
    }else if(!this.isMove){
      this.playMusic['currentTime'] = this.audio.currentTime;
      let width = this.ele.offsetWidth;
      let progress = this.playMusic['currentTime'] / this.playMusic['timeLength'] * 100;

      this.width = width / 100 * progress;
    }
  }

  public next(){
    let type = this.audioLoop;
    if(type == 0){
      if(this.playIndex >= this.playList.length - 1){
        this.playIndex = 0;
      }else{
        this.playIndex++;
      }
      this.setSonging();
    }else if(type == 1){
      this.audio.currentTime = 0;
      this.audio.play();
      return false;
    }else if(type == 2){
      let index = Math.floor(Math.random() * (this.playList.length));
      if(this.playIndex == index){
        this.audio.currentTime = 0;
        this.audio.play();
        return false;
      }else{
        this.playIndex = index;
      }
    }

    type != 1 && this.getSongInfo(this.playList[this.playIndex] || {});
  }

  public getTime(time){
    time = time === undefined ? 0 : time;
    let min:any = Math.floor(time / 60);
    let sec:any = parseInt(`${time % 60}`);
    min = min < 10 ? `0${min}` : min;
    sec = sec < 10 ? `0${sec}` : sec;
    return `${min} : ${sec}`;
  }

  public getSongInfo(data){
    if(!data || !data.FileHash){
      this.playMusic = {};
      return false;
    }
    this.service.getSongInfo(data.FileHash).then(
      res => {
        res = res || {};
        this.playMusic = {
          active : false,
          imgSrc : res['album_img'].replace("{size}",64),
          name : res['fileName'],
          timeLength : res['timeLength'],
          currentTime : 0,
          url : res['url'],
          play : false,
          data : data
        }
        if(this.sql.table("like-data").has({ID : data['ID']})){
          this.playMusic['active'] = true;
        }
        this.playList[this.playIndex]['imgSrc'] = this.playMusic['imgSrc'];
        this.playList[this.playIndex]['playSongMusic'] = true;
        this.event.do("play.list.data" , this.playList);
      }
    )

  }

  public playListView(event){
    event.stopPropagation();
    this.event.do("play.list.view" , true);
    this.event.do("play.list.data" , this.playList);
  }

  public mousedown(event){
    this.oldWidth = this.elementRef.nativeElement.querySelector(".progress-bar").offsetWidth;
    this.pageX = event['pageX'];
    this.isDown = true;
  }

  public mousemove(event){
    if(this.isDown){
      this.isMove = true;
      let [width , offsetWidth] = [event['pageX'] - this.pageX , this.ele.offsetWidth]
      this.width = this.oldWidth + width;
      this.width = this.width > offsetWidth ? offsetWidth : this.width < 0 ? 0 : this.width;
    }
  }

  public mouseup(event , ele){
    if(this.playMusic['url'] && this.isMove){
      let progress = this.width / this.ele.offsetWidth * 100;
      let currentTime = this.playMusic['timeLength'] / 100 * progress;
      this.audio.currentTime = currentTime;
    }
    this.isDown = false;
    this.isMove = false;
  }

}
