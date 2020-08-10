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
import { PlaylistComponent } from './playlist/playlist.component'
import { ChannelComponent } from './channel/channel.component'
import { ChannelHomeComponent } from './channel/channel-home/channel-home.component'
import { ChannelAboutComponent } from './channel/channel-about/channel-about.component'
import { ChannelCommunityComponent } from './channel/channel-community/channel-community.component'
import { ChannelPlaylistComponent } from './channel/channel-playlist/channel-playlist.component'
import { ChannelVideosComponent } from './channel/channel-videos/channel-videos.component'
import { PostComponent } from './post/post.component'
import { SearchComponent } from './search/search.component'

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
  { path: 'watch/:id', component: WatchComponent },
  { path: 'watch/:id/:playlistid', component: WatchComponent },
  { path: 'playlist/:id', component: PlaylistComponent },
  { path: 'channel/:id', component: ChannelComponent, children: [
    { path: 'home', component: ChannelHomeComponent },
    { path: 'about', component: ChannelAboutComponent },
    { path: 'community', component: ChannelCommunityComponent },
    { path: 'videos', component: ChannelVideosComponent },
    { path: 'playlist', component: ChannelPlaylistComponent },
  ]},
  { path: 'post/:id', component: PlaylistComponent },
  { path: 'search/:keyword', component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
