import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component'
import { AdvertiseComponent } from './advertise/advertise.component'
import { CopyrightComponent } from './copyright/copyright.component'
import { MembershipComponent } from './membership/membership.component'
import { TermsComponent } from './terms/terms.component'
import { TrendingComponent } from './trending/trending.component'
import { CategoryComponent } from './category/category.component'
import { SubscriptionComponent } from './subscription/subscription.component'
import { AboutComponent } from './about/about.component'
import { FileUploadComponent } from './file-upload/file-upload.component'

import { GamingComponent } from './gaming/gaming.component'
import { MusicComponent } from './music/music.component'
import { SportComponent } from './sport/sport.component'
import { EntertainmentComponent } from './entertainment/entertainment.component'
import { TravelComponent } from './travel/travel.component'
import { NewsComponent } from './news/news.component'
import { WatchComponent } from './watch/watch.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'advertise', component: AdvertiseComponent },
  { path: 'copyright', component: CopyrightComponent },
  { path: 'membership', component: MembershipComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'trending', component: TrendingComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'about', component: AboutComponent },
  { path: 'upload', component: FileUploadComponent },
  { path: 'gaming', component: GamingComponent },
  { path: 'music', component: MusicComponent },
  { path: 'sport', component: SportComponent },
  { path: 'entertainment', component: EntertainmentComponent },
  { path: 'news', component: NewsComponent },
  { path: 'travel', component: TravelComponent },
  { path: 'watch/:id', component: WatchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
