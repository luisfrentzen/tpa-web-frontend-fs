import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private data : DataService, private router : Router, private authService: SocialAuthService) { }

  user: SocialUser;
  loggedIn: boolean;

  settingsVisible = false;
  menuVisible = false;

  showLogin = false;
  reg = false;

  onLocation = false;
  onRestriction = false;
  showKeyboard = false;

  currentPage = 'home';

  users = []

  signOut() {
    // this.authService.signOut(true);
    // sessionStorage.clear();
    // // gapi.auth2.getAuthInstance().disconnect()

    this.removeUser();
    this.authService.signOut();
    window.location.reload();
  }

  signInWithGoogle(){
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);

    this.authService.authState.subscribe(user => {
      this.user = user;
      this.loggedIn = (user != null);

      this.addToLocalStorage(user);
    });

  }

  addToLocalStorage(user){
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  getUserFromStorage(){
    this.users = JSON.parse(localStorage.getItem('users'));
    this.user = this.users[0];
    this.loggedIn = true;
  }

  removeUser(){
    window.localStorage.clear();
    this.loggedIn = false;
  }

  ngOnInit(){
    // this.authService.renewTokens();
    // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);

    if(localStorage.getItem('users') == null){
      this.users = [];
    }
    else{
      this.getUserFromStorage();
    }


    this.settingsVisible = false;
    this.menuVisible = false;
    this.reg = false;

    this.data.currentMessage.subscribe(showLogin => this.showLogin = showLogin)
    this.data.currentLocation.subscribe(onLocation => this.onLocation = onLocation)
    this.data.currentRestriction.subscribe(onRestriction => this.onRestriction = onRestriction)
    this.data.currentKeyboardModal.subscribe(showKeyboard => this.showKeyboard = showKeyboard)
    this.data.currentPage.subscribe(currentPage => this.currentPage = currentPage)
    // console.log(gapi);
  }

  showSettings() {
    console.log(this.authService.authState);
    this.settingsVisible = !this.settingsVisible
  }

  changePage(nextPage:string) {
    this.router.navigateByUrl('/' + nextPage);
    this.menuVisible = false;
  }

  showMenu() {
    this.menuVisible = !this.menuVisible
  }

  toggleModal = () => {
    this.data.toggleLoginModal(!this.showLogin);
    this.reg = false;
  }

  toggleReg() {
    this.reg = !this.reg;
  }

  toggleRestrictionButton() {
    this.data.toggleRestriction(!this.onRestriction)
  }

  toggleLocationButton() {
    this.data.toggleLocation(!this.onLocation)
  }

  toggleKeyboardModal = () => {
    this.data.toggleKeyboardModal(!this.showKeyboard)
    this.settingsVisible = false
  }

  toggleDropDown() {
    this.menuVisible = false;
    this.settingsVisible = false;
  }
}
