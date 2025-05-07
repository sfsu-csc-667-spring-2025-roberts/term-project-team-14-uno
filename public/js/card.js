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
    /***/ "./src/client/Card.ts":
      /*!****************************!*\
  !*** ./src/client/Card.ts ***!
  \****************************/
      /***/ (__unused_webpack_module, exports) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.CardType = exports.Color = void 0;\nclass Card {\n    constructor(value, img, color, type) {\n        this.value = value;\n        this.img = img;\n        this.color = color;\n        this.type = type;\n    }\n    equals(other) {\n        return (this.value === other.value &&\n            this.img === other.img &&\n            this.color === other.color &&\n            this.type === other.type);\n    }\n}\nvar Color;\n(function (Color) {\n    Color["BLUE"] = "BLUE";\n    Color["RED"] = "RED";\n    Color["YELLOW"] = "YELLOW";\n    Color["GREEN"] = "GREEN";\n})(Color || (exports.Color = Color = {}));\nvar CardType;\n(function (CardType) {\n    CardType["REGULAR"] = "REGULAR";\n    CardType["REVERSE"] = "REVERSE";\n    CardType["SKIP"] = "SKIP";\n    CardType["DRAW"] = "DRAW";\n    CardType["WILD"] = "WILD";\n})(CardType || (exports.CardType = CardType = {}));\nexports["default"] = Card;\n\n\n//# sourceURL=webpack://term-project-14-uno/./src/client/Card.ts?',
        );

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/
  /******/ // startup
  /******/ // Load entry module and return exports
  /******/ // This entry module can't be inlined because the eval devtool is used.
  /******/ var __webpack_exports__ = {};
  /******/ __webpack_modules__["./src/client/Card.ts"](0, __webpack_exports__);
  /******/
  /******/
})();
