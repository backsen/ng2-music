import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import { MusicService } from '../service';

import { Api , RequestOption} from '../../common';

@Injectable() export class FooterService extends MusicService{

  public api:any = Api;

  public reqOption:any = RequestOption;

  constructor(public http : Http){
    super(http);
  }

  public loopStatus:Array<Object> = [
    {
      icon : "lb",
      name : "列表循环"
    },
    {
        icon : "dq",
        name : "单曲循环"
    },
    {
      icon : "sj",
      name : "随机播放"
    }
  ];


  // 搜索关歌曲信息

  public getSongInfo(hash:string = ""){

    return this.http.get(`${this.api.getSongInfo}?cmd=playInfo&hash=${hash}` , this.reqOption)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);


  }




}
