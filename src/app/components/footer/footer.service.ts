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

    return this.http.get(`${this.api.getSongInfo}?r=play/getdata&hash=${hash}` , this.reqOption)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);


  }

  // 解析歌词

  public resetLyrics(lyrics:string = ""){

    let lyricsArr = lyrics.split(/\n/);

    let result = [];

    lyricsArr.forEach(
      item => {
        let timeStr = item.split("]")[0].replace("[" , "");
        let value = item.split("]")[1];
        let timeArr = timeStr.split(":");
        let time = (parseInt(timeArr[0]) * 60) + parseFloat(timeArr[1]);
        if(time === 0 || time > 0){
          result.push(
            {
              time : time,
              text : value
            }
          )
        }
      }
    )

    return result;

  }

  // 获取歌手写真

  public authorImage(hash , name = ""){
    let body = {
          "appkey":"p9hbDHNFkGE74FcMnYSvojEOAYbwFY8j",
          "clienttime":1504579766,
          "mid":"8bda1fcf65278d343907853d7ac327e5",
          "data":[
              {
                  "hash":hash,
                  "audio_id":"",
                  "filename":name
              }
          ],
          "clientver":202,
          "key":"0ccbab1cd657d5568ab5606a7494f24f",
          "type":"3",
          "appid":1155
      };

      return this.http.post(this.api.authorImage , JSON.stringify(body) ,this.reqOption)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);

  }




}
