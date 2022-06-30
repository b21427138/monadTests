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
 *  5. bind2(Wrapped<T>, t1: TransformFunction, t2: TransformFunction, t3, ...): Wrapped<T>
 *      all transform functions are taken as parameters and all of them are applied one by one
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
 * 2. WrapperFunction: String -> Array<String> (s: String) { return [ s ] } bracket notation in javascript creates list
 * 3. TransformFunction: transform1(s: String): Array<String>
 * 4. bind(Array<String>, transform1): Array<String>
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
function bindChainA(initialArray) {
    var allTransformFunctions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        allTransformFunctions[_i - 1] = arguments[_i];
    }
    var ret = initialArray;
    var _loop_1 = function (currentTransformFunction) {
        ret = ret.flatMap(function (item) { return currentTransformFunction(item); });
    };
    // Apply all transform functions one by one
    for (var _a = 0, allTransformFunctions_1 = allTransformFunctions; _a < allTransformFunctions_1.length; _a++) {
        var currentTransformFunction = allTransformFunctions_1[_a];
        _loop_1(currentTransformFunction);
    }
    return ret;
}
console.log("bind2A('start2', transformA1): ".concat(bindChainA(['start2'], transformA1)));
console.log("bind2A('start2', transformA1, transformA2): ".concat(bindChainA(['start2'], transformA1, transformA2)));
console.log("bind2A('start2', transformA1, transformA2, transformA3): ".concat(bindChainA(['start2'], transformA1, transformA2, transformA3)));
/**
 * Example B: Optional as monad.
 * 0. Raw Type: number
 * 1. Wrapped Type: MaybeInteger
 * 2. WrapperFunction: number -> MayBeInteger
 * 3. TransformFunction: transform1(s: number): MaybeInteger
 * 4. bindB(Maybe<number>, transform1): MaybeInteger
 * 5. bindChainB(MaybeInteger, ...allTransformFunctions: Array<s: number => MayBeInteger>): MaybeInteger
 */
var MaybeInteger = /** @class */ (function () {
    function MaybeInteger(n) {
        if (!Number.isInteger(n)) {
            this.isInteger = false;
        }
        else {
            this.isInteger = true;
            this.value = n;
        }
    }
    MaybeInteger.prototype.toString = function () {
        return 'MayBeInteger of ' + this.value + ' ';
    };
    return MaybeInteger;
}());
function wrapper(n) {
    if (!Number.isInteger(n))
        return new MaybeInteger(undefined);
    return new MaybeInteger(n);
}
function unwrapper(n) {
    return n.value;
}
function add1(n) {
    if (!Number.isInteger(n))
        return new MaybeInteger(undefined);
    return wrapper(n + 1);
}
function multiplyBy2(n) {
    if (!Number.isInteger(n))
        return new MaybeInteger(undefined);
    return wrapper(n * 2);
}
function divideBy2(n) {
    if (!Number.isInteger(n) || !Number.isInteger(n / 2))
        return new MaybeInteger(undefined);
    return wrapper(n / 2);
}
function divideBy3(n) {
    if (!Number.isInteger(n) || !Number.isInteger(n / 3))
        return new MaybeInteger(undefined);
    return wrapper(n / 3);
}
function bindB(mn, transformFunction) {
    if (mn === undefined)
        return new MaybeInteger(undefined);
    return transformFunction(unwrapper(mn));
}
function bindChainB(mn) {
    var allTransformFunctions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        allTransformFunctions[_i - 1] = arguments[_i];
    }
    var ret = mn;
    for (var _a = 0, allTransformFunctions_2 = allTransformFunctions; _a < allTransformFunctions_2.length; _a++) {
        var currentTransformFunction = allTransformFunctions_2[_a];
        if (ret === undefined)
            return new MaybeInteger(undefined);
        ret = currentTransformFunction(unwrapper(ret));
    }
    return ret;
}
var n1 = wrapper(8), n2 = wrapper(3.14);
console.log("".concat(n1, " -> add1 -> multiplyBy2 =  ").concat(bindB(bindB(n1, add1), multiplyBy2)));
console.log("".concat(n2, " -> add1 =  ").concat(bindB(n2, add1)));
console.log("".concat(n1, " -> add1 -> divideBy2 = ").concat(bindB(bindB(n1, add1), divideBy2)));
console.log("".concat(n1, " -> add1 -> divideBy3 = ").concat(bindB(bindB(n1, add1), divideBy3)));
console.log("bindChainB(".concat(n1, ", add1, multiplyBy2) = ").concat(bindChainB(n1, add1, multiplyBy2)));
console.log("bindChainB(".concat(n2, ", add1, multiplyBy2) = ").concat(bindChainB(n2, add1, multiplyBy2)));
console.log("bindChainB(".concat(n1, ", add1, multiplyBy2, divideBy3, divideBy2) = ").concat(bindChainB(n1, add1, multiplyBy2, divideBy3, divideBy2)));
