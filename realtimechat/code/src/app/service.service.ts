import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions={
  // eslint-disable-next-line @typescript-eslint/naming-convention
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl='https://i0iji8tlwh.execute-api.ap-south-1.amazonaws.com/search-transaction';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  [x: string]: any;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  products: any;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  categories: any;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor(public http: HttpClient) {
    }
    getCategory(data: any){
      console.log('getcategory');
      return this.http.post(apiUrl,data);
    }

}


