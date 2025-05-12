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
      /***/ function (__unused_webpack_module, exports) {
        eval(
          '\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nconst username = generateRandomId();\ndocument.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {\n    const container = document.querySelector(".join-game");\n    if (!container) {\n        return;\n    }\n    const res = yield fetch("/api/game/open-games");\n    const resJson = yield res.json();\n    console.log(resJson);\n    for (let game of resJson) {\n        const card = document.createElement("div");\n        card.classList.add("game-card");\n        card.innerHTML = `\n      <div class="game-info">\n        <p><strong>Game ID:</strong> ${game.game_id}</p>\n        <p><strong>Players:</strong> ${game.num_players}</p>\n        <p><strong>State:</strong> ${game.state}</p>\n        <p><strong>Turn:</strong> ${game.turn}</p>\n      </div>\n      <button class="join-button" data-game-id="${game.game_id}">Join Game</button>\n    `;\n        container.appendChild(card);\n    }\n    container.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {\n        const target = e.target;\n        if (target.classList.contains("join-button")) {\n            const gameId = target.dataset.gameId;\n            console.log(`Joining game ${gameId}`);\n            const res = yield fetch("/api/game/join-game", {\n                method: "post",\n                headers: { "Content-Type": "application/json" },\n                body: JSON.stringify({ username, gid: gameId }),\n            });\n            const resJson = yield res.json();\n            if (!resJson.success) {\n                console.log("error");\n            }\n            window.location.href = `/game?gid=${resJson.gid}&pid=${resJson.userId}`;\n        }\n    }));\n}));\ndocument.querySelector(".start-btn").addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {\n    const res = yield fetch("/api/game/new-game", {\n        method: "post",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify({ username }),\n    });\n    const resJson = yield res.json();\n    if (!resJson.success) {\n        console.log("error");\n    }\n    window.location.href = `/game?gid=${resJson.gid}&pid=${resJson.userId}`;\n}));\n// replace with cookie/auth system\nfunction generateRandomId() {\n    return Math.floor(10000000 + Math.random() * 90000000).toString();\n}\n\n\n//# sourceURL=webpack://term-project-14-uno/./src/client/lobby.ts?',
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
  /******/ __webpack_modules__["./src/client/lobby.ts"](0, __webpack_exports__);
  /******/
  /******/
})();
