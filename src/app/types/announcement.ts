import { Data } from "@angular/router";
import { Timestamp } from "firebase/firestore";

export interface Announcement {
    importance:'high'|'medium'|'low';
    subject:string;
    team:string;
    place:string;
    date:Timestamp;
    note:string;
    agree:number;
    dissagree:number;
    id:string
}
