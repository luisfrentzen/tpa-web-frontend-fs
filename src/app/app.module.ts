import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';

import { SocialAuthService } from "angularx-social-login";

import { ModalComponent } from './modal/modal.component';
import { HomeComponent } from './home/home.component';
import { TrendingComponent } from './trending/trending.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { CategoryComponent } from './category/category.component';
import { MembershipComponent } from './membership/membership.component';
import { AboutComponent } from './about/about.component';
import { TermsComponent } from './terms/terms.component';
import { AdvertiseComponent } from './advertise/advertise.component';
import { CopyrightComponent } from './copyright/copyright.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { environment } from '../environments/environment';
import { DropzoneDirective } from './dropzone.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatVideoModule } from 'mat-video';
import { MusicComponent } from './music/music.component';
import { GamingComponent } from './gaming/gaming.component';
import { SportComponent } from './sport/sport.component';
import { EntertainmentComponent } from './entertainment/entertainment.component';
import { NewsComponent } from './news/news.component';
import { TravelComponent } from './travel/travel.component';
import { WatchComponent } from './watch/watch.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { CommentBlockComponent } from './comment-block/comment-block.component';
import { ChannelComponent } from './channel/channel.component';
import { ChannelHomeComponent } from './channel/channel-home/channel-home.component';
import { ChannelVideosComponent } from './channel/channel-videos/channel-videos.component';
import { ChannelPlaylistComponent } from './channel/channel-playlist/channel-playlist.component';
import { ChannelCommunityComponent } from './channel/channel-community/channel-community.component';
import { ChannelAboutComponent } from './channel/channel-about/channel-about.component';
import { PlaylistBlockComponent } from './playlist-block/playlist-block.component';
import { VideoBlockComponent } from './video-block/video-block.component';
import { PostBlockComponent } from './post-block/post-block.component';
import { PostComponent } from './post/post.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ModalComponent,
    HomeComponent,
    TrendingComponent,
    SubscriptionComponent,
    CategoryComponent,
    MembershipComponent,
    AboutComponent,
    TermsComponent,
    AdvertiseComponent,
    CopyrightComponent,
    DropzoneDirective,
    FileUploadComponent,
    MusicComponent,
    GamingComponent,
    SportComponent,
    EntertainmentComponent,
    NewsComponent,
    TravelComponent,
    WatchComponent,
    PlaylistComponent,
    CommentBlockComponent,
    ChannelComponent,
    ChannelHomeComponent,
    ChannelVideosComponent,
    ChannelPlaylistComponent,
    ChannelCommunityComponent,
    ChannelAboutComponent,
    PlaylistBlockComponent,
    VideoBlockComponent,
    PostBlockComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    GraphQLModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    MatVideoModule
  ],
  providers: [
    DataService,
    SocialAuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '923946978263-fs7jsg0jaa7gob0hogfkpumvkq9iqjg6.apps.googleusercontent.com'
            ),
          }],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
