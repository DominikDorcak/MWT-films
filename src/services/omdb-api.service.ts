import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UsersServerService} from "./users-server.service";
import {Observable} from "rxjs";
import {IMovie} from "../entities/IMovie";

@Injectable({
  providedIn: 'root'
})

export class OmdbApiService {


  apikey = "e482cf58"
  url = "http://www.omdbapi.com/"

  constructor(private http: HttpClient) {
  }


  getMovie(title:string):Observable<IMovie> {
    return this.http.get<IMovie>(this.url,{
      params:{
        apikey:this.apikey,
        t: title
      }
    })
  }

}


