(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["index.js"] = factory();
	else
		root["index.js"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.default = parseMarkdown;

	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

	var TYPES = {
	  HEADER: 'h',
	  ANCHOR: 'a',
	  STRONG: 'strong',
	  EMPHASIS: 'em',
	  DELETE: 'del',
	  QUOTE: 'quote',
	  INLINE_CODE: 'inlineCode',
	  UNORDERED_LIST: 'ul',
	  ORDERED_LIST: 'ol',
	  BLOCKQUOTE: 'blockquote',
	  HORIZONTAL_RULE: 'horizRule',
	  PARAGRAPH: 'p'
	};

	var EXPRESSIONS = [[TYPES.HEADER, /(#+)(.*)/], [TYPES.ANCHOR, /\[([^\[]+)\]\(([^\)]+)\)/], [TYPES.STRONG, /(\*\*|__)(.*?)\1/], [TYPES.EMPHASIS, /(\*|_)(.*?)\1/], [TYPES.DELETE, /(\~\~)(.*?)\1/], [TYPES.QUOTE, /(\:\")(.*?)\"\:/], [TYPES.INLINE_CODE, /`(.*?)`/], [TYPES.UNORDERED_LIST, /`(.*?)`/], [TYPES.ORDERED_LIST, /\n[0-9]+\.(.*)/], [TYPES.BLOCKQUOTE, /\n[0-9]+\.(.*)/], [TYPES.HORIZONTAL_RULE, /\n-{5,}/]];

	/*
	  func clamp: clamp a number between a min and a max
	  @param  {number} min - lowest the result can be
	  @param  {number} max - highest the result can be
	  @return {number}     - a number clamped between min and max
	*/
	var clamp = function clamp(num, min, max) {
	  return Math.min(max, Math.max(min, num));
	};

	/*
	  func md: Takes a valid markdown string and converts it into an
	  object tree that represents the markdown.
	  @param  {string} md           - A string of valid markdown
	  @return {array<object|array>} - An object tree representing the markdown
	                                  structure
	*/
	function parseMarkdown(md) {
	  if (!md) return [];

	  var result = runParser(md);

	  return Array.isArray(result) ? result : [{ type: TYPES.PARAGRAPH, children: result, text: result }];
	};

	/*
	  func runParser: takes valid markdown text and parses it
	  @param  {string} text                - A string of valid markdown
	  @return {array<object|array>|string} - Either an object tree representing the
	                                         markdown structure, or a string which
	                                         is the markdown itself
	*/
	var runParser = function runParser(text) {
	  var parsed = parseText(text);

	  if (Array.isArray(parsed)) {
	    var _parsed = _slicedToArray(parsed, 3);

	    var pre = _parsed[0];
	    var matched = _parsed[1];
	    var remaining = _parsed[2];


	    return (pre ? [{ type: TYPES.PARAGRAPH, children: pre.replace(/\n/g, ' '), text: pre }] : []).concat(matched).concat(parseMarkdown(remaining));
	  } else {
	    return text.replace(/\n/g, ' ');
	  }
	};

	/*
	  func parseStatement: Take a subset of a line of markdown and parse it
	  @param  {string} inputText            - Some valid markdown text
	  @return {array<object|array>|string}  - An object representation of that line
	                                          of markdown or the statment itself if
	                                          there are no matches
	*/
	var parseText = function parseText(inputText) {
	  var currentResult = null;
	  var currentType = '';

	  for (var index in EXPRESSIONS) {
	    var _EXPRESSIONS$index = _slicedToArray(EXPRESSIONS[index], 2);

	    var type = _EXPRESSIONS$index[0];
	    var reg = _EXPRESSIONS$index[1];

	    var result = reg.exec(inputText);
	    if (result && (!currentResult || result.index < currentResult.index)) {
	      currentResult = result;
	      currentType = type;
	    }
	  }

	  if (currentResult) {
	    var _currentResult$map = currentResult.map(function (x) {
	      return x.trim();
	    });

	    var _currentResult$map2 = _toArray(_currentResult$map);

	    var matchedText = _currentResult$map2[0];

	    var matchedArgs = _currentResult$map2.slice(1);

	    var _inputText$split$map = inputText.split(matchedText).map(function (x) {
	      return x.trim();
	    });

	    var _inputText$split$map2 = _slicedToArray(_inputText$split$map, 2);

	    var preMatch = _inputText$split$map2[0];
	    var remaining = _inputText$split$map2[1];


	    var nodeType = currentType;
	    var children = '';

	    switch (currentType) {
	      case TYPES.HEADER:
	        {
	          var headerNum = clamp(matchedArgs[0].length, 1, 6);
	          var headerText = matchedArgs[1];

	          nodeType = '' + TYPES.HEADER + headerNum;
	          children = runParser(headerText);
	        }
	      case TYPES.ANCHOR:
	        {
	          var _matchedArgs = _slicedToArray(matchedArgs, 2);

	          var text = _matchedArgs[0];
	          var url = _matchedArgs[1];

	          children = { text: text, url: url };
	        }
	      case TYPES.STRONG:
	      case TYPES.EMPHASIS:
	      case TYPES.DELETE:
	        {
	          children = runParser(matchedArgs[1]);
	        }
	      default:
	        {
	          console.log(matchedText, matchedArgs);
	        }
	    }

	    var node = { type: nodeType, text: matchedText, children: children };
	    return [preMatch, node, remaining];
	  }

	  // no matches
	  return inputText;
	};

/***/ }
/******/ ])
});
;