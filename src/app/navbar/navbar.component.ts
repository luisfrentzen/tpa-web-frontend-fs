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
  showLogout = false;
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

  showShareModal = false;

  toggleShareModal = () => {
      this.data.toggleShareModal(!this.showShareModal);
  }

  switchAcc(){
    // this.removeUser();
    // this.authService.signOut();
    // this.changePage('');
    // this.menuVisible = false
    // this.settingsVisible = false
    this.signInWithGoogle();
  }

  searchBarValue = '';
  autocompletes = [];

  search(){
    this.router.navigateByUrl('/search/' + this.searchBarValue)
  }

  checkFocus(){
    const tb = document.querySelector(".searchInput")
    if( tb === document.activeElement ){
      return true
    }
    else {
      return false
    }
  }

  autoCompleteFill(keyword){
    this.apollo
      .watchQuery({
        query: gql`
          query autocomplete($kword: String!) {
            autocomplete(kword: $kword)
          }
        `,
        variables: {
          kword: keyword
        }
      })
      .valueChanges.subscribe(result => {
        this.autocompletes = result.data.autocomplete
        if(!this.autocompletes){
          this.autocompletes = []
        }
      });
  }

  signInWithGoogle(){

    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);

    this.authService.authState.subscribe(user => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(this.user);



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
                  name,
                  profilepic,
                  subscribers,
                  subscribed,
                  likedvideos,
                  likedcomments,
                  disilikedvideos,
                  disilikedcomments,
                  channelart,
                  about,
                  day,
                  month,
                  year,
                  archivedplaylists,
                  premium,
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

            this.addToLocalStorage(res[0]);
            window.location.reload();
          });

      // console.log('asd')
    });


  }

  addToLocalStorage(user){
    this.users = []
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  getUserFromStorage(){
    this.users = JSON.parse(localStorage.getItem('users'));
    this.user = this.users[0];
    this.loggedIn = true;
    console.log(this.user)
  }

  removeUser(){
    window.localStorage.clear();
    this.loggedIn = false;
  }

  playlists = [];
  restPlaylist = [];

  openPlaylist = false;

  togglePlaylist(){
    this.openPlaylist = !this.openPlaylist
    console.log(this.openPlaylist)
    // console.log(this.restPlaylist)
    // console.log(this.restPlaylist && this.openPlaylist)
  }

  channelUserInfo;
  subbedChannel;
  restsubbedChannel = [];

  openSubs = false;

  toggleRestSubs(){
    this.openSubs = !this.openSubs
    // console.log(this.openPlaylist)
    // console.log(this.restPlaylist)
    // console.log(this.restPlaylist && this.openPlaylist)
  }

  ngOnInit(){
    // this.authService.renewTokens();
    // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    // this.removeUser()
    var pl;
    var arch;

    if(localStorage.getItem('users') == null){
      this.users = [];
    }
    else{
      this.getUserFromStorage();
      // console.log(this.user)
    }

    if(this.user)
    {
      this.apollo
        .watchQuery({
          query: gql`
            query userById($userid: String!){
              userById(userid: $userid){
                id,
                name,
                profilepic,
                subscribers,
                subscribed,
                likedvideos,
                likedcomments,
                disilikedvideos,
                disilikedcomments,
                channelart,
                about,
                day,
                month,
                year,
                archivedplaylists,
                premium,
              }
            }
          `,
          variables: {
            userid: this.user.id,
          }
        })
        .valueChanges.subscribe(result => {
          this.channelUserInfo = result.data.userById
          // console.log(this.channelUserInfo)
          this.channelUserInfo = this.channelUserInfo[0]
          // console.log(s[2])

          this.apollo
            .watchQuery({
              query: gql`
                query subs($id: String!) {
                  usersByIds(id: $id)
                  {
                    name,
                    profilepic,
                    id,
                  }
                }
              `,
              variables: {
                id: this.channelUserInfo.subscribed
              }
            })
            .valueChanges.subscribe(result => {
              this.subbedChannel = result.data.usersByIds
              console.log(this.subbedChannel)
              // console.log(this.channelUserInfo.subscribed)
              this.restsubbedChannel = [];
              while(this.subbedChannel.length > 10)
              {
                this.restsubbedChannel.unshift(this.subbedChannel.pop())
              }

              this.apollo
                .watchQuery({
                  query: gql`
                  query getPlaylistById($userid: String!){
                    playlistsByUser(userid: $userid, visibility: ""){
                      title,
                      id,
                    }
                  }
                  `,
                  variables: {
                    userid: this.user.id
                  }
                })
                .valueChanges.subscribe(result => {
                  pl = result.data.playlistsByUser
                  // console.log(this.playlists)
                  // console.log(this.user)

                  // console.log(this.channelUserInfo.archivedplaylists)
                  this.restPlaylist = []
                  this.apollo
                    .watchQuery({
                      query: gql`
                        query getArchived($ids: String!) {
                          getArchivedPlaylist(ids: $ids){
                            title,
                            id,
                          }
                        }
                      `,
                      variables: {
                        ids: this.channelUserInfo.archivedplaylists
                      }
                    })
                    .valueChanges.subscribe(result => {
                      arch = result.data.getArchivedPlaylist
                      // if(this.channelUserInfo.archivedplaylists != "")
                      // {
                      //   // console.log(result.data.getArchivedPlaylist[0])
                      //   this.playlists.unshift(result.data.getArchivedPlaylist[0])
                      // }
                      console.log(arch)
                      console.log(pl)
                      // this.playlist.append(arch)
                      // this.playlist =

                      this.playlists = pl.concat(arch)
                      // console.log(this.playlist)

                      while(this.playlists.length > 5){
                        this.restPlaylist.unshift(this.playlists.pop())
                      }

                      console.log(this.playlists);
                      console.log(this.restPlaylist);
                    })
                });


            })
          })


    }


    this.settingsVisible = false;
    this.menuVisible = false;
    this.reg = false;

    this.data.currentMessage.subscribe(showLogin => this.showLogin = showLogin)
    this.data.currentLogout.subscribe(showLogout => this.showLogout = showLogout)
    this.data.currentLocation.subscribe(onLocation => this.onLocation = onLocation)
    this.data.currentRestriction.subscribe(onRestriction => this.onRestriction = onRestriction)
    this.data.currentKeyboardModal.subscribe(showKeyboard => this.showKeyboard = showKeyboard)
    this.data.currentPage.subscribe(currentPage => this.currentPage = currentPage)
    this.data.currentShareModal.subscribe(showShareModal => this.showShareModal = showShareModal)
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
    // this.reg = false;
  }

  toggleLogout = () => {
    this.data.toggleLogoutModal(!this.showLogout);
    this.settingsVisible = false;
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
