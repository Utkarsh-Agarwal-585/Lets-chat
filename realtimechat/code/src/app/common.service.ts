import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public authStatus = false;
  public baseUrl='http://demo7905412.mockable.io/';
  //public apiUrl = 'http://localhost:3004/api/signup';
  constructor(
    private http: HttpClient
  ) {
    this.checkAuth();
   }

  // eslint-disable-next-line @typescript-eslint/ban-types
  authenticate(param: object){
    return this.http.post(this.baseUrl + 'login', param);
  }

  doHttpGet(destination: string){
    return this.http.get(this.baseUrl + destination);
  }

  checkAuth(){
    console.log(localStorage.getItem('authentication'));
    if(localStorage.getItem('authentication') === 'true'){
      this.authStatus=true;
      return true;
    }else{
      return false;
    }
  }
  // api(param: object){
  //   return this.http.post(this.apiUrl, param);
  // }
 

}
