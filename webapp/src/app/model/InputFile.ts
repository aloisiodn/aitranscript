import { User } from '../model/User';


export interface InputFile {
    name: string;
    description: string;
    file_name: string;
    file_key:string;
    user: User;
    status: string;
    transcript: string;
    summary:string;
}