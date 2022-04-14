export class Util {
    public static get_random_inclusive(_min, _max) {
        _min = Math.ceil(_min);
        _max = Math.floor(_max);
        return Math.floor(Math.random() * (_max - _min + 1)) + _min;
    }
}