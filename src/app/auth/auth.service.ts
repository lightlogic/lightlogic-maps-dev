import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL;

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };

    this.http
      .post(BACKEND_URL + '/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post(BACKEND_URL + '/user/login', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
