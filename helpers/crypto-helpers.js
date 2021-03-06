const random = require('random-bigint');

function generatePrime(maxBits) {
	let n;
	do {
		n = random(maxBits);
		n = 2n * n - 1n;
	} while (!isPrime(n));

	return n;
}

function isPrime(n) {
    const primes = [
        2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n,
        73n, 79n, 83n, 89n, 97n, 101n, 103n, 107n, 109n, 113n, 127n, 131n, 137n, 139n, 149n, 151n, 157n, 163n, 167n, 173n,
        179n, 181n, 191n, 193n, 197n, 199n, 211n, 223n, 227n, 229n, 233n, 239n, 241n, 251n, 257n, 263n, 269n, 271n, 277n, 281n,
        283n, 293n, 307n, 311n, 313n, 317n, 331n, 337n, 347n, 349n, 353n, 359n, 367n, 373n, 379n, 383n, 389n, 397n, 401n, 409n,
        419n, 421n, 431n, 433n, 439n, 443n, 449n, 457n, 461n, 463n, 467n, 479n, 487n, 491n, 499n, 503n, 509n, 521n, 523n, 541n
    ];

    for (const p of primes) {
        if (n % p == 0) {
            return n == p;
        }
    }

    const r = 20;
    return rabinMiller(n, r);
}

function rabinMiller(n, r) {
    let b = n - 1n;
    let k = -1;
    let binary = [];

    do {
        k += 1;
        binary.push(b % 2n);
        b /= 2n;
    } while (b > 0n)

    for (let j = 0; j < r; j++) {
        a = randomIntFromInterval(2, Number.MAX_VALUE);
        let euclid = extendedEuclid(a, n);

        if (euclid[0] > 1n)
            return false;

        var d = 1n;

        for (let i = k; i >= 0; i--) {
            let x = d;

            d = (d * d) % n;

            if ((d == 1) && (x != 1n) && (x != (n - 1n)))
                return false;
            if (binary[i] == 1n) {
                d = (d * a) % n;
            }
        }

        if (d != 1) {
            return false;
        }
    }

    return true;
}

function modExp(a, b, n) {
    let x;
    if (b == 0n)
        return 1n;

    if (b % 2n == 0n) {
        x = modExp(a, b/2n, n);
        return (x * x) % n;
    }

    x = modExp(a, (b - 1n)/2n, n);
    x = (x * x) % n;
    return (a * x) % n;
}

function randomIntFromInterval(min, max) {
    const int = Math.floor(Math.random() * (max - min + 1) + min)
    return BigInt(int);
}

function extendedEuclid(a, b) {
    if (b == 0n)
        return [a, 1n, 0n];

    let d, xm, ym;
    [d, xm, ym] = extendedEuclid(b, a % b);

    const x = ym;
    const y = xm - (a/b) * ym;
    return [d, x, y];
}

function getCountBitsOfNumber (number) {
    let count = 0;
    while (number > 0n) {
        number = number >> 1n;
        count++;
    }
    return count;
}

function getRandomBigInt (bigIntMax) {
    const maxValueBits = getCountBitsOfNumber(bigIntMax);

    return random(maxValueBits);
}

function getRandomInt (min = 0, max = Number.MAX_SAFE_INTEGER) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
	extendedEuclid,
	randomIntFromInterval,
	modExp,
	rabinMiller,
	isPrime,
	generatePrime,
    getCountBitsOfNumber,
    getRandomBigInt,
    getRandomInt,
}
