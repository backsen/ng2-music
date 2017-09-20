import { Injectable } from '@angular/core';

@Injectable()

export class AppSql{

  private tableName:string = "";

  constructor(){

  }

  private getItem(){

    let data:any = localStorage.getItem(this.tableName);

    data = data ? JSON.parse(data) : [];

    return data;

  }

  private setItem(data){
    localStorage.setItem(this.tableName , JSON.stringify(data));
  }


  table(tableName:string = ""){
    if(tableName && typeof tableName === "string") this.tableName = tableName;
    return this;
  }

  data(){
    return this.getItem();
  }

  has(hasObject:Object = null){

    let [data , isReturn , hasObjectClone] = [this.getItem() , false , {}];

    if(hasObject && typeof hasObject === "object"){

      for(let key in hasObject){
        hasObjectClone['name'] = key;
        hasObjectClone['value'] = hasObject[key];
      }

      for(let item of data){
        if(item[hasObjectClone['name']] === hasObjectClone['value']) isReturn = true;
      }

      return isReturn;

    }

    return isReturn;

  }

  remove(removeObject:Object = null){

    let [data , removeObjectClone] = [this.getItem() , {}];

    if(removeObject && typeof removeObject === "object"){

      for(let key in removeObject){
        removeObjectClone['name'] = key;
        removeObjectClone['value'] = removeObject[key];
      }

      for(let i = data.length - 1; i >= 0; i--){
        let item = data[i];
        if(item[removeObjectClone['name']] === removeObjectClone['value']) data.splice(i , 1);
      }

      this.setItem(data);

    }

    return this;

  }

  add(addObject:Object = null){

    let data = this.getItem();

    if(addObject && typeof addObject === "object"){
      data.push(addObject);
      this.setItem(data);
    }

    return this;

  }

  removeTable(tableName:string = ""){

    typeof tableName == "string" && localStorage.removeItem(tableName || this.tableName);
    return this;

  }

}
