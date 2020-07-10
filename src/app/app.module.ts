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

import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';

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
    CopyrightComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule
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
