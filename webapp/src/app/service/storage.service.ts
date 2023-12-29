import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  //private storage: Storage;


  constructor() {
    //this.storage = localStorage;
   }


  setItem(key: string, value: any): boolean {
    /**if (this.storage) {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    }**/
    return false;
  }

  getItem(key: string): any {
    /**if (this.storage) {
      let item = this.storage.getItem(key);
      if (item === null){
        return null
      } else {
        return JSON.parse(item);
      }  
    }**/
    return null;
  }


}
