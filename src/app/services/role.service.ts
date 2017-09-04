import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';

import {User} from '../models/User';

import 'rxjs/add/operator/toPromise';
import {Role} from "../models/Role";

@Injectable()
export class RoleService {

    constructor(private http: Http) {
    }

    getRoles(): Promise<Role[]> {

        return this.http.get('/api', this.jwt())
            .toPromise()
            .then((response: Response) => {

                if(response.status == 200){

                    for (let link of response.json().links) {

                        if (link.rel == 'ims:roles') {

                            return this.http.get(link.href)
                                .toPromise()
                        }
                    }
                }
                else{

                    alert('Something went wrong');
                }

            })
            .then(response => response.json() as Role[])
    }


    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    private jwt() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}
