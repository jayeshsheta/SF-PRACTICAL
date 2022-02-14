import { Component, OnInit } from '@angular/core';
import { User } from '@/_models';
import {  AuthenticationService } from '@/_services';
import { Router} from '@angular/router';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: User;
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,

    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
       // this.loadAllUsers();
    }

    editUser() {
        this.router.navigate(['/edit']);
    }

    // deleteUser(id: number) {
    //     this.userService.delete(id)
    //         .pipe(first())
    //         .subscribe(() => this.loadAllUsers());
    // }

    // private loadAllUsers() {
    //     this.userService.getAll()
    //         .pipe(first())
    //         .subscribe(users => this.users = users);
    // }
}