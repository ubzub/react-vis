'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FlexibleXYPlot = exports.FlexibleHeightXYPlot = exports.FlexibleWidthXYPlot = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

exports.makeHeightFlexible = makeHeightFlexible;
exports.makeVisFlexible = makeVisFlexible;
exports.makeWidthFlexible = makeWidthFlexible;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _xyPlot = require('./plot/xy-plot');

var _xyPlot2 = _interopRequireDefault(_xyPlot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// As a performance enhancement, we want to only listen once
var resizeSubscribers = [];
var DEBOUNCE_DURATION = 100;
var timeoutId = null;

/**
 * Calls each subscriber, debounced to the
 */
function debounceEmitResize() {
  _window2.default.clearTimeout(timeoutId);
  timeoutId = _window2.default.setTimeout(emitResize, DEBOUNCE_DURATION);
}

/**
 * Calls each subscriber once syncronously.
 */
function emitResize() {
  resizeSubscribers.forEach(function (cb) {
    return cb();
  });
}

/**
 * Add the given callback to the list of subscribers to be caled when the
 * window resizes. Returns a function that, when called, removes the given
 * callback from the list of subscribers. This function is also resposible for
 * adding and removing the resize listener on `window`.
 *
 * @param {Function} cb - Subscriber callback function
 * @returns {Function} Unsubscribe function
 */
function subscribeToDebouncedResize(cb) {
  resizeSubscribers.push(cb);

  // if we go from zero to one Flexible components instances, add the listener
  if (resizeSubscribers.length === 1) {
    _window2.default.addEventListener('resize', debounceEmitResize);
  }
  return function unsubscribe() {
    removeSubscriber(cb);

    // if we have no Flexible components, remove the listener
    if (resizeSubscribers.length === 0) {
      _window2.default.clearTimeout(timeoutId);
      _window2.default.removeEventListener('resize', debounceEmitResize);
    }
  };
}

/**
 * Helper for removing the given callback from the list of subscribers.
 *
 * @param {Function} cb - Subscriber callback function
 */
function removeSubscriber(cb) {
  var index = resizeSubscribers.indexOf(cb);
  if (index > -1) {
    resizeSubscribers.splice(index, 1);
  }
}

/**
 * Helper for getting a display name for the child component
 * @param {*} Component React class for the child component.
 * @returns {String} The child components name
 */
function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

/**
 * Add the ability to stretch the visualization on window resize.
 * @param {*} Component React class for the child component.
 * @returns {*} Flexible component.
 */

function makeFlexible(Component, isWidthFlexible, isHeightFlexible) {
  var Result = function Result(oldProps) {
    var _useState = (0, _react.useState)({ height: 0, width: 0 }),
        _useState2 = _slicedToArray(_useState, 2),
        state = _useState2[0],
        setState = _useState2[1];

    var ref = (0, _react.useRef)(null);
    var handleResize = function handleResize() {
      var computed = getComputedStyle(ref.current);
      var els = ['width', 'height'];
      var rect = Object.keys(computed).filter(function (el) {
        return els.includes(el);
      }).reduce(function (ob, key) {
        ob[key] = parseInt(computed[key].split('px')[0], 10);
        return ob;
      }, {});
      if (rect) setState({ width: rect.width, height: rect.height });
    };
    (0, _react.useEffect)(function () {
      handleResize();
      _window2.default.addEventListener('resize', handleResize);
      return function () {
        return _window2.default.removeEventListener('resize', handleResize);
      };
    });

    var height = state.height,
        width = state.width;

    var props = _extends({}, oldProps, {
      animation: height === 0 && width === 0 ? null : oldProps.animation
    });

    var updatedDimensions = _extends({}, isHeightFlexible ? { height: height } : {}, isWidthFlexible ? { width: width } : {});
    return _react2.default.createElement(
      'div',
      {
        ref: ref,
        style: {
          display: 'flex',
          height: '100%',
          flex: '1 1'
        }
      },
      _react2.default.createElement(Component, _extends({}, updatedDimensions, props))
    );
  };

  Result.displayName = 'Flexible' + getDisplayName(Component);

  return Result;
}

function makeHeightFlexible(component) {
  return makeFlexible(component, false, true);
}

function makeVisFlexible(component) {
  return makeFlexible(component, true, true);
}

function makeWidthFlexible(component) {
  return makeFlexible(component, true, false);
}

var FlexibleWidthXYPlot = exports.FlexibleWidthXYPlot = makeWidthFlexible(_xyPlot2.default);
var FlexibleHeightXYPlot = exports.FlexibleHeightXYPlot = makeHeightFlexible(_xyPlot2.default);
var FlexibleXYPlot = exports.FlexibleXYPlot = makeVisFlexible(_xyPlot2.default);