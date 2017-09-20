import { Component , ViewEncapsulation , OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchSongService } from './search.service';
import { AppEvent } from '../../app.event';
import { Subscription } from 'rxjs/Subscription';
import { AppSql } from '../../app.sql';
@Component({
  selector: 'music-search-result',
  encapsulation: ViewEncapsulation.None,
  template: require('./search.html'),
  styles:[require('./search.scss')],
  providers : [SearchSongService , AppSql]
})
export class SearchResult {

  public page:number = 1;
  public keyWord:string = "";
  private sub: Subscription;

  public navdatas:Array<Object> = [];

  public dqBtns:Array<Object> = [];

  public dqRows:Array<Object> = [];

  public pages:Object = {
    dq : 1,
    gd : 1,
    zj : 1,
    dqMax : 1
  }

  constructor(
    public service : SearchSongService,
    public events : AppEvent,
    private route : ActivatedRoute,
    private sql : AppSql
  ){

    this.events.one("search" , (data) => {
      if(data['name']){
        this.dqRows = [];
        this.pages['dqMax'] = 1;
        this.keyWord = data['name'];
        this.songSearch(data);
      }
    })

    this.navdatas = this.service.navdatas;
    this.dqBtns = this.service.dqBtns;
    this.dqRows = [];

  }

  ngOnInit(){

  }

  ngAfterViewInit(){
    this.events.do("search.page.load" , true);
  }

  ngOnDestroy(){
    this.events.do("search.page.close" , true);
  }

  public onBtnClick(event){
    let btn = event['btn'];
    if(btn.key == "like"){
      event['row']['active'] = !event['row']['active'];
      if(event['row']['active']){
        delete event['row']['class'];
        delete event['row']['playSongMusic'];
        this.sql.table("like-data").add(event['row']);
      }else{
        this.sql.table("like-data").remove({ID : event['row']['ID']});
      }
    }else if(btn.key == "play"){
      this.events.do("play.click" , event['row']);
    }else{
      this.events.do("play.list.add" , event['row']);
    }
  }

  public navClick(event){

  }

  public scroll(event){

    let ele = event['srcElement'];
    let [height , scrollTop , scrollHeight] = [ele.offsetHeight , ele.scrollTop , ele.scrollHeight];

    if((height + scrollTop) >= (scrollHeight - 20)){
      this.pages['dq']++;
      this.songSearch();
    }

  }

  // 搜索单曲

  public songSearch(data:any = {}){

    if(this.pages['dq'] > this.pages['dqMax']) return false;

    let querys = {
      tag : "em",
      keyword : data['name'] || this.keyWord,
      page : this.pages['dq'],
      pagesize : 20,
      iscorrection : 7,
      clientver : 8000
    };

    this.service.songSearch(querys).then(
      res => {
        this.dqBtns = this.service.dqBtns;
        this.pages['dqMax'] = Math.ceil(res['data']['total'] / 20);
        let dqRows = res && res['data'] ? res['data']['lists'] || [] : [];
        dqRows.forEach(
          item => {
            item['active'] = false;
            item['class'] = "text-em";
            if(this.sql.table("like-data").has({ID : item['ID']})){
              item['active'] = true;
            }
          }
        )
        this.dqRows = this.dqRows.concat(dqRows);
      }
    )

  }

}
