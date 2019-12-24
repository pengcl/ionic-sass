import {Injectable} from '@angular/core';
import {DATA} from '../utils/cities';
import {getIndex} from '../utils/utils';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    loading;

    constructor() {
    }

    provinces() {
        return DATA;
    }

    cities(province) {
        console.log(province);
        const index = getIndex(DATA, 'name', province);
        return DATA[index].sub;
    }

    districts(province, city) {
      let index = getIndex(DATA, 'name', province);
      const cities = DATA[index].sub;
      index = getIndex(cities, 'name', city);

      return cities[index].sub;
    }
}
