import Planets from './Planets';

export default class Store {
  planets = new Planets();

  rehydrate(store) {
    return true;
  }
}
