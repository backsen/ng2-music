import { Component , ViewEncapsulation} from '@angular/core';
import { AppSql } from '../../app.sql';
import { AppEvent } from '../../app.event';
@Component({
  selector: 'music-likes',
  encapsulation: ViewEncapsulation.None,
  template: require('./likes.html'),
  styles:[require('./likes.scss')],
  providers : [AppSql]
})
export class Likes {

  public row:Array<Object> = [];
  public btns:Array<Object> = [
    {
      name : "",
      icon : "ion-ios-play-outline",
      key : "play"
    },
    {
      name : "",
      icon : "ion-ios-trash-outline",
      key : "delete"
    }
  ]

  constructor(
    private sql : AppSql,
    public event : AppEvent
  ){
    this.row = this.sql.table("like-data").data();
    this.event.one("like.list.refresh" , () => {
      this.row = this.sql.table("like-data").data();
    })
  }



  public onBtnClick(event){
    let [btn , data] = [event['btn'] , event['row']];
    if(btn.key == "delete"){
      this.sql.table("like-data").remove({ID : event['row']['ID']});
      this.row = this.sql.table("like-data").data();
    }else{
      event['row']['playSongMusic'] = true;
      this.event.do("play.click" , this.row);
    }

  }


}
