import { Component, OnInit } from "@angular/core";
import { Auth } from "src/entities/auth";
import { UsersServerService } from "src/services/users-server.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  auth: Auth = new Auth();
  hide = true;

  constructor(
    private usersServerService: UsersServerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  get vypisAuth() {
    return JSON.stringify(this.auth);
  }

  formSubmit() {
    this.usersServerService.login(this.auth).subscribe(
      ok => {
        if (ok) {
          console.log("Napojil som sa!! Huraaaa!");
          this.router.navigateByUrl("/users");
        } else {
          console.log("Zly login alebo heslo");
        }
      },
      error => {
        console.log("iná chyba:" + JSON.stringify(error));
      }
    );
  }
}
