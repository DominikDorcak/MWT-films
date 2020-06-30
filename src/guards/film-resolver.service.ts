import { Injectable } from '@angular/core';
import {Film} from "../entities/film";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {FilmsServerService} from "../services/films-server.service";

@Injectable({
  providedIn: 'root'
})
export class FilmResolverService implements Resolve<Film>{

  constructor(private  filmsService : FilmsServerService)   { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Film> | Promise<Film> | Film {
    return this.filmsService.getFilm(parseInt(route.paramMap.get("id")));
  }
}
