import Planets from './Planets';

export default class Store {
  planets = new Planets();

  rehydrate() {
    return true;
  }
}
