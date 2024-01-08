import { User } from '../model/User';


export interface InputFile {
    id:number
    name: string;
    description: string;
    file_name: string;
    file_key:string;
    lock_key:number;
    user: User;
    status: string;
    summary:string;
    transcript: string;
}