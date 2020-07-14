import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private data : DataService, private router : Router, private authService: SocialAuthService, private apollo : Apollo) { }

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
    this.changePage('');
    this.menuVisible = false
    this.settingsVisible = false
    window.location.reload();
  }

  signInWithGoogle(){

    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);

    this.authService.authState.subscribe(user => {
      this.user = user;
      this.loggedIn = (user != null);

      this.addToLocalStorage(user);



      // console.log(idnew)
      // console.log(namenew)
      // console.log(profilepicnew)
      // console.log(premiumnew)

      // this.apollo
      //   .watchQuery({
      //     query: gql`
      //       {
      //         userById(userid: $id){
      //           id,
      //           name
      //         }
      //       }
      //     `,
      //     variables: {
      //       id: this.idnew
      //     }
      //   })
      //   .valueChanges.subscribe(result => {
      //     this.currentUser = result.data.userById
      //   });
      //
      //   const query = gql`
      //     query User($userid: String){
      //       userById(userid: $id){
      //         id,
      //         name
      //       }
      //     }
      //   `;
      //
      //   this.apollo.watchQuery({
      //     query: query,
      //     variables: {
      //       userid: idnew,
      //     }
      //   })
      //   .valueChanges.subscribe(result => {
      //     this.currentUser = result.data.userById
      //   });

      const idnew = user.id;
      const namenew = user.name;
      const profilepicnew = user.photoUrl;
      // const premiumnew = 'no';

        this.apollo
          .watchQuery({
            query: gql`
              query userById($userid: String!){
                userById(userid: $userid){
                  id,
                  name
                }
              }
            `,
            variables: {
              userid: idnew,
            }
          })
          .valueChanges.subscribe(result => {
            const res = result.data.userById
            if(res.length == 0)
            {
              console.log('test')
              this.apollo
                  .mutate({
                    mutation : gql`
                    mutation createUser($id: String!, $name: String!, $profilepic: String!) {
                      createUser(input: {
                        id: $id
                        name: $name
                        premium: "no"
                        profilepic: $profilepic
                      }){
                        id
                      }
                    }
                    `,
                    variables : {
                      id: idnew,
                      name: namenew,
                      profilepic: profilepicnew,
                    }
                  }).subscribe(({ data }) => {
                console.log('got data', data);
              },(error) => {
                console.log('there was an error sending the query', error);
              });
            }
          });

      // console.log('asd')
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
    // console.log(this.users[0].photoUrl);
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
