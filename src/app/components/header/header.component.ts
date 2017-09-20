import { Component , ViewEncapsulation , Input , ElementRef} from '@angular/core';
import { Router } from '@angular/router';

import { HeaderService } from './header.service';


import { AppEvent } from '../../app.event';

@Component({
  selector: 'music-header',
  encapsulation: ViewEncapsulation.None,
  template: require('./header.html'),
  styles:[require('./header.scss')],
  providers : [HeaderService]
})
export class Header {

  @Input() public app = {};

  public view:Object = {
    showSearchInput : false,
    lock : false,
    hiddenLayer : false
  }

  public keyWord:string = "";
  public timer:any = null;
  public btns:Array<Object> = [];
  public layerBtns:Array<Object> = [];
  public searchData:Object = {};
  public layerData:Array<Object> = [];

  public searchPageLoad:boolean = false;

  public page:number = 1;

  constructor(
    public service : HeaderService,
    public events : AppEvent,
    public router : Router,
    public elementRef : ElementRef
  ){

    this.btns = this.service.btns;

    this.initEvent();

  }

  public searchInputKeydown(event , isClick = false){
    event.stopPropagation && event.stopPropagation();
    if((isClick || (event && event.keyCode == 13)) && this.keyWord){
      this.listClick({
        name : this.keyWord
      });
    }
  }

  public initEvent(){

    this.events.one("search.list.click" , (data) => {
      this.searchData = data;
      this.keyWord = this.searchData['name'];
      this.listClick(data);
    });

    this.events.one("search.page.load" , () => {
      this.searchPageLoad = true;
      this.events.do("search" , this.searchData);
    });

    this.events.one("search.page.close" , () => {
      this.searchPageLoad = false;
    });

    this.events.one("search.btn.click" , (data) => {
      this.layerBtnOnClick(data);
    })

  }

  public searchInput(){

    if(!this.view['lock'] && this.keyWord){
      this.service.getSearchTip(this.keyWord).then(
        res => {
          let datas = res['data'] || [];
          let data = [];
          datas.forEach((item) => {
            let listData = {
              title : item['LableName'],
              datas : []
            };
            item['RecordDatas'].forEach((list) => {

              listData['datas'].push({
                name : list['HintInfo'],
                desc : list['MatchCount'],
                type : item['LableName'] || ""
              })

            });

            data.push(listData);

          })

          this.layerData = data;
          this.layerBtns = [];
        }
      )
    }

  }

  public listClick(data){

    if(data['type'] == "" || data['type'] === undefined){
      this.saveHistory(data);
      this.elementRef.nativeElement.querySelector("#searchInput").blur();
      if(!this.searchPageLoad){
        this.router.navigate(['/search']);
      }else{
        this.events.do("search" , this.searchData);
      }
    }
  }


  public compositionend(event){
    this.view['lock'] = false;
    this.searchInput();
  }

  public showSearchInput(){
    this.view['showSearchInput'] = true;
    this.getHistory();
    let timer = setTimeout(() => {
      clearTimeout(timer);
      document.getElementById("searchInput").focus();
    } , 500);
  }

  public searchInputFocus(){
    this.view['hiddenLayer'] = false;
  }

  public searchInputBlur(){
    let timer = setTimeout(() => {
      this.view['hiddenLayer'] = true;
      if(!this.keyWord){
        this.view['showSearchInput'] = false;
      }
    } , 100);
  }

  public layerBtnOnClick(data){
    this[data['key']]();
  }

  public getHistory(){

    let historys:any = localStorage.getItem("searchData");
    if(historys){
      historys = JSON.parse(historys);
    }else{
      historys = [];
    }

    let datas = [];

    if(historys.length){

      datas = [{
        datas : []
      }];

      historys.forEach((item) => {
        let listData = {
          name : item['name'],
          desc : this.getHistoryDesc(item['time'] / 1000)
        }

        datas[0]['datas'].push(listData);

      })
    }


    this.layerData = datas;
    this.layerBtns = this.btns;
  }

  public getHistoryDesc(time){

    let now = Date.now() / 1000;
    let desc = "";

    if(now - time <= 60){

      desc = `${parseInt("" + (now - time))}秒前`;

    }else if((now - time) / 60 <= 60){
      desc = `${parseInt(""+(now - time) / 60)}分钟前`;
    }else if((now - time) / 60 / 60 <= 24){
      desc = `${parseInt("" + (now - time) / 60 / 60)}分钟前`;
    }else{
      desc = `${parseInt("" + (now - time) / 60 / 60 / 24)}天前`;
    }

    return desc;


  }

  public saveHistory(data){

    let historys:any = localStorage.getItem("searchData");

    if(historys){
      historys = JSON.parse(historys);
    }else{
      historys = [];
    }

    let add = true;

    historys.forEach(
      item => {
        if(item['name'] == data['name']){
          add = false;
          item['time'] = Date.now();
        }
      }
    )

    if(add){
      historys.push({
        name : data['name'],
        time : Date.now()
      })
    }

    historys.sort((a , b) => {

      if(a['time'] > b['time']){
        return -1;
      }

      if(a['time'] < b['time']){
        return 1;
      }

      return 0;

    })

    localStorage.setItem("searchData" , JSON.stringify(historys))

  }

  public clearHistory(){
    localStorage.setItem("searchData" , JSON.stringify([]));
  }

}
