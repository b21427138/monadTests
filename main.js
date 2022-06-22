/**
 * Reference: https://www.youtube.com/watch?v=C2w45qRc3aU
 * 4 concepts:
 *  0. Generic raw type: T
 *  1. Wrapper Type: Wrapper<T> this is type in monadic land.
 *  2. Wrap Function (unit): takes raw type T and convert into wrapped type Wrapper<T>. Used when a raw type enters monad land.
 *  3. Transform Function : Takes a raw type T does some stuff and returns a wrapped type.
 *  4. Monadic run (bind or flatMap): Takes Wrapped<T> and transform function and returns a Wrapped<T>
 *
 *  0. Generic Raw Type: T
 *  1. Wrapped Type:  Wrapped<T>
 *  2. WrapperFunction: T -> Wrapped<T>
 *  3. TransformFunction: T -> Wrapped<T>
 *  4. bind(Wrapped<T>, TransformFunction): Wrapped<T>
 *
 * Monad Example 1: List<T>.
 * Monad Example 2: Logger<T>
 * Monad Example 3: Optional<T>
 * Monad Example 4: Promise<T>
 */
/**
 * Example A: List as monads.
 * 0. Raw Type: String
 * 1. Wrapped Type: Array<String>
 * 2. WrapperFunction: String -> Array<String> (s: String) { return [ s: String ] } bracket notation in javascript creates list
 * 3. TransformFunction: transform1(s: String): Array<String> (s: String) { return [ s + '🍎', s + '🍏'] }
 * 4. bind(Array<String>, transform1): Array<String> (as: Array<String>, transform1) { }
 */
function transformA1(s) {
    return [s + ' 🍎', s + ' 🍏'];
}
function transformA2(s) {
    return [s + ' 😄', s + ' 😍', s + ' 😛'];
}
function transformA3(s) {
    return [s + ' 🇹🇷', s + ' 🇺🇸', s + ' 🇩🇪'];
}
function bindA(startArray, transformFunction) {
    var ret = startArray.map(function (str) { return transformFunction(str); });
    return ret.flat();
}
var startArray = ["start"];
console.log('start -> transformA1');
console.log(bindA(startArray, transformA1));
console.log("start -> transformA1 -> transformA2 -> transformA3");
console.log(bindA(bindA(bindA(startArray, transformA1), transformA2), transformA3));
function wrapper(n) {
    return n;
}
function add1(n) {
    if (n === null || !Number.isInteger(n))
        return null;
    return n + 1;
}
function multiplyBy2(n) {
    if (n === null || !Number.isInteger(n))
        return null;
    return n * 2;
}
function divideBy2(n) {
    if (n === null || !Number.isInteger(n) || !Number.isInteger(n / 2))
        return null;
    return n / 2;
}
function bindB(mn, transformFunction) {
    if (mn === null)
        return null;
    return transformFunction(mn);
}
var n1 = 8, n2 = 1.2;
console.log("".concat(n1, " -> add1 =  ").concat(bindB(n1, add1)));
console.log("".concat(n1, " -> multiplyBy2 =  ").concat(bindB(n1, multiplyBy2)));
console.log("".concat(n1, " -> add1 -> multiplyBy2 =  ").concat(bindB(bindB(n1, add1), multiplyBy2)));
console.log("".concat(n2, " -> add1 =  ").concat(bindB(n2, add1)));
console.log("".concat(n1, " -> add1 -> divideBy2 = ").concat(bindB(bindB(n1, add1), divideBy2)));
