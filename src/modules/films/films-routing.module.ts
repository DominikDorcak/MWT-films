import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FilmsMenuComponent } from "./films-menu/films-menu.component";
import { FilmEditComponent } from "./film-edit/film-edit.component";
import { FilmsListComponent } from "./films-list/films-list.component";
import { FilmDetailComponent } from "./film-detail/film-detail.component";
import {UserResolverService} from "../../guards/user-resolver.service";
import {FilmResolverService} from "../../guards/film-resolver.service";

const routes: Routes = [
  {
    path: "",
    component: FilmsMenuComponent,
    children: [
      { path: "edit/:id", component: FilmEditComponent },
      {
        path: "",
        component: FilmsListComponent
        // children: [{ path: ":id", component: FilmDetailComponent }]
      }
    ]
  },
  {
    path: "detail/:id",
    component: FilmDetailComponent,
    resolve: {
      film: FilmResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule {}
