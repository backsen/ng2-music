import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';

@Injectable() export class MusicService{


  constructor(public http : Http){

  }

  public handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return errMsg;
  }

  public queryString(data:any){
    let querystring = "";
    let queryArr = [];
    if(data && typeof data == "object"){
      for(let item in data){
        queryArr.push(`${item}=${encodeURIComponent(data[item])}`);
      }
      querystring = queryArr.length ? "?" + queryArr.join("&") : "";
    }
    return querystring;
  }

  public getQuerys(args:any){
    return this.queryString(args.querys);
  }

  public extractData(res: any){
    let body = res.json();
    return body || {};
  }


}
