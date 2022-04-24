const random = require('random-bigint');
const { generatePrime, isPrime, modExp, getCountBitsOfNumber } = require('../helpers/crypto-helpers');

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