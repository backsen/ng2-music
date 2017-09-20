import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import { MusicService } from '../service';

import { Api , RequestOption} from '../../common';

@Injectable() export class SearchSongService extends MusicService{

  public api:any = Api;

  public reqOption:any = RequestOption;

  constructor(public http : Http){
    super(http);
  }

  public navdatas:Array<Object> = [
    {
      name : "单曲",
      key : "song"
    },{
      name : "歌单",
      key : "gd"
    },{
      name : "专辑",
      key : "zj"
    }
  ];

  public dqBtns:Array<Object> = [
    {
      name : "",
      icon : "ion-ios-play-outline",
      key : "play"
    },
    {
      name : "",
      icon : "ion-ios-plus-empty",
      key : "add"
    },
    {
      name : "",
      icon : "ion-ios-heart-outline",
      key : "like",
      hover : "like",
      active : "ion-ios-heart like-active"
    }
  ]


  // 搜索歌曲

  public songSearch(querys){
    let query = this.getQuerys({querys : querys});
    return this.http.get( this.api.songSearch + query , this.reqOption)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);
  }


}
