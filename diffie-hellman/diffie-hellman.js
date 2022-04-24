const random = require('random-bigint');
const { generatePrime, isPrime, modExp } = require('../helpers/crypto-helpers');

 const getCountBitsOfNumber = (number) => {
    let count = 0;
    while (number > 0n) {
        number = number >> 1n;
        count++;
    }
    return count;
}

function generateG(upperLimit) {
    let g, n, p, q;
    q = generatePrime(256);
    do {
        n = random(upperLimit);
        p = n * q + 1n;
    } while (!(isPrime(p)));

    let pBits = getCountBitsOfNumber(p);
    do {
        a = random(pBits - 1);
        g = modExp(a, n, p);
    } while (g === 1n);

    return { g, q, p };
}

function diffieHellman(g, x, q, p) {
    let xMod = x % q;
    return modExp(g, xMod, p);
}

module.exports = {
    generateG,
    diffieHellman
}