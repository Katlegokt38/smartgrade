import { GetUserDetailsService } from './services/get-user-details.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  showAdmin = false;
  showStudent = false;
  showEducator = false;

  email: string;
  isAuthenticated: boolean;

  role: [Number];
  isUser: boolean;

  private token: string;
  private baseUrl = 'http://localhost:8080';

  constructor(public oktaAuth: OktaAuthService, public router: Router, public http: HttpClient,
    private getUserDetailsService: GetUserDetailsService) {
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);

  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    this.isUser = false;
    if (this.isAuthenticated) {
        const userClaims = await this.oktaAuth.getUser();
        this.email = userClaims.email;
        this.isAuthenticated = false;

        const accessToken = await this.oktaAuth.getAccessToken();
        

        this.http.post(`${this.baseUrl}` + `/user/token`, {
        params: {
          user : this.email
        }
      }).subscribe((data: any) => {

        const header = (data.token) ? {Authorization: `Bearer ${data.token}`} : undefined;
        this.http.get(`${this.baseUrl}` + `/user/getUserDetails`, {
          headers : header,
        params: {
          user : this.email
        }
      })
      .subscribe((data: any) => {
        data['email'] = this.email;
        this.getUserDetailsService.setUserDetails(data);
        Object.keys(data).forEach((key) => {

          if (data[key].roleType == 'Admin') {
            this.showAdmin = true;
          } else if (data[key].roleType == 'Educator') {
            this.showEducator = true;
          } else if (data[key].roleType == 'Student') {
            this.showStudent = true;
          }
      });

        if (data != null) {
          this.isUser = true;
        }
        this.isAuthenticated = this.isUser;

        }, (err) => {
          console.error(err);
        });
      })


        // console.log(this.showStudent);

    } else {
      this.router.navigateByUrl('/logginerror');
    }
  }

  admin() {
    this.router.navigateByUrl('/admin');
  }

 async logout() {
    await this.oktaAuth.logout();

  }
}
