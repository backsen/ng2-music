import { Component , ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'music-content',
  encapsulation: ViewEncapsulation.None,
  template: require('./content.html'),
  styles:[require('./content.scss')],
})
export class Content {



}
