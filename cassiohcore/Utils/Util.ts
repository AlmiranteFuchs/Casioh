export class Util {
  public static get_random_inclusive(_min: number, _max: number) {
    _min = Math.ceil(_min);
    _max = Math.floor(_max);
    return Math.floor(Math.random() * (_max - _min + 1)) + _min;
  }
}
