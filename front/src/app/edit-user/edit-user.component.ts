import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '@/_services';
import { User } from '@/_models/user';

@Component({ templateUrl: 'edit-user.component.html' })
export class EditUserComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    currentUser: User;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            first_name: [this.currentUser.first_name, Validators.required],
            last_name: [this.currentUser.last_name, Validators.required],
            email: [this.currentUser.email, [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.updateUser(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.loading = false;
                    if (data.result) {
                        this.alertService.success('Update successful', true);
                        this.router.navigate(['/']);
                    }
                    else {
                        this.alertService.error(data.msg);

                    }

                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
