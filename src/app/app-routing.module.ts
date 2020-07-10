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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'advertise', component: AdvertiseComponent },
  { path: 'copyright', component: CopyrightComponent },
  { path: 'membership', component: MembershipComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'trending', component: TrendingComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
