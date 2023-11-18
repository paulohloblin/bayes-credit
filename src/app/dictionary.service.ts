import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  // for example:
  // {
  //   "loan_status": [
  //   "статус кредиту",
  //   {
  //     "0": "Кредит погашений",
  //     "1": "Дефолт"
  //   }
  //   ],
  // }
  private dictionary: Record<string, [string, Record<string, string>]> = {}

  constructor(private httpService: HttpService) {
    this.httpService.getDictionary().subscribe((data) => {
      this.dictionary = data as Record<string, [string, Record<string, string>]>;
    });
  }

  translate(variable: string, state:string = ''): string {
    if (state === '') {
      let result = this.dictionary[variable][0];
      return result === undefined ? variable : result;
    } else {
      let result = this.dictionary[variable][1][state];
      return result === undefined ? state : result;
    }
  }

}
