var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
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

import React from 'react';
import PropTypes from 'prop-types';
import Animation from '../../animation';
import { hexbin } from 'd3-hexbin';
import { scaleLinear } from 'd3-scale';

import { ANIMATED_SERIES_PROPS } from '../../utils/series-utils';
import { CONTINUOUS_COLOR_RANGE } from '../../theme';
import AbstractSeries from './abstract-series';

var predefinedClassName = 'rv-xy-plot__series rv-xy-plot__series--hexbin';

function getColorDomain(_ref, hexes) {
  var countDomain = _ref.countDomain;

  if (countDomain) {
    return countDomain;
  }
  return [0, Math.max.apply(Math, _toConsumableArray(hexes.map(function (row) {
    return row.length;
  })))];
}

var HexbinSeries = function (_AbstractSeries) {
  _inherits(HexbinSeries, _AbstractSeries);

  function HexbinSeries() {
    _classCallCheck(this, HexbinSeries);

    return _possibleConstructorReturn(this, (HexbinSeries.__proto__ || Object.getPrototypeOf(HexbinSeries)).apply(this, arguments));
  }

  _createClass(HexbinSeries, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          animation = _props.animation,
          className = _props.className,
          colorRange = _props.colorRange,
          data = _props.data,
          innerHeight = _props.innerHeight,
          innerWidth = _props.innerWidth,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          radius = _props.radius,
          sizeHexagonsWithCount = _props.sizeHexagonsWithCount,
          style = _props.style,
          xOffset = _props.xOffset,
          yOffset = _props.yOffset;


      if (!data) {
        return null;
      }

      if (animation) {
        return React.createElement(
          Animation,
          _extends({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          React.createElement(HexbinSeries, _extends({}, this.props, { animation: null }))
        );
      }
      var x = this._getAttributeFunctor('x');
      var y = this._getAttributeFunctor('y');

      var hex = hexbin().x(function (d) {
        return x(d) + xOffset;
      }).y(function (d) {
        return y(d) + yOffset;
      }).radius(radius).size([innerWidth, innerHeight]);

      var hexagonPath = hex.hexagon();
      var hexes = hex(data);

      var countDomain = getColorDomain(this.props, hexes);
      var color = scaleLinear().domain(countDomain).range(colorRange);
      var size = scaleLinear().domain(countDomain).range([0, radius]);
      return React.createElement(
        'g',
        {
          className: predefinedClassName + ' ' + className,
          transform: 'translate(' + marginLeft + ',' + marginTop + ')'
        },
        hexes.map(function (d, i) {
          var attrs = {
            style: style,
            d: sizeHexagonsWithCount ? hex.hexagon(size(d.length)) : hexagonPath,
            fill: color(d.length),
            transform: 'translate(' + d.x + ', ' + d.y + ')',
            key: i,
            onClick: function onClick(e) {
              return _this2._valueClickHandler(d, e);
            },
            onContextMenu: function onContextMenu(e) {
              return _this2._valueRightClickHandler(d, e);
            },
            onMouseOver: function onMouseOver(e) {
              return _this2._valueMouseOverHandler(d, e);
            },
            onMouseOut: function onMouseOut(e) {
              return _this2._valueMouseOutHandler(d, e);
            }
          };
          return React.createElement('path', attrs);
        })
      );
    }
  }]);

  return HexbinSeries;
}(AbstractSeries);

HexbinSeries.propTypes = _extends({}, AbstractSeries.propTypes, {
  radius: PropTypes.number
});

HexbinSeries.defaultProps = {
  radius: 20,
  colorRange: CONTINUOUS_COLOR_RANGE,
  xOffset: 0,
  yOffset: 0
};

HexbinSeries.displayName = 'HexbinSeries';

export default HexbinSeries;