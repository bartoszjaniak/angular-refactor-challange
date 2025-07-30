import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs'
import { User } from 'app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  /// TODO: Move to environment variable
  private apiURL = 'http://localhost:9333/users';

  constructor(private http: HttpClient) { }

  getUsers(filter?: string, page?: number, pageSize?: number, sort?: string): Observable<{users: User[], total: number}> {
    const url = new URL(this.apiURL);
   
    if (filter) url.searchParams.append('filter', filter);
    if (page) url.searchParams.append('page', page.toString());
    if (pageSize) url.searchParams.append('pageSize', pageSize.toString());
    if (sort) url.searchParams.append('sort', sort);

    return this.http.get<{results: User[], total: number}>(url.toString()).pipe(
      map(res => ({ users: res.results, total: res.total }))
    );
  }

  getUser(id: string) {
    return this.http.get<User>(`${this.apiURL}/${id}`)
  }
}
