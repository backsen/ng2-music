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

  public lyrics:Array<any> = [];

  public playTime:any = 0;
  public playTimer:any = null;

  public loopStatus:Array<Object> = [];

  public audioLoop:number = 0;

  public audio:any = {};

  public vEle:any = {};

  public view:Object = {
    showLoopLayer : false,
    showVolume : false
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
    this.vEle = this.elementRef.nativeElement.querySelector(".volume-main");
    this.audio = this.elementRef.nativeElement.querySelector("#audio");
    this.ele = this.elementRef.nativeElement.querySelector(".progress-wrap");
    this.audio.volume = localStorage.getItem("volume") || this.audio.volume;
    this.audioEventListener();
  }

  public switchMusic(isNext){
    if(isNext){
      this.playIndex++;
      this.playIndex = this.playIndex > this.playList.length - 1 ? 0 : this.playIndex;
    }else{
      this.playIndex--;
      this.playIndex = this.playIndex < 0 ? this.playList.length - 1 : this.playIndex;
    }
    this.playList.length && this.getSongInfo(this.playList[this.playIndex]);
  }

  public bodyClick(event){
    event.stopPropagation();
    this.view['showLoopLayer'] = false;
    this.view['showVolume'] = false;
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
    clearInterval(this.playTimer);
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
    clearInterval(this.playTimer);
    this.playTime = this.audio.currentTime;
    this.playTimer = setInterval(() => {
      this.playTime += 0.01;
      this.event.do("play.time" , this.playTime);
    },10);
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
      resData => {
        let res = resData['data'] || {};
        this.playTime = 0;
        clearInterval(this.playTimer);
        this.playMusic = {
          active : false,
          imgSrc : res['img'].replace("{size}",64),
          name : res['audio_name'],
          timeLength : res['timelength'] / 1000,
          currentTime : 0,
          url : res['play_url'],
          play : false,
          data : data
        }
        this.service.authorImage(res.hash , res['audio_name']).then(
          authorImageData => {
            let imgs = [];
            let data = authorImageData['data'];

            data.length && data.forEach(
              item => {
                item.forEach(
                  imgsData => {
                    let imgsDatas = imgsData['imgs'];
                    for(let i in imgsDatas){
                      imgsDatas[i].forEach(
                        img => {
                          imgs.push(img['sizable_portrait']);
                        }
                      )
                    }
                  }
                )
              }
            )

            this.event.do("play.bg.img" , imgs);
          }
        )
        this.lyrics = this.service.resetLyrics(res['lyrics']);
        if(this.sql.table("like-data").has({ID : data['ID']})){
          this.playMusic['active'] = true;
        }
        this.event.do("play.lyrics" , this.lyrics);
        this.playList[this.playIndex]['imgSrc'] = this.playMusic['imgSrc'];
        this.playList[this.playIndex]['playSongMusic'] = true;
        this.event.do("play.list.data" , this.playList);
      }
    )

  }

  public showLyricsFn(){
    if(this.playMusic['url']){
      this.event.do("play.lyrics.show" , true);
    }
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

  public oldHeight:any = 0;
  public pageY:any = 0;
  public vIsDown:boolean = false;
  public height:number = 0;

  public volumeMousedown(event){
    this.oldHeight = this.elementRef.nativeElement.querySelector(".volume-bar").offsetHeight;
    this.pageY = event['pageY'];
    this.vIsDown = true;
  }

  public mousemove(event){
    if(this.isDown){
      this.isMove = true;
      let [width , offsetWidth] = [event['pageX'] - this.pageX , this.ele.offsetWidth]
      this.width = this.oldWidth + width;
      this.width = this.width > offsetWidth ? offsetWidth : this.width < 0 ? 0 : this.width;
    }

    if(this.vIsDown){
      let [height , offsetHeight] = [this.pageY - event['pageY'] , this.vEle.offsetHeight];
      this.height = this.oldHeight + height;
      this.height = this.height < 0 ? 0 : this.height > offsetHeight ? offsetHeight : this.height;
      this.setVolume(offsetHeight);
    }

  }

  public progress:any = 0;

  public mute:boolean = false;

  public setMute(){
    this.mute = !this.mute;
    this.audio.muted = this.mute;
  }

  public getHeight(){
    this.height = this.vEle.offsetHeight * this.audio.volume;
  }

  public setVolume(offsetHeight){
    this.progress = this.height / offsetHeight;
    this.audio.volume = this.progress;
    localStorage.setItem("volume" , this.progress);
  }

  public mouseup(event , ele){
    if(this.playMusic['url'] && this.isMove){
      let progress = this.width / this.ele.offsetWidth * 100;
      let currentTime = this.playMusic['timeLength'] / 100 * progress;
      this.audio.currentTime = currentTime;
    }
    this.isDown = false;
    this.isMove = false;
    this.vIsDown = false;
  }

}
