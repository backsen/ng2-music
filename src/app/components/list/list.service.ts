import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import { MusicService } from '../service';

import { RequestOption } from '../../common';

@Injectable() export class ListService extends MusicService{

  public reqOption:any = RequestOption;
  private titleUrl:string = "assets/json/list.json";

  constructor(public http : Http){
    super(http);
  }



  // 获取表头

  public getTableTitle(url:string = ""){

    return this.http.get(url || this.titleUrl , this.reqOption)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleError);

  }


}
