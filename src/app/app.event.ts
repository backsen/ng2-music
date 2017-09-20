import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class AppEvent {

  private data = new Subject<Object>();
  private dataStream$ = this.data.asObservable();

  private subscriptions: Map<string, Array<Function>> = new Map<string, Array<Function>>();

  constructor() {
    this.dataStream$.subscribe((data) => this.doEvent(data));
  }

  do(event, value) {
    let current = this.data[event];
    this.data[event] = value;
    this.data.next({
      event: event,
      data: this.data[event]
    });
  }

  on(event: string, callback: Function) {
    let subscribers = this.subscriptions.get(event) || [];
    subscribers.push(callback);
    this.subscriptions.set(event, subscribers);
  }

  one(event: string, callback: Function){
    this.subscriptions.set(event, [callback]);
  }

  remove(event: string){
    this.subscriptions.set(event, []);
  }

  doEvent(data: any) {
    let subscribers = this.subscriptions.get(data['event']) || [];
    subscribers.forEach((callback) => {
      callback.call(null, data['data']);
    });
  }
}
