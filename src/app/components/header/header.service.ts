import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import { MusicService } from '../service';

import { Api , RequestOption} from '../../common';

@Injectable() export class HeaderService extends MusicService{

  public api:any = Api;

  public reqOption:any = RequestOption;

  constructor(public http : Http){
    super(http);
  }

  public btns:Array<Object> = [{
    name : "清空历史记录",
    key : "clearHistory"
  }];


  // 搜索关键字提示

  public getSearchTip(keyWord:string = ""){

    return this.http.get(`${this.api.getSearchTip}?keyword=${keyWord}` , this.reqOption)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);


  }




}
