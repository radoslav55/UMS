import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';

import {User} from '../models/User';

import 'rxjs/add/operator/toPromise';
import {Role} from "app/models/Role";

@Injectable()
export class UserService {

    constructor(private http: Http) {}

    getUsers(): Promise<User[]> {

        return this.http.get('/api', this.jwt())
            .toPromise()
            .then((response: Response) => {

                if (response.status == 200) {
                    for (let link of response.json().links) {

                        if (link.rel == 'ims:users') {

                            return this.http.get(link.href)
                                .toPromise()
                        }
                    }
                }
                else {

                    alert('Something went wrong');
                }

            })
            .then((response: Response) => {


                var promises = [];

                for (let user of response.json()) {

                    promises.push(this.getUserRoles(user));
                }

                return Promise.all(promises);
            })
            .then(response => response as User[])
    }

    getUserRoles(userObject): Promise<any> {

        let userLink = userObject.links.find(function (a) {
            return a.rel == 'self'
        }).href;

        return this.http.get(userLink, this.jwt())
            .toPromise()
            .then((response: Response) => {

                let rolesLink = response.json().links.find(function (a) {
                    return a.rel == 'ims:user-roles'
                }).href;

                return this.http.get(rolesLink, this.jwt())
                    .toPromise();

            })
            .then((response: Response) => {

                userObject.roles = response.json();

                return userObject;
            })

    }

    hasUserRole(user, roleId): boolean {

        for (let role of user.roles) {

            if (role.uuid == roleId) {

                return true;
            }
        }

        return false;
    }

    addRoles(user: User, roles: Role[]): Promise<Response> {

        return this.http.get(user.links.filter(e => e.rel == 'self')[0].href, this.jwt())
            .toPromise()
            .then((response: Response) => response.json().links.filter(e => e.rel == 'ims:user-roles'))
            .then(response => {

                let url = response.filter(e => e.rel == 'ims:user-roles')[0].href;

                return this.http.post(url, roles)
                    .toPromise()
            })
    }

    removeRole(user: User, role: Role): Promise<Response> {

        return this.http.get(user.links.find(e => e.rel == 'self').href, this.jwt())
            .toPromise()
            .then((response: Response) => response.json().links.find(e => e.rel == 'ims:user-roles'))
            .then(response => {

                return this.http.get(response.href)
                    .toPromise()
            })
            .then((response: Response) => {

                return this.http.delete(response.json().find(e => e.uuid == role.uuid).links.find(e => e.rel == 'self').href)
                    .toPromise()
            })
    }


    private jwt() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({'Authorization': currentUser.token});
            return new RequestOptions({headers: headers});
        }
    }
}
