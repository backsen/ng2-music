import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AppComponent } from './app.component';

import { SearchResult , Likes} from './pages';

export const routes: Routes = [
  {path : "search" , component : SearchResult},
  {path : "like" , component : Likes}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
