var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Copyright (c) 2017 Uber Technologies, Inc.
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

import AbstractSeries from './abstract-series';
import Animation from '../../animation';
import { ANIMATED_SERIES_PROPS } from '../../utils/series-utils';

var predefinedClassName = 'rv-xy-plot__series rv-xy-plot__series--custom-svg-wrapper';

var DEFAULT_STYLE = {
  stroke: 'blue',
  fill: 'blue'
};

function predefinedComponents(type) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_STYLE;

  switch (type) {
    case 'diamond':
      return React.createElement('polygon', {
        style: style,
        points: '0 0 ' + size / 2 + ' ' + size / 2 + ' 0 ' + size + ' ' + -size / 2 + ' ' + size / 2 + ' 0 0'
      });
    case 'star':
      var starPoints = [].concat(_toConsumableArray(new Array(5))).map(function (c, index) {
        var angle = index / 5 * Math.PI * 2;
        var innerAngle = angle + Math.PI / 10;
        var outerAngle = angle - Math.PI / 10;
        // ratio of inner polygon to outer polgyon
        var innerRadius = size / 2.61;
        return '\n        ' + Math.cos(outerAngle) * size + ' ' + Math.sin(outerAngle) * size + '\n        ' + Math.cos(innerAngle) * innerRadius + ' ' + Math.sin(innerAngle) * innerRadius + '\n      ';
      }).join(' ');
      return React.createElement('polygon', {
        points: starPoints,
        x: '0',
        y: '0',
        height: size,
        width: size,
        style: style
      });
    case 'square':
      return React.createElement('rect', {
        x: '' + -size / 2,
        y: '' + -size / 2,
        height: size,
        width: size,
        style: style
      });
    default:
    case 'circle':
      return React.createElement('circle', { cx: '0', cy: '0', r: size / 2, style: style });
  }
}

function getInnerComponent(_ref) {
  var customComponent = _ref.customComponent,
      defaultType = _ref.defaultType,
      positionInPixels = _ref.positionInPixels,
      positionFunctions = _ref.positionFunctions,
      style = _ref.style,
      propsSize = _ref.propsSize;
  var size = customComponent.size;

  var aggStyle = _extends({}, style, customComponent.style || {});
  var innerComponent = customComponent.customComponent;
  if (!innerComponent && typeof defaultType === 'string') {
    return predefinedComponents(defaultType, size || propsSize, aggStyle);
  }
  // if default component is a function
  if (!innerComponent) {
    return defaultType(customComponent, positionInPixels, aggStyle, positionFunctions);
  }
  if (typeof innerComponent === 'string') {
    return predefinedComponents(innerComponent || defaultType, size, aggStyle);
  }
  // if inner component is a function
  return innerComponent(customComponent, positionInPixels, aggStyle, positionFunctions);
}

var CustomSVGSeries = function (_AbstractSeries) {
  _inherits(CustomSVGSeries, _AbstractSeries);

  function CustomSVGSeries() {
    _classCallCheck(this, CustomSVGSeries);

    return _possibleConstructorReturn(this, (CustomSVGSeries.__proto__ || Object.getPrototypeOf(CustomSVGSeries)).apply(this, arguments));
  }

  _createClass(CustomSVGSeries, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          animation = _props.animation,
          className = _props.className,
          customComponent = _props.customComponent,
          data = _props.data,
          innerHeight = _props.innerHeight,
          innerWidth = _props.innerWidth,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          style = _props.style,
          size = _props.size;


      if (!data || !innerWidth || !innerHeight) {
        return null;
      }

      if (animation) {
        return React.createElement(
          Animation,
          _extends({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          React.createElement(CustomSVGSeries, _extends({}, this.props, { animation: false }))
        );
      }

      var x = this._getAttributeFunctor('x');
      var y = this._getAttributeFunctor('y');
      var contents = data.map(function (seriesComponent, index) {
        var positionInPixels = {
          x: x(seriesComponent),
          y: y(seriesComponent)
        };
        var innerComponent = getInnerComponent({
          customComponent: seriesComponent,
          positionInPixels: positionInPixels,
          defaultType: customComponent,
          positionFunctions: { x: x, y: y },
          style: style,
          propsSize: size
        });
        return React.createElement(
          'g',
          {
            className: 'rv-xy-plot__series--custom-svg',
            key: 'rv-xy-plot__series--custom-svg-' + index,
            transform: 'translate(' + positionInPixels.x + ',' + positionInPixels.y + ')',
            onMouseEnter: function onMouseEnter(e) {
              return _this2._valueMouseOverHandler(seriesComponent, e);
            },
            onMouseLeave: function onMouseLeave(e) {
              return _this2._valueMouseOutHandler(seriesComponent, e);
            }
          },
          innerComponent
        );
      });
      return React.createElement(
        'g',
        {
          className: predefinedClassName + ' ' + className,
          transform: 'translate(' + marginLeft + ',' + marginTop + ')'
        },
        contents
      );
    }
  }]);

  return CustomSVGSeries;
}(AbstractSeries);

CustomSVGSeries.propTypes = {
  animation: PropTypes.bool,
  className: PropTypes.string,
  customComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  })).isRequired,
  marginLeft: PropTypes.number,
  marginTop: PropTypes.number,
  style: PropTypes.object,
  size: PropTypes.number,
  onValueMouseOver: PropTypes.func,
  onValueMouseOut: PropTypes.func
};

CustomSVGSeries.defaultProps = _extends({}, AbstractSeries.defaultProps, {
  animation: false,
  customComponent: 'circle',
  style: {},
  size: 2
});

export default CustomSVGSeries;