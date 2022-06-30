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

function transformA1(s: string): Array<string> {
    return [s + ' 🍎', s + ' 🍏'];
}

function transformA2(s: string): Array<string> {
    return [s + ' 😄', s + ' 😍', s + ' 😛'];
}

function transformA3(s: string): Array<string> {
    return [s + ' 🇹🇷', s + ' 🇺🇸', s + ' 🇩🇪'];
}


function bindA(startArray: Array<string>, transformFunction: ((s: string) => Array<string>)): Array<string> {
    let ret = startArray.map(str => transformFunction(str));
    return ret.flat();
}

const startArray = ["start"];
console.log('start -> transformA1');
console.log(bindA(startArray, transformA1));

console.log("start -> transformA1 -> transformA2 -> transformA3");
console.log(
    bindA(
        bindA(
            bindA(startArray, transformA1),
            transformA2
        ),
        transformA3
    )
);

function bindChainA(initialArray: Array<string>, ...allTransformFunctions: Array<((s: string) => Array<string>)>) {
    let ret = initialArray;

    // Apply all transform functions one by one
    for (const currentTransformFunction of allTransformFunctions) {
        ret = ret.flatMap(item => currentTransformFunction(item));
    }

    return ret;
}

console.log(`bind2A('start2', transformA1): ${bindChainA(['start2'], transformA1)}`)
console.log(`bind2A('start2', transformA1, transformA2): ${bindChainA(['start2'], transformA1, transformA2)}`)
console.log(`bind2A('start2', transformA1, transformA2, transformA3): ${bindChainA(['start2'], transformA1, transformA2, transformA3)}`)


/**
 * Example B: Optional as monad.
 * 0. Raw Type: number
 * 1. Wrapped Type: MaybeInteger
 * 2. WrapperFunction: number -> MayBeInteger
 * 3. TransformFunction: transform1(s: number): MaybeInteger
 * 4. bindB(Maybe<number>, transform1): MaybeInteger
 * 5. bindChainB(MaybeInteger, ...allTransformFunctions: Array<s: number => MayBeInteger>): MaybeInteger
 */

class MaybeInteger {
    constructor(n: number | undefined) {
        if (!Number.isInteger(n)) {
            this.isInteger = false;
        }
        else {
            this.isInteger = true;
            this.value = n as number;
        }
    }

    isInteger: boolean;
    value?: number;
    toString() {
        return 'MayBeInteger of ' + this.value + ' ';
    }
}

function wrapper(n: number): MaybeInteger {
    if (!Number.isInteger(n)) return new MaybeInteger(undefined);
    return new MaybeInteger(n);
}

function unwrapper(n: MaybeInteger): number {
    return n.value as number;
}

function add1(n: number): MaybeInteger {
    if (!Number.isInteger(n))
        return new MaybeInteger(undefined);
    return wrapper(n + 1);
}

function multiplyBy2(n: number): MaybeInteger {
    if (!Number.isInteger(n))
        return new MaybeInteger(undefined);
    return wrapper(n * 2);
}

function divideBy2(n: number): MaybeInteger {
    if (!Number.isInteger(n) || !Number.isInteger(n / 2))
        return new MaybeInteger(undefined);
    return wrapper(n / 2);
}

function divideBy3(n: number): MaybeInteger {
    if (!Number.isInteger(n) || !Number.isInteger(n / 3))
        return new MaybeInteger(undefined);
    return wrapper(n / 3);
}


function bindB(mn: MaybeInteger, transformFunction: ((n: number) => MaybeInteger)): MaybeInteger {
    if (mn === undefined)
        return new MaybeInteger(undefined);
    return transformFunction(unwrapper(mn));
}

function bindChainB(mn: MaybeInteger, ...allTransformFunctions: Array<((n: number) => MaybeInteger)>): MaybeInteger {
    let ret = mn;
    for (const currentTransformFunction of allTransformFunctions) {
        if (ret === undefined)
            return new MaybeInteger(undefined);
        ret = currentTransformFunction(unwrapper(ret));
    }
    return ret;
}


let n1 = wrapper(8), n2 = wrapper(3.14);
console.log(`${n1} -> add1 -> multiplyBy2 =  ${bindB(bindB(n1, add1), multiplyBy2)}`);
console.log(`${n2} -> add1 =  ${bindB(n2, add1)}`);

console.log(`${n1} -> add1 -> divideBy2 = ${bindB(bindB(n1, add1), divideBy2)}`)
console.log(`${n1} -> add1 -> divideBy3 = ${bindB(bindB(n1, add1), divideBy3)}`)

console.log(`bindChainB(${n1}, add1, multiplyBy2) = ${bindChainB(n1, add1, multiplyBy2)}`);
console.log(`bindChainB(${n2}, add1, multiplyBy2) = ${bindChainB(n2, add1, multiplyBy2)}`);
console.log(`bindChainB(${n1}, add1, multiplyBy2, divideBy3, divideBy2) = ${bindChainB(n1, add1, multiplyBy2, divideBy3, divideBy2)}`);



/**
 * Example C: Logger Monad
 * 0. Raw Type: T2
 * 1. Wrapped Type: loggedValue interface which is {log: string, value: T2}
 * 2. WrapperFunction: (T1 => T2) -> ( T1 => { log: string, value: T2})
 * 3. TransformFunction: transform1(f: T1 => T2): T1 => { log: string, value: T2}
 * 4. bindC(WrappedType, transform1): WrappedType
 * 5. bindChainC(WrappedType, ...allTransformFunctions: Array<f: TransformFunction>): WrappedType
 */

interface loggedValue<T2> {
    value: T2,
    log: string
}

function wrap<T>(x: T) {
    return {
        value: x,
        log: ""
    }
}

function transform1(x: string): loggedValue<string> {
    return {
        log: `${x} toFixed(3) is used`,
        value: Number.parseFloat(x).toFixed(3)
    };
}

function transform2(x: string): loggedValue<string> {
    return {
        log: `${x} toExponential(5) is used`,
        value: Number.parseFloat(x).toExponential(5)
    }
}

function bindC<T1, T2>(a: loggedValue<T1>, f: ((x: T1) => loggedValue<T2>)) {
    return {
        value: f(a.value).value,
        log: a.log.concat(f(a.value).log).concat(" \n ")
    } as loggedValue<T2>;
}

console.log(wrap(987));
console.log(transform1('555'));

console.log(bindC(wrap('12.34'), transform1));
console.log(bindC(wrap('12.34'), transform2));
console.log(bindC(
    bindC(wrap('12.34'), transform2)
    , transform1));