import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private apollo : Apollo, private route : ActivatedRoute, private router : Router) { }

  videos;
  playlists;
  channels;


  ngOnInit(): void {
    const passedSearch = this.route.snapshot.paramMap.get('keyword');
    console.log(passedSearch)
    this.apollo
      .watchQuery({
        query: gql`
          query search($kword: String!) {
            searchPlaylist(kword: $kword){
              title,
              id,
              videos,
              desc,
              userid,
            }
          }
        `,
        variables: {
          kword: passedSearch,
        }
      })
      .valueChanges.subscribe(result => {
        this.playlists = result.data.searchPlaylist
        console.log(this.playlists)
      })

      this.apollo
        .watchQuery({
          query: gql`
            query search($kword: String!) {
              searchVideo(kword: $kword){
                id,
                title,
                url,
                thumbnail,
                userid,
                channelpic,
                channelname,
                view,
                day,
                month,
                year,
                premium,
                desc,
              }
            }
          `,
          variables: {
            kword: passedSearch,
          }
        })
        .valueChanges.subscribe(result => {
          this.videos = result.data.searchVideo
          console.log(this.videos)
        })

        this.apollo
          .watchQuery({
            query: gql`
              query search($kword: String!) {
                searchChannel(kword: $kword){
                  id,
                  name,
                  profilepic,
                  subscribers,
                  about,
                }
              }
            `,
            variables: {
              kword: passedSearch,
            }
          })
          .valueChanges.subscribe(result => {
            this.channels = result.data.searchChannel
            console.log(this.channels)
          })
  }

}
