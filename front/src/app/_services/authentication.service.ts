import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    register(user) {
        return this.http.post<any>(`${config.apiUrl}/register`, user);
    }

    updateUser(user) {
        return this.http.post<any>(`${config.apiUrl}/updateUser`, user).pipe(map(data => {
            if(data.result)
            {
                localStorage.setItem('currentUser', JSON.stringify(data.data));
                this.currentUserSubject.next(data.data);
            }
            return data;
        }));
    }

    login(email, password) {
        return this.http.post<any>(`${config.apiUrl}/login`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if(user.result)
                {
                    localStorage.setItem('currentUser', JSON.stringify(user.data));
                    this.currentUserSubject.next(user.data);
                }
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
    getUser()
    {

    }
}