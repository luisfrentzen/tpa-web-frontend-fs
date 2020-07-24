import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {

  constructor(private apollo : Apollo) { }

  plan = "monthly"

  users = [];
  user;
  isPrem = false;

  nextbillday;
  nextbillmonth;
  nextbillyear;

  getPremium(){

    if(!this.user){
      return;
    }
        this.apollo
          .mutate({
            mutation : gql`
              mutation makeMembership($id: String!, $subType: String!) {
              	makeUserPremium(id: $id, subType: $subType)
                {
                  name
                }
              }
            `,
            variables: {
              id: this.currentUserInfo.id,
              subType: this.plan
            }
          }).subscribe(({ data }) => {
        console.log('got data', data);
        window.location.reload();
      },(error) => {
        console.log(this.playlist)
        // console.log(typeof this.uploadedVideo)
        console.log('there was an error sending the query', error);
      })
  }

  currentUserInfo;

  ngOnInit(): void {
    if(localStorage.getItem('users') == null){
      this.users = [];
      this.curUserId = "";
      this.isPrem = false;

    }
    else{
      this.users = JSON.parse(localStorage.getItem('users'));
      this.user = this.users[0];
      // this.loggedIn = true;
      this.curUserId = this.user.id;
      console.log('premi')
      this.apollo.watchQuery({
        query: gql`
          query getById($userid: String!){
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
              premium,
              premiday,
              premiyear,
              premimonth,
              premitype,
            }
          }
        `,
        variables: {
          userid: this.curUserId,
        }
      })
      .valueChanges.subscribe(result => {
        this.currentUserInfo = result.data.userById
        this.currentUserInfo = this.currentUserInfo[0]

        this.isPrem = (this.currentUserInfo.premium == 'yes' ? true : false)
        console.log(this.isPrem)

        if(this.currentUserInfo.premitype == "yearly"){
          this.nextbillday = this.currentUserInfo.premiday;
          this.nextbillmonth = this.currentUserInfo.premimonth
          this.nextbillyear = this.currentUserInfo.premiyear + 1
        }
        else {
          this.nextbillday = this.currentUserInfo.premiday
          this.nextbillmonth = this.currentUserInfo.premimonth + 1
          this.nextbillyear = this.currentUserInfo.premiyear
          if ( this.nextbillmonth > 12 ){
            this.nextbillmonth -= 12;
            this.nextbillyear += 1;
          }
        }

      })
    }
  }

}
