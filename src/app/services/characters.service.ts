import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  public url: string;
  private page = 1;
  public load: boolean = false;
  public urlBD: string;

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.API_URL;
    this.urlBD = 'https://inventario-prendas-default-rtdb.firebaseio.com';
  }

  get params() {
    return {
      page: this.page.toString()
    }
  }

  getCharacters(): Observable<any> {
    this.load = true;
    return this.http.get<any>(`${this.url}people/?page=`, { params: this.params }).pipe(
      tap(() => {
        this.page += 1;
        this.load = false;
      })
    );
  }

  like(personaje: any) {
    return this.http.post(`${this.urlBD}/tablero/tareas.json`, personaje);
  }

  getLikes(): Observable<any> {
    return this.http.get(`${this.urlBD}/tablero/tareas.json`).
      pipe(
        map(this.crearArreglo));
  }

  deleteLike(id: string): Observable<any> {
    return this.http.delete(`${this.urlBD}/tablero/tareas/${id}.json`)
  }

  private crearArreglo(charactersObj: any) {
    const character: any[] = [];
    if (charactersObj === null) return [];
    Object.keys(charactersObj).forEach(key => {
      const personaje: any = charactersObj[key];
      personaje.id = key;
      character.push(personaje);
    })
    return character;
  }
}
