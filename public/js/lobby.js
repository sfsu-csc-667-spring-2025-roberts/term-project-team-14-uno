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
    /***/ "./src/client/lobby.ts":
      /*!*****************************!*\
  !*** ./src/client/lobby.ts ***!
  \*****************************/
      /***/ function () {
        eval(
          '\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nconsole.log("hello world");\nconst userId = generateRandomId();\ndocument.querySelector(".start").addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {\n    const res = yield fetch("/api/game/join", {\n        method: "post",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify({ userId }),\n    });\n    const resJson = yield res.json();\n    if (!resJson.success) {\n        console.log("error");\n    }\n    window.location.href = `/game?gid=${resJson.gid}&pid=${userId}`;\n}));\n// replace with cookie/auth system\nfunction generateRandomId() {\n    return Math.floor(10000000 + Math.random() * 90000000).toString();\n}\n\n\n//# sourceURL=webpack://term-project-14-uno/./src/client/lobby.ts?',
        );

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/
  /******/ // startup
  /******/ // Load entry module and return exports
  /******/ // This entry module is referenced by other modules so it can't be inlined
  /******/ var __webpack_exports__ = {};
  /******/ __webpack_modules__["./src/client/lobby.ts"]();
  /******/
  /******/
})();
