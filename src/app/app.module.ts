import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { AppEvent } from './app.event';

import {
  Header,
  Footer,
  Content,
  Layer,
  Navs,
  List,
  Menu,
  PlayList
} from './components';


const COMPONENTS = [
  Header,
  Footer,
  Content,
  Layer,
  Navs,
  List,
  Menu,
  PlayList
];

import {
  SearchResult,
  Likes
} from './pages';

const PAGES_COMPONENT = [
  SearchResult,
  Likes
];

@NgModule({
  declarations: [
    AppComponent,
    ...COMPONENTS,
    ...PAGES_COMPONENT
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [AppComponent , AppEvent],
  bootstrap: [AppComponent]
})
export class AppModule { }
