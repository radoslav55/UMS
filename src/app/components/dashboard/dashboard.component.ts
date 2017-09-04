import {Component, OnInit} from "@angular/core";
import {UserService} from "../../services/user.service";
import {User} from "../../models/User";
import {Role} from "../../models/Role";
import {RoleService} from "../../services/role.service";

import {} from 'jquery';
import {} from 'bootstrap';

@Component({
    selector: 'app-dashboard',
    styleUrls: [
        './dashboard.component.css'
    ],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    users: User[];
    roles: Role[];

    currUser: User;

    constructor(public userService: UserService, private roleServie: RoleService) {
    }


    ngOnInit() {

        this.getUsers();
        this.getRoles();
    }

    getUsers(): void {

        this.userService.getUsers().then(users => {
            this.users = users
        });

    }

    getRoles(): void {

        this.roleServie.getRoles().then(roles => {
            this.roles = roles
        })
    }

    addRole(user: User): void {

        this.currUser = user;

        $('#roleSelectorModal').find('.modal-body .btn.active').removeClass('active');

        $('#roleSelectorModal').modal('show');
    }

    addRoles(){

        let newRoles = [];

        $('#roleSelectorModal .modal-body').find('.btn.active').each(function(){

            newRoles.push(parseInt($(this).attr('roleId')));

        });


        this.userService.addRoles(this.currUser, newRoles).then(response => {

            if(response.status == 204){

                this.currUser.roles = this.currUser.roles.concat(this.roles.filter(function(e){

                    return newRoles.includes(e.uuid);
                }));

                $('#roleSelectorModal').modal('hide');
            }

        })




    }


    removeRole(user, role){

        if(confirm("Are you sure you want to remove this role?")){

            this.userService.removeRole(user, role).then(response => {
                if(response.status == 204){

                    this.users.find(e => e.uuid == user.uuid).roles.splice(user.roles.indexOf(role), 1);
                }
                else{

                    alert('Something went wrong, please, try again later');
                }
            })
        }


    }

}
