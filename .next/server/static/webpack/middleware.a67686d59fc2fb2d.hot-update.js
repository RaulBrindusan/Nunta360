"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("middleware",{

/***/ "(middleware)/./src/middleware.ts":
/*!***************************!*\
  !*** ./src/middleware.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   middleware: () => (/* binding */ middleware)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(middleware)/./node_modules/next/dist/esm/api/server.js\");\n\nasync function middleware(request) {\n    // Firebase authentication is handled client-side via AuthContext\n    // This middleware is simplified since we're using client-side auth only\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.next();\n}\nconst config = {\n    matcher: [\n        /*\r\n     * Match all request paths except for the ones starting with:\r\n     * - _next/static (static files)\r\n     * - _next/image (image optimization files)\r\n     * - favicon.ico (favicon file)\r\n     * - public (public files)\r\n     */ '/((?!_next/static|_next/image|favicon.ico|public).*)'\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vc3JjL21pZGRsZXdhcmUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTJDO0FBR3BDLGVBQWVDLFdBQVdDLE9BQW9CO0lBQ25ELGlFQUFpRTtJQUNqRSx3RUFBd0U7SUFDeEUsT0FBT0YscURBQVlBLENBQUNHLElBQUk7QUFDMUI7QUFFTyxNQUFNQyxTQUFTO0lBQ3BCQyxTQUFTO1FBQ1A7Ozs7OztLQU1DLEdBQ0Q7S0FDRDtBQUNILEVBQUUiLCJzb3VyY2VzIjpbIkQ6XFxXZWIgRGV2IFByb2plY3RzXFxudW50YTM2MFxcc3JjXFxtaWRkbGV3YXJlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcclxuaW1wb3J0IHR5cGUgeyBOZXh0UmVxdWVzdCB9IGZyb20gJ25leHQvc2VydmVyJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaWRkbGV3YXJlKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XHJcbiAgLy8gRmlyZWJhc2UgYXV0aGVudGljYXRpb24gaXMgaGFuZGxlZCBjbGllbnQtc2lkZSB2aWEgQXV0aENvbnRleHRcclxuICAvLyBUaGlzIG1pZGRsZXdhcmUgaXMgc2ltcGxpZmllZCBzaW5jZSB3ZSdyZSB1c2luZyBjbGllbnQtc2lkZSBhdXRoIG9ubHlcclxuICByZXR1cm4gTmV4dFJlc3BvbnNlLm5leHQoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcclxuICBtYXRjaGVyOiBbXHJcbiAgICAvKlxyXG4gICAgICogTWF0Y2ggYWxsIHJlcXVlc3QgcGF0aHMgZXhjZXB0IGZvciB0aGUgb25lcyBzdGFydGluZyB3aXRoOlxyXG4gICAgICogLSBfbmV4dC9zdGF0aWMgKHN0YXRpYyBmaWxlcylcclxuICAgICAqIC0gX25leHQvaW1hZ2UgKGltYWdlIG9wdGltaXphdGlvbiBmaWxlcylcclxuICAgICAqIC0gZmF2aWNvbi5pY28gKGZhdmljb24gZmlsZSlcclxuICAgICAqIC0gcHVibGljIChwdWJsaWMgZmlsZXMpXHJcbiAgICAgKi9cclxuICAgICcvKCg/IV9uZXh0L3N0YXRpY3xfbmV4dC9pbWFnZXxmYXZpY29uLmljb3xwdWJsaWMpLiopJyxcclxuICBdLFxyXG59OyAiXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwibWlkZGxld2FyZSIsInJlcXVlc3QiLCJuZXh0IiwiY29uZmlnIiwibWF0Y2hlciJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(middleware)/./src/middleware.ts\n");

/***/ })

});