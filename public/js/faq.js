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
    /***/ "./src/client/faq.ts":
      /*!***************************!*\
  !*** ./src/client/faq.ts ***!
  \***************************/
      /***/ () => {
        eval(
          '\ndocument.addEventListener("DOMContentLoaded", () => {\n    const questions = document.querySelectorAll(".faq-question");\n    questions.forEach((btn) => {\n        btn.addEventListener("click", () => {\n            const answer = btn.nextElementSibling;\n            if (answer.style.maxHeight) {\n                // Collapse answer\n                answer.style.maxHeight = "";\n                answer.classList.remove("open");\n            }\n            else {\n                // Expand answer\n                answer.style.maxHeight = answer.scrollHeight + "px";\n                answer.classList.add("open");\n            }\n        });\n    });\n});\n\n\n//# sourceURL=webpack://term-project-14-uno/./src/client/faq.ts?',
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
  /******/ __webpack_modules__["./src/client/faq.ts"]();
  /******/
  /******/
})();
