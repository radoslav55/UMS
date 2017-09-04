import {Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';



export function MockServerHttpHandler(backend: MockBackend, options: BaseRequestOptions) {

    backend.connections.subscribe((connection: MockConnection) => {

        const baseUrl = 'http://localhost:4200/';

        const urlPath = connection.request.url.replace(baseUrl, '');
        const urlSegments = urlPath.split('/');

        const loginUser = {
            username: 'root',
            password: 'abc123'
        };

        if (localStorage.getItem('db.userRoleRelations') === null) {

            localStorage.setItem('db.userRoleRelations', JSON.stringify([
                {
                    userId: 1,
                    roleId: 2
                },
                {
                    userId: 1,
                    roleId: 3
                },
                {
                    userId: 2,
                    roleId: 4
                },
            ]));
        }

        const users = [
            {uuid: 1, displayName: "John", status: 1},
            {uuid: 2, displayName: "Tom", status: 1},
            {uuid: 3, displayName: "Rob", status: 1},
            {uuid: 4, displayName: "David", status: 1},
        ];
        const roles = [
            {uuid: 1, name: "Owner"},
            {uuid: 2, name: "Administrator"},
            {uuid: 3, name: "Editor"},
            {uuid: 4, name: "User"},
        ];


        const userRoleRelations = JSON.parse(localStorage.getItem('db.userRoleRelations'));

        function getHateoasObject(object) {

            for (let i in object) {

                object[i]['links'] = [{
                    'rel': 'self',
                    'href': baseUrl + 'api/users/' + object[i].uuid
                }]
            }

            return object;
        }


        // wrap in timeout to simulate server api call
        setTimeout(() => {

            if (connection.request.url.endsWith('/oauth/token') && connection.request.method === RequestMethod.Post) {

                let params = JSON.parse(connection.request.getBody());

                if (params.username == loginUser.username && params.password == loginUser.password) {

                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            status: 200, body: {
                                token: 'fake-jwt-token',
                                status: 'error'
                            }
                        })
                    ));
                }
                else {

                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            status: 200, body: {
                                status: 'error'
                            }
                        })
                    ));
                }
            }

            else if (connection.request.url.endsWith('/api')) {

                if (connection.request.headers.get('Authorization') === 'fake-jwt-token') {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            status: 200, body: {
                                links: [
                                    {
                                        rel: 'ims:users',
                                        href: baseUrl + 'api/users'
                                    },
                                    {
                                        rel: 'ims:roles',
                                        href: baseUrl + 'api/roles'
                                    }
                                ]
                            }
                        })
                    ));
                } else {
                    connection.mockRespond(new Response(
                        new ResponseOptions({status: 401})
                    ));
                }
            }

            else if (connection.request.url.endsWith('/api/users')) {

                connection.mockRespond(new Response(
                    new ResponseOptions({
                        status: 200, body: getHateoasObject(users)
                    })
                ))
            }

            else if (connection.request.url.endsWith('/api/roles')) {

                connection.mockRespond(new Response(
                    new ResponseOptions({
                        status: 200, body: getHateoasObject(roles)
                    })
                ))
            }

            else if (urlPath.match("api\/users\/[1-9]\/roles\/[1-9]") && connection.request.method === RequestMethod.Delete) {


                localStorage.setItem('db.userRoleRelations', JSON.stringify(userRoleRelations.filter(e => e.userId != parseInt(urlSegments[2]) || e.roleId != parseInt(urlSegments[4]))));

                connection.mockRespond(new Response(
                    new ResponseOptions({
                        status: 204
                    })
                ));

            }

            else if (urlPath.match("api\/users\/[1-9]\/roles")) {

                let userId = parseInt(urlSegments[2]);

                if (connection.request.method === RequestMethod.Post) {

                    let roles = JSON.parse(connection.request.getBody());

                    for (let roleId of roles) {

                        userRoleRelations.push({
                            userId: userId,
                            roleId: parseInt(roleId)
                        });
                    }

                    localStorage.setItem('db.userRoleRelations', JSON.stringify(userRoleRelations));

                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            status: 204
                        })
                    ));
                }
                else {

                    var roleIds = [];

                    for (let userRoleRelation of userRoleRelations) {

                        if (userRoleRelation.userId == userId) {

                            roleIds.push(userRoleRelation.roleId);
                        }
                    }

                    var responseRoles = roles.filter(function (e) {
                        return roleIds.includes(e.uuid)
                    });

                    for (let role of responseRoles) {

                        role['links'] = [{
                            rel: 'self',
                            href: baseUrl + 'api/users/' + userId + '/roles/' + role.uuid
                        }]
                    }

                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            status: 200, body: responseRoles
                        })
                    ));
                }



            }

            else if (urlPath.match("api\/users\/[1-9]")) {


                let userId = parseInt(urlSegments[2]);

                let response = users.filter(e => e.uuid == userId)[0];

                response['links'] = [{
                    rel: 'ims:user-roles',
                    href: baseUrl + 'api/users/' + userId + '/roles'
                }];

                connection.mockRespond(new Response(
                    new ResponseOptions({
                        status: 200, body: response
                    })
                ));
            }



        }, 5);

    });

    return new Http(backend, options);
}

export let mockServerProvider = {

    provide: Http,
    useFactory: MockServerHttpHandler,
    deps: [MockBackend, BaseRequestOptions]
};
