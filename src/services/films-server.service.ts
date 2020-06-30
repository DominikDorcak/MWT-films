import { Injectable } from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import { Film } from "src/entities/film";
import {EMPTY, Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import { UsersServerService } from "./users-server.service";
import {TokenExpiredLogout} from "../shared/auth.actions";
import {SnackbarService} from "./snackbar.service";
import {Store} from "@ngxs/store";

@Injectable({
  providedIn: "root"
})
export class FilmsServerService {
  url = "http://localhost:8080/films";

  constructor(
    private http: HttpClient,
    private usersServerService: UsersServerService,
    private snackbarService: SnackbarService,
    private store: Store
  ) {}

  get token() {
    return this.usersServerService.token;
  }

  private getHeader(): {
    headers?: { "X-Auth-Token": string };
    params?: HttpParams;
  } {
    return this.token ? { headers: { "X-Auth-Token": this.token } } : undefined;
  }

  getFilms(
    indexFrom?: number,
    indexTo?: number,
    search?: string,
    orderBy?: string,
    descending?: boolean
  ): Observable<FilmsResponse> {
    let httpOptions = this.getHeader();
    if (indexFrom || indexTo || search || orderBy || descending) {
      httpOptions = { ...(httpOptions || {}), params: new HttpParams() };
    }
    if (indexFrom) {
      httpOptions.params = httpOptions.params.set("indexFrom", "" + indexFrom);
    }
    if (indexTo) {
      httpOptions.params = httpOptions.params.set("indexTo", "" + indexTo);
    }
    if (search) {
      httpOptions.params = httpOptions.params.set("search", search);
    }
    if (orderBy) {
      httpOptions.params = httpOptions.params.set("orderBy", orderBy);
    }
    if (descending) {
      httpOptions.params = httpOptions.params.set(
        "descending",
        "" + descending
      );
    }
    return this.http
      .get<FilmsResponse>(this.url, httpOptions)
      .pipe(catchError(error => this.processHttpError(error)));
  }

  getFilm(id: number){
    let httpOptions = this.getHeader();
    return this.http.get<Film>(this.url + "/" + id,httpOptions)
      .pipe(catchError(error => this.processHttpError(error)));
  }

  private processHttpError(error) {
    if (error instanceof HttpErrorResponse) {
      this.httpErrorToMessage(error);
      return EMPTY;
    }
    return throwError(error);
  }

  private httpErrorToMessage(error: HttpErrorResponse): void {
    console.log(JSON.stringify(error));
    if (error.status === 0) {
      this.snackbarService.errorMessage("Server unreachable");
      return;
    }
    if (error.status >= 400 && error.status < 500) {
      const message = error.error.errorMessage
        ? error.error.errorMessage
        : JSON.parse(error.error).errorMessage;

      if (error.status === 401 && message == "unknown token") {
        this.store.dispatch(new TokenExpiredLogout());
        this.snackbarService.errorMessage("Session timeout");
        return;
      }
      this.snackbarService.errorMessage(message);
      return;
    }
    this.snackbarService.errorMessage("server error: " + error.message);
  }
}


export interface FilmsResponse {
  items: Film[];
  totalCount: number;
}
