/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = {
    /***/ "./node_modules/uuid/dist/cjs-browser/index.js":
      /*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/index.js ***!
  \*****************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.version = exports.validate = exports.v7 = exports.v6ToV1 = exports.v6 = exports.v5 = exports.v4 = exports.v3 = exports.v1ToV6 = exports.v1 = exports.stringify = exports.parse = exports.NIL = exports.MAX = void 0;\nvar max_js_1 = __webpack_require__(/*! ./max.js */ "./node_modules/uuid/dist/cjs-browser/max.js");\nObject.defineProperty(exports, "MAX", ({ enumerable: true, get: function () { return max_js_1.default; } }));\nvar nil_js_1 = __webpack_require__(/*! ./nil.js */ "./node_modules/uuid/dist/cjs-browser/nil.js");\nObject.defineProperty(exports, "NIL", ({ enumerable: true, get: function () { return nil_js_1.default; } }));\nvar parse_js_1 = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/cjs-browser/parse.js");\nObject.defineProperty(exports, "parse", ({ enumerable: true, get: function () { return parse_js_1.default; } }));\nvar stringify_js_1 = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/cjs-browser/stringify.js");\nObject.defineProperty(exports, "stringify", ({ enumerable: true, get: function () { return stringify_js_1.default; } }));\nvar v1_js_1 = __webpack_require__(/*! ./v1.js */ "./node_modules/uuid/dist/cjs-browser/v1.js");\nObject.defineProperty(exports, "v1", ({ enumerable: true, get: function () { return v1_js_1.default; } }));\nvar v1ToV6_js_1 = __webpack_require__(/*! ./v1ToV6.js */ "./node_modules/uuid/dist/cjs-browser/v1ToV6.js");\nObject.defineProperty(exports, "v1ToV6", ({ enumerable: true, get: function () { return v1ToV6_js_1.default; } }));\nvar v3_js_1 = __webpack_require__(/*! ./v3.js */ "./node_modules/uuid/dist/cjs-browser/v3.js");\nObject.defineProperty(exports, "v3", ({ enumerable: true, get: function () { return v3_js_1.default; } }));\nvar v4_js_1 = __webpack_require__(/*! ./v4.js */ "./node_modules/uuid/dist/cjs-browser/v4.js");\nObject.defineProperty(exports, "v4", ({ enumerable: true, get: function () { return v4_js_1.default; } }));\nvar v5_js_1 = __webpack_require__(/*! ./v5.js */ "./node_modules/uuid/dist/cjs-browser/v5.js");\nObject.defineProperty(exports, "v5", ({ enumerable: true, get: function () { return v5_js_1.default; } }));\nvar v6_js_1 = __webpack_require__(/*! ./v6.js */ "./node_modules/uuid/dist/cjs-browser/v6.js");\nObject.defineProperty(exports, "v6", ({ enumerable: true, get: function () { return v6_js_1.default; } }));\nvar v6ToV1_js_1 = __webpack_require__(/*! ./v6ToV1.js */ "./node_modules/uuid/dist/cjs-browser/v6ToV1.js");\nObject.defineProperty(exports, "v6ToV1", ({ enumerable: true, get: function () { return v6ToV1_js_1.default; } }));\nvar v7_js_1 = __webpack_require__(/*! ./v7.js */ "./node_modules/uuid/dist/cjs-browser/v7.js");\nObject.defineProperty(exports, "v7", ({ enumerable: true, get: function () { return v7_js_1.default; } }));\nvar validate_js_1 = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/cjs-browser/validate.js");\nObject.defineProperty(exports, "validate", ({ enumerable: true, get: function () { return validate_js_1.default; } }));\nvar version_js_1 = __webpack_require__(/*! ./version.js */ "./node_modules/uuid/dist/cjs-browser/version.js");\nObject.defineProperty(exports, "version", ({ enumerable: true, get: function () { return version_js_1.default; } }));\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/index.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/max.js":
      /*!***************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/max.js ***!
  \***************************************************/
      /***/ (__unused_webpack_module, exports) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports["default"] = \'ffffffff-ffff-ffff-ffff-ffffffffffff\';\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/max.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/md5.js":
      /*!***************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/md5.js ***!
  \***************************************************/
      /***/ (__unused_webpack_module, exports) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nfunction md5(bytes) {\n    const words = uint8ToUint32(bytes);\n    const md5Bytes = wordsToMd5(words, bytes.length * 8);\n    return uint32ToUint8(md5Bytes);\n}\nfunction uint32ToUint8(input) {\n    const bytes = new Uint8Array(input.length * 4);\n    for (let i = 0; i < input.length * 4; i++) {\n        bytes[i] = (input[i >> 2] >>> ((i % 4) * 8)) & 0xff;\n    }\n    return bytes;\n}\nfunction getOutputLength(inputLength8) {\n    return (((inputLength8 + 64) >>> 9) << 4) + 14 + 1;\n}\nfunction wordsToMd5(x, len) {\n    const xpad = new Uint32Array(getOutputLength(len)).fill(0);\n    xpad.set(x);\n    xpad[len >> 5] |= 0x80 << len % 32;\n    xpad[xpad.length - 1] = len;\n    x = xpad;\n    let a = 1732584193;\n    let b = -271733879;\n    let c = -1732584194;\n    let d = 271733878;\n    for (let i = 0; i < x.length; i += 16) {\n        const olda = a;\n        const oldb = b;\n        const oldc = c;\n        const oldd = d;\n        a = md5ff(a, b, c, d, x[i], 7, -680876936);\n        d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);\n        c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);\n        b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);\n        a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);\n        d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);\n        c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);\n        b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);\n        a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);\n        d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);\n        c = md5ff(c, d, a, b, x[i + 10], 17, -42063);\n        b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);\n        a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);\n        d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);\n        c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);\n        b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);\n        a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);\n        d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);\n        c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);\n        b = md5gg(b, c, d, a, x[i], 20, -373897302);\n        a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);\n        d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);\n        c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);\n        b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);\n        a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);\n        d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);\n        c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);\n        b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);\n        a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);\n        d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);\n        c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);\n        b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);\n        a = md5hh(a, b, c, d, x[i + 5], 4, -378558);\n        d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);\n        c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);\n        b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);\n        a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);\n        d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);\n        c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);\n        b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);\n        a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);\n        d = md5hh(d, a, b, c, x[i], 11, -358537222);\n        c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);\n        b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);\n        a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);\n        d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);\n        c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);\n        b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);\n        a = md5ii(a, b, c, d, x[i], 6, -198630844);\n        d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);\n        c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);\n        b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);\n        a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);\n        d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);\n        c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);\n        b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);\n        a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);\n        d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);\n        c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);\n        b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);\n        a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);\n        d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);\n        c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);\n        b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);\n        a = safeAdd(a, olda);\n        b = safeAdd(b, oldb);\n        c = safeAdd(c, oldc);\n        d = safeAdd(d, oldd);\n    }\n    return Uint32Array.of(a, b, c, d);\n}\nfunction uint8ToUint32(input) {\n    if (input.length === 0) {\n        return new Uint32Array();\n    }\n    const output = new Uint32Array(getOutputLength(input.length * 8)).fill(0);\n    for (let i = 0; i < input.length; i++) {\n        output[i >> 2] |= (input[i] & 0xff) << ((i % 4) * 8);\n    }\n    return output;\n}\nfunction safeAdd(x, y) {\n    const lsw = (x & 0xffff) + (y & 0xffff);\n    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);\n    return (msw << 16) | (lsw & 0xffff);\n}\nfunction bitRotateLeft(num, cnt) {\n    return (num << cnt) | (num >>> (32 - cnt));\n}\nfunction md5cmn(q, a, b, x, s, t) {\n    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);\n}\nfunction md5ff(a, b, c, d, x, s, t) {\n    return md5cmn((b & c) | (~b & d), a, b, x, s, t);\n}\nfunction md5gg(a, b, c, d, x, s, t) {\n    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);\n}\nfunction md5hh(a, b, c, d, x, s, t) {\n    return md5cmn(b ^ c ^ d, a, b, x, s, t);\n}\nfunction md5ii(a, b, c, d, x, s, t) {\n    return md5cmn(c ^ (b | ~d), a, b, x, s, t);\n}\nexports["default"] = md5;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/md5.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/native.js":
      /*!******************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/native.js ***!
  \******************************************************/
      /***/ (__unused_webpack_module, exports) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst randomUUID = typeof crypto !== \'undefined\' && crypto.randomUUID && crypto.randomUUID.bind(crypto);\nexports["default"] = { randomUUID };\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/native.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/nil.js":
      /*!***************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/nil.js ***!
  \***************************************************/
      /***/ (__unused_webpack_module, exports) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports["default"] = \'00000000-0000-0000-0000-000000000000\';\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/nil.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/parse.js":
      /*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/parse.js ***!
  \*****************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst validate_js_1 = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/cjs-browser/validate.js");\nfunction parse(uuid) {\n    if (!(0, validate_js_1.default)(uuid)) {\n        throw TypeError(\'Invalid UUID\');\n    }\n    let v;\n    return Uint8Array.of((v = parseInt(uuid.slice(0, 8), 16)) >>> 24, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff, (v = parseInt(uuid.slice(9, 13), 16)) >>> 8, v & 0xff, (v = parseInt(uuid.slice(14, 18), 16)) >>> 8, v & 0xff, (v = parseInt(uuid.slice(19, 23), 16)) >>> 8, v & 0xff, ((v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000) & 0xff, (v / 0x100000000) & 0xff, (v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff);\n}\nexports["default"] = parse;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/parse.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/regex.js":
      /*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/regex.js ***!
  \*****************************************************/
      /***/ (__unused_webpack_module, exports) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports["default"] = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/regex.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/rng.js":
      /*!***************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/rng.js ***!
  \***************************************************/
      /***/ (__unused_webpack_module, exports) => {
        eval(
          "\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nlet getRandomValues;\nconst rnds8 = new Uint8Array(16);\nfunction rng() {\n    if (!getRandomValues) {\n        if (typeof crypto === 'undefined' || !crypto.getRandomValues) {\n            throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');\n        }\n        getRandomValues = crypto.getRandomValues.bind(crypto);\n    }\n    return getRandomValues(rnds8);\n}\nexports[\"default\"] = rng;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/rng.js?",
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/sha1.js":
      /*!****************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/sha1.js ***!
  \****************************************************/
      /***/ (__unused_webpack_module, exports) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nfunction f(s, x, y, z) {\n    switch (s) {\n        case 0:\n            return (x & y) ^ (~x & z);\n        case 1:\n            return x ^ y ^ z;\n        case 2:\n            return (x & y) ^ (x & z) ^ (y & z);\n        case 3:\n            return x ^ y ^ z;\n    }\n}\nfunction ROTL(x, n) {\n    return (x << n) | (x >>> (32 - n));\n}\nfunction sha1(bytes) {\n    const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];\n    const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];\n    const newBytes = new Uint8Array(bytes.length + 1);\n    newBytes.set(bytes);\n    newBytes[bytes.length] = 0x80;\n    bytes = newBytes;\n    const l = bytes.length / 4 + 2;\n    const N = Math.ceil(l / 16);\n    const M = new Array(N);\n    for (let i = 0; i < N; ++i) {\n        const arr = new Uint32Array(16);\n        for (let j = 0; j < 16; ++j) {\n            arr[j] =\n                (bytes[i * 64 + j * 4] << 24) |\n                    (bytes[i * 64 + j * 4 + 1] << 16) |\n                    (bytes[i * 64 + j * 4 + 2] << 8) |\n                    bytes[i * 64 + j * 4 + 3];\n        }\n        M[i] = arr;\n    }\n    M[N - 1][14] = ((bytes.length - 1) * 8) / Math.pow(2, 32);\n    M[N - 1][14] = Math.floor(M[N - 1][14]);\n    M[N - 1][15] = ((bytes.length - 1) * 8) & 0xffffffff;\n    for (let i = 0; i < N; ++i) {\n        const W = new Uint32Array(80);\n        for (let t = 0; t < 16; ++t) {\n            W[t] = M[i][t];\n        }\n        for (let t = 16; t < 80; ++t) {\n            W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);\n        }\n        let a = H[0];\n        let b = H[1];\n        let c = H[2];\n        let d = H[3];\n        let e = H[4];\n        for (let t = 0; t < 80; ++t) {\n            const s = Math.floor(t / 20);\n            const T = (ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t]) >>> 0;\n            e = d;\n            d = c;\n            c = ROTL(b, 30) >>> 0;\n            b = a;\n            a = T;\n        }\n        H[0] = (H[0] + a) >>> 0;\n        H[1] = (H[1] + b) >>> 0;\n        H[2] = (H[2] + c) >>> 0;\n        H[3] = (H[3] + d) >>> 0;\n        H[4] = (H[4] + e) >>> 0;\n    }\n    return Uint8Array.of(H[0] >> 24, H[0] >> 16, H[0] >> 8, H[0], H[1] >> 24, H[1] >> 16, H[1] >> 8, H[1], H[2] >> 24, H[2] >> 16, H[2] >> 8, H[2], H[3] >> 24, H[3] >> 16, H[3] >> 8, H[3], H[4] >> 24, H[4] >> 16, H[4] >> 8, H[4]);\n}\nexports["default"] = sha1;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/sha1.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/stringify.js":
      /*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/stringify.js ***!
  \*********************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          "\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.unsafeStringify = void 0;\nconst validate_js_1 = __webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/cjs-browser/validate.js\");\nconst byteToHex = [];\nfor (let i = 0; i < 256; ++i) {\n    byteToHex.push((i + 0x100).toString(16).slice(1));\n}\nfunction unsafeStringify(arr, offset = 0) {\n    return (byteToHex[arr[offset + 0]] +\n        byteToHex[arr[offset + 1]] +\n        byteToHex[arr[offset + 2]] +\n        byteToHex[arr[offset + 3]] +\n        '-' +\n        byteToHex[arr[offset + 4]] +\n        byteToHex[arr[offset + 5]] +\n        '-' +\n        byteToHex[arr[offset + 6]] +\n        byteToHex[arr[offset + 7]] +\n        '-' +\n        byteToHex[arr[offset + 8]] +\n        byteToHex[arr[offset + 9]] +\n        '-' +\n        byteToHex[arr[offset + 10]] +\n        byteToHex[arr[offset + 11]] +\n        byteToHex[arr[offset + 12]] +\n        byteToHex[arr[offset + 13]] +\n        byteToHex[arr[offset + 14]] +\n        byteToHex[arr[offset + 15]]).toLowerCase();\n}\nexports.unsafeStringify = unsafeStringify;\nfunction stringify(arr, offset = 0) {\n    const uuid = unsafeStringify(arr, offset);\n    if (!(0, validate_js_1.default)(uuid)) {\n        throw TypeError('Stringified UUID is invalid');\n    }\n    return uuid;\n}\nexports[\"default\"] = stringify;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/stringify.js?",
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/v1.js":
      /*!**************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/v1.js ***!
  \**************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.updateV1State = void 0;\nconst rng_js_1 = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/cjs-browser/rng.js");\nconst stringify_js_1 = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/cjs-browser/stringify.js");\nconst _state = {};\nfunction v1(options, buf, offset) {\n    let bytes;\n    const isV6 = options?._v6 ?? false;\n    if (options) {\n        const optionsKeys = Object.keys(options);\n        if (optionsKeys.length === 1 && optionsKeys[0] === \'_v6\') {\n            options = undefined;\n        }\n    }\n    if (options) {\n        bytes = v1Bytes(options.random ?? options.rng?.() ?? (0, rng_js_1.default)(), options.msecs, options.nsecs, options.clockseq, options.node, buf, offset);\n    }\n    else {\n        const now = Date.now();\n        const rnds = (0, rng_js_1.default)();\n        updateV1State(_state, now, rnds);\n        bytes = v1Bytes(rnds, _state.msecs, _state.nsecs, isV6 ? undefined : _state.clockseq, isV6 ? undefined : _state.node, buf, offset);\n    }\n    return buf ?? (0, stringify_js_1.unsafeStringify)(bytes);\n}\nfunction updateV1State(state, now, rnds) {\n    state.msecs ??= -Infinity;\n    state.nsecs ??= 0;\n    if (now === state.msecs) {\n        state.nsecs++;\n        if (state.nsecs >= 10000) {\n            state.node = undefined;\n            state.nsecs = 0;\n        }\n    }\n    else if (now > state.msecs) {\n        state.nsecs = 0;\n    }\n    else if (now < state.msecs) {\n        state.node = undefined;\n    }\n    if (!state.node) {\n        state.node = rnds.slice(10, 16);\n        state.node[0] |= 0x01;\n        state.clockseq = ((rnds[8] << 8) | rnds[9]) & 0x3fff;\n    }\n    state.msecs = now;\n    return state;\n}\nexports.updateV1State = updateV1State;\nfunction v1Bytes(rnds, msecs, nsecs, clockseq, node, buf, offset = 0) {\n    if (rnds.length < 16) {\n        throw new Error(\'Random bytes length must be >= 16\');\n    }\n    if (!buf) {\n        buf = new Uint8Array(16);\n        offset = 0;\n    }\n    else {\n        if (offset < 0 || offset + 16 > buf.length) {\n            throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);\n        }\n    }\n    msecs ??= Date.now();\n    nsecs ??= 0;\n    clockseq ??= ((rnds[8] << 8) | rnds[9]) & 0x3fff;\n    node ??= rnds.slice(10, 16);\n    msecs += 12219292800000;\n    const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;\n    buf[offset++] = (tl >>> 24) & 0xff;\n    buf[offset++] = (tl >>> 16) & 0xff;\n    buf[offset++] = (tl >>> 8) & 0xff;\n    buf[offset++] = tl & 0xff;\n    const tmh = ((msecs / 0x100000000) * 10000) & 0xfffffff;\n    buf[offset++] = (tmh >>> 8) & 0xff;\n    buf[offset++] = tmh & 0xff;\n    buf[offset++] = ((tmh >>> 24) & 0xf) | 0x10;\n    buf[offset++] = (tmh >>> 16) & 0xff;\n    buf[offset++] = (clockseq >>> 8) | 0x80;\n    buf[offset++] = clockseq & 0xff;\n    for (let n = 0; n < 6; ++n) {\n        buf[offset++] = node[n];\n    }\n    return buf;\n}\nexports["default"] = v1;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/v1.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/v1ToV6.js":
      /*!******************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/v1ToV6.js ***!
  \******************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst parse_js_1 = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/cjs-browser/parse.js");\nconst stringify_js_1 = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/cjs-browser/stringify.js");\nfunction v1ToV6(uuid) {\n    const v1Bytes = typeof uuid === \'string\' ? (0, parse_js_1.default)(uuid) : uuid;\n    const v6Bytes = _v1ToV6(v1Bytes);\n    return typeof uuid === \'string\' ? (0, stringify_js_1.unsafeStringify)(v6Bytes) : v6Bytes;\n}\nexports["default"] = v1ToV6;\nfunction _v1ToV6(v1Bytes) {\n    return Uint8Array.of(((v1Bytes[6] & 0x0f) << 4) | ((v1Bytes[7] >> 4) & 0x0f), ((v1Bytes[7] & 0x0f) << 4) | ((v1Bytes[4] & 0xf0) >> 4), ((v1Bytes[4] & 0x0f) << 4) | ((v1Bytes[5] & 0xf0) >> 4), ((v1Bytes[5] & 0x0f) << 4) | ((v1Bytes[0] & 0xf0) >> 4), ((v1Bytes[0] & 0x0f) << 4) | ((v1Bytes[1] & 0xf0) >> 4), ((v1Bytes[1] & 0x0f) << 4) | ((v1Bytes[2] & 0xf0) >> 4), 0x60 | (v1Bytes[2] & 0x0f), v1Bytes[3], v1Bytes[8], v1Bytes[9], v1Bytes[10], v1Bytes[11], v1Bytes[12], v1Bytes[13], v1Bytes[14], v1Bytes[15]);\n}\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/v1ToV6.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/v3.js":
      /*!**************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/v3.js ***!
  \**************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.URL = exports.DNS = void 0;\nconst md5_js_1 = __webpack_require__(/*! ./md5.js */ "./node_modules/uuid/dist/cjs-browser/md5.js");\nconst v35_js_1 = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/cjs-browser/v35.js");\nvar v35_js_2 = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/cjs-browser/v35.js");\nObject.defineProperty(exports, "DNS", ({ enumerable: true, get: function () { return v35_js_2.DNS; } }));\nObject.defineProperty(exports, "URL", ({ enumerable: true, get: function () { return v35_js_2.URL; } }));\nfunction v3(value, namespace, buf, offset) {\n    return (0, v35_js_1.default)(0x30, md5_js_1.default, value, namespace, buf, offset);\n}\nv3.DNS = v35_js_1.DNS;\nv3.URL = v35_js_1.URL;\nexports["default"] = v3;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/v3.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/v35.js":
      /*!***************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/v35.js ***!
  \***************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          "\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.URL = exports.DNS = exports.stringToBytes = void 0;\nconst parse_js_1 = __webpack_require__(/*! ./parse.js */ \"./node_modules/uuid/dist/cjs-browser/parse.js\");\nconst stringify_js_1 = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/cjs-browser/stringify.js\");\nfunction stringToBytes(str) {\n    str = unescape(encodeURIComponent(str));\n    const bytes = new Uint8Array(str.length);\n    for (let i = 0; i < str.length; ++i) {\n        bytes[i] = str.charCodeAt(i);\n    }\n    return bytes;\n}\nexports.stringToBytes = stringToBytes;\nexports.DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';\nexports.URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';\nfunction v35(version, hash, value, namespace, buf, offset) {\n    const valueBytes = typeof value === 'string' ? stringToBytes(value) : value;\n    const namespaceBytes = typeof namespace === 'string' ? (0, parse_js_1.default)(namespace) : namespace;\n    if (typeof namespace === 'string') {\n        namespace = (0, parse_js_1.default)(namespace);\n    }\n    if (namespace?.length !== 16) {\n        throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');\n    }\n    let bytes = new Uint8Array(16 + valueBytes.length);\n    bytes.set(namespaceBytes);\n    bytes.set(valueBytes, namespaceBytes.length);\n    bytes = hash(bytes);\n    bytes[6] = (bytes[6] & 0x0f) | version;\n    bytes[8] = (bytes[8] & 0x3f) | 0x80;\n    if (buf) {\n        offset = offset || 0;\n        for (let i = 0; i < 16; ++i) {\n            buf[offset + i] = bytes[i];\n        }\n        return buf;\n    }\n    return (0, stringify_js_1.unsafeStringify)(bytes);\n}\nexports[\"default\"] = v35;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/v35.js?",
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/v4.js":
      /*!**************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/v4.js ***!
  \**************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst native_js_1 = __webpack_require__(/*! ./native.js */ "./node_modules/uuid/dist/cjs-browser/native.js");\nconst rng_js_1 = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/cjs-browser/rng.js");\nconst stringify_js_1 = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/cjs-browser/stringify.js");\nfunction v4(options, buf, offset) {\n    if (native_js_1.default.randomUUID && !buf && !options) {\n        return native_js_1.default.randomUUID();\n    }\n    options = options || {};\n    const rnds = options.random ?? options.rng?.() ?? (0, rng_js_1.default)();\n    if (rnds.length < 16) {\n        throw new Error(\'Random bytes length must be >= 16\');\n    }\n    rnds[6] = (rnds[6] & 0x0f) | 0x40;\n    rnds[8] = (rnds[8] & 0x3f) | 0x80;\n    if (buf) {\n        offset = offset || 0;\n        if (offset < 0 || offset + 16 > buf.length) {\n            throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);\n        }\n        for (let i = 0; i < 16; ++i) {\n            buf[offset + i] = rnds[i];\n        }\n        return buf;\n    }\n    return (0, stringify_js_1.unsafeStringify)(rnds);\n}\nexports["default"] = v4;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/v4.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/v5.js":
      /*!**************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/v5.js ***!
  \**************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.URL = exports.DNS = void 0;\nconst sha1_js_1 = __webpack_require__(/*! ./sha1.js */ "./node_modules/uuid/dist/cjs-browser/sha1.js");\nconst v35_js_1 = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/cjs-browser/v35.js");\nvar v35_js_2 = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/cjs-browser/v35.js");\nObject.defineProperty(exports, "DNS", ({ enumerable: true, get: function () { return v35_js_2.DNS; } }));\nObject.defineProperty(exports, "URL", ({ enumerable: true, get: function () { return v35_js_2.URL; } }));\nfunction v5(value, namespace, buf, offset) {\n    return (0, v35_js_1.default)(0x50, sha1_js_1.default, value, namespace, buf, offset);\n}\nv5.DNS = v35_js_1.DNS;\nv5.URL = v35_js_1.URL;\nexports["default"] = v5;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/v5.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/v6.js":
      /*!**************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/v6.js ***!
  \**************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst stringify_js_1 = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/cjs-browser/stringify.js");\nconst v1_js_1 = __webpack_require__(/*! ./v1.js */ "./node_modules/uuid/dist/cjs-browser/v1.js");\nconst v1ToV6_js_1 = __webpack_require__(/*! ./v1ToV6.js */ "./node_modules/uuid/dist/cjs-browser/v1ToV6.js");\nfunction v6(options, buf, offset) {\n    options ??= {};\n    offset ??= 0;\n    let bytes = (0, v1_js_1.default)({ ...options, _v6: true }, new Uint8Array(16));\n    bytes = (0, v1ToV6_js_1.default)(bytes);\n    if (buf) {\n        for (let i = 0; i < 16; i++) {\n            buf[offset + i] = bytes[i];\n        }\n        return buf;\n    }\n    return (0, stringify_js_1.unsafeStringify)(bytes);\n}\nexports["default"] = v6;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/v6.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/v6ToV1.js":
      /*!******************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/v6ToV1.js ***!
  \******************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst parse_js_1 = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/cjs-browser/parse.js");\nconst stringify_js_1 = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/cjs-browser/stringify.js");\nfunction v6ToV1(uuid) {\n    const v6Bytes = typeof uuid === \'string\' ? (0, parse_js_1.default)(uuid) : uuid;\n    const v1Bytes = _v6ToV1(v6Bytes);\n    return typeof uuid === \'string\' ? (0, stringify_js_1.unsafeStringify)(v1Bytes) : v1Bytes;\n}\nexports["default"] = v6ToV1;\nfunction _v6ToV1(v6Bytes) {\n    return Uint8Array.of(((v6Bytes[3] & 0x0f) << 4) | ((v6Bytes[4] >> 4) & 0x0f), ((v6Bytes[4] & 0x0f) << 4) | ((v6Bytes[5] & 0xf0) >> 4), ((v6Bytes[5] & 0x0f) << 4) | (v6Bytes[6] & 0x0f), v6Bytes[7], ((v6Bytes[1] & 0x0f) << 4) | ((v6Bytes[2] & 0xf0) >> 4), ((v6Bytes[2] & 0x0f) << 4) | ((v6Bytes[3] & 0xf0) >> 4), 0x10 | ((v6Bytes[0] & 0xf0) >> 4), ((v6Bytes[0] & 0x0f) << 4) | ((v6Bytes[1] & 0xf0) >> 4), v6Bytes[8], v6Bytes[9], v6Bytes[10], v6Bytes[11], v6Bytes[12], v6Bytes[13], v6Bytes[14], v6Bytes[15]);\n}\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/v6ToV1.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/v7.js":
      /*!**************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/v7.js ***!
  \**************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.updateV7State = void 0;\nconst rng_js_1 = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/cjs-browser/rng.js");\nconst stringify_js_1 = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/cjs-browser/stringify.js");\nconst _state = {};\nfunction v7(options, buf, offset) {\n    let bytes;\n    if (options) {\n        bytes = v7Bytes(options.random ?? options.rng?.() ?? (0, rng_js_1.default)(), options.msecs, options.seq, buf, offset);\n    }\n    else {\n        const now = Date.now();\n        const rnds = (0, rng_js_1.default)();\n        updateV7State(_state, now, rnds);\n        bytes = v7Bytes(rnds, _state.msecs, _state.seq, buf, offset);\n    }\n    return buf ?? (0, stringify_js_1.unsafeStringify)(bytes);\n}\nfunction updateV7State(state, now, rnds) {\n    state.msecs ??= -Infinity;\n    state.seq ??= 0;\n    if (now > state.msecs) {\n        state.seq = (rnds[6] << 23) | (rnds[7] << 16) | (rnds[8] << 8) | rnds[9];\n        state.msecs = now;\n    }\n    else {\n        state.seq = (state.seq + 1) | 0;\n        if (state.seq === 0) {\n            state.msecs++;\n        }\n    }\n    return state;\n}\nexports.updateV7State = updateV7State;\nfunction v7Bytes(rnds, msecs, seq, buf, offset = 0) {\n    if (rnds.length < 16) {\n        throw new Error(\'Random bytes length must be >= 16\');\n    }\n    if (!buf) {\n        buf = new Uint8Array(16);\n        offset = 0;\n    }\n    else {\n        if (offset < 0 || offset + 16 > buf.length) {\n            throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);\n        }\n    }\n    msecs ??= Date.now();\n    seq ??= ((rnds[6] * 0x7f) << 24) | (rnds[7] << 16) | (rnds[8] << 8) | rnds[9];\n    buf[offset++] = (msecs / 0x10000000000) & 0xff;\n    buf[offset++] = (msecs / 0x100000000) & 0xff;\n    buf[offset++] = (msecs / 0x1000000) & 0xff;\n    buf[offset++] = (msecs / 0x10000) & 0xff;\n    buf[offset++] = (msecs / 0x100) & 0xff;\n    buf[offset++] = msecs & 0xff;\n    buf[offset++] = 0x70 | ((seq >>> 28) & 0x0f);\n    buf[offset++] = (seq >>> 20) & 0xff;\n    buf[offset++] = 0x80 | ((seq >>> 14) & 0x3f);\n    buf[offset++] = (seq >>> 6) & 0xff;\n    buf[offset++] = ((seq << 2) & 0xff) | (rnds[10] & 0x03);\n    buf[offset++] = rnds[11];\n    buf[offset++] = rnds[12];\n    buf[offset++] = rnds[13];\n    buf[offset++] = rnds[14];\n    buf[offset++] = rnds[15];\n    return buf;\n}\nexports["default"] = v7;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/v7.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/validate.js":
      /*!********************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/validate.js ***!
  \********************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst regex_js_1 = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/cjs-browser/regex.js");\nfunction validate(uuid) {\n    return typeof uuid === \'string\' && regex_js_1.default.test(uuid);\n}\nexports["default"] = validate;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/validate.js?',
        );

        /***/
      },

    /***/ "./node_modules/uuid/dist/cjs-browser/version.js":
      /*!*******************************************************!*\
  !*** ./node_modules/uuid/dist/cjs-browser/version.js ***!
  \*******************************************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst validate_js_1 = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/cjs-browser/validate.js");\nfunction version(uuid) {\n    if (!(0, validate_js_1.default)(uuid)) {\n        throw TypeError(\'Invalid UUID\');\n    }\n    return parseInt(uuid.slice(14, 15), 16);\n}\nexports["default"] = version;\n\n\n//# sourceURL=webpack://term-project-14-uno/./node_modules/uuid/dist/cjs-browser/version.js?',
        );

        /***/
      },

    /***/ "./src/client/Player.ts":
      /*!******************************!*\
  !*** ./src/client/Player.ts ***!
  \******************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst uuid_1 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/cjs-browser/index.js");\nclass Player {\n    constructor(id, username, index, isSystemPlayer = false) {\n        this.uuid = (0, uuid_1.v4)();\n        this.userId = id;\n        this.username = username;\n        this.index = index;\n        this.hand = [];\n        this.isSystemPlayer = isSystemPlayer;\n    }\n}\nexports["default"] = Player;\n\n\n//# sourceURL=webpack://term-project-14-uno/./src/client/Player.ts?',
        );

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__,
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/
  /******/ // startup
  /******/ // Load entry module and return exports
  /******/ // This entry module can't be inlined because the eval devtool is used.
  /******/ var __webpack_exports__ = __webpack_require__(
    "./src/client/Player.ts",
  );
  /******/
  /******/
})();
