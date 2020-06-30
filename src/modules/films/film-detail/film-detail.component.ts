import { Component, OnInit } from '@angular/core';
import {OmdbApiService} from "../../../services/omdb-api.service";
import {IMovie} from "../../../entities/IMovie";
import {Film} from "../../../entities/film";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent implements OnInit {
  public film: Film = undefined
  public imovie: IMovie = undefined
  t

  constructor(private omdbService: OmdbApiService,
              private route: ActivatedRoute){
  }


  ngOnInit(): void {
    this.film = this.route.snapshot.data.film
    this.omdbService.getMovie(this.film.nazov).subscribe(data => {
      this.imovie = data

    });
  }

}
