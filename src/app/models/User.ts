import {Role} from "app/models/Role";
import {Link} from "./Link";

export class User{

    uuid: number;
    displayName: string;
    status: number;
    roles: Role[];
    links: Link[];
}
