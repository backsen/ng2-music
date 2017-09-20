import { Component , ViewEncapsulation , Input} from '@angular/core';
import { AppSql } from '../../app.sql';
import { AppEvent } from '../../app.event';
@Component({
  selector: 'music-play-list',
  encapsulation: ViewEncapsulation.None,
  template: require('./playList.html'),
  styles:[require('./playList.scss')],
  providers : [AppSql]
})
export class PlayList {


  public data:Array<Object> = [];

  public rows:Array<Object> = [];

  constructor(
    public sql : AppSql,
    public event : AppEvent
  ){
    this.event.one("play.list.data" , (data) => {
      data && data.length && this.resetData(data);
    })
  }

  public setList(index){
    let row = this.rows[index];
    if(this.sql.table("like-data").has({ID : row['ID']})){
      this.sql.table("like-data").remove({ID : row['ID']});
    }else{
      delete row['class'];
      delete row['playSongMusic'];
      this.sql.table("like-data").add(row);
    }
    this.resetData();
    this.event.do("like.list.refresh" , true)
  }

  public delete(event , index){
    event.stopPropagation();
    this.event.do("play.list.delete" , index);
  }

  public resetData(data = this.rows){

    let datas = [];

    data.forEach(
      item => {

        let list = {
          active : false,
          imgSrc : item['imgSrc'],
          name : item['FileName'],
          songName : item['SongName'],
          singerName : item['SingerName'],
          timeLength : item['SQDuration'],
          data : item,
          playSongMusic : item['playSongMusic']
        }

        if(this.sql.table("like-data").has({ID : item['ID']})){
          list['active'] = true;
        }

        datas.push(list)

      }
    )
    this.rows = data;
    this.data = datas;

  }

  public playListView(event){
    event.stopPropagation();
  }

  public play(row , index){
    if(!row['playSongMusic']){
      this.event.do("play.list.click" , index);
    }
  }

  public getTime(time){
    time = time === undefined ? 0 : time;
    let min:any = Math.floor(time / 60);
    let sec:any = parseInt(`${time % 60}`);
    min = min < 10 ? `0${min}` : min;
    sec = sec < 10 ? `0${sec}` : sec;
    return `${min} : ${sec}`;
  }



}
