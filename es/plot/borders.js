var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var propTypes = {
  style: PropTypes.shape({
    bottom: PropTypes.object,
    left: PropTypes.object,
    right: PropTypes.object,
    top: PropTypes.object
  }),
  // supplied by xyplot
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
  marginRight: PropTypes.number,
  innerWidth: PropTypes.number,
  innerHeight: PropTypes.number
};

var CLASSES = {
  bottom: 'rv-xy-plot__borders-bottom',
  container: 'rv-xy-plot__borders',
  left: 'rv-xy-plot__borders-left',
  right: 'rv-xy-plot__borders-right',
  top: 'rv-xy-plot__borders-top'
};

function Borders(props) {
  var marginTop = props.marginTop,
      marginBottom = props.marginBottom,
      marginLeft = props.marginLeft,
      marginRight = props.marginRight,
      innerWidth = props.innerWidth,
      innerHeight = props.innerHeight,
      style = props.style,
      className = props.className;

  var height = innerHeight + marginTop + marginBottom;
  var width = innerWidth + marginLeft + marginRight;
  return React.createElement(
    'g',
    { className: CLASSES.container + ' ' + className },
    React.createElement('rect', {
      className: CLASSES.bottom + ' ' + className + '-bottom',
      style: _extends({}, style.all, style.bottom),
      x: 0,
      y: height - marginBottom,
      width: width,
      height: marginBottom
    }),
    React.createElement('rect', {
      className: CLASSES.left + ' ' + className + '-left',
      style: _extends({}, style.all, style.left),
      x: 0,
      y: 0,
      width: marginLeft,
      height: height
    }),
    React.createElement('rect', {
      className: CLASSES.right + ' ' + className + '-right',
      style: _extends({}, style.all, style.right),
      x: width - marginRight,
      y: 0,
      width: marginRight,
      height: height
    }),
    React.createElement('rect', {
      className: CLASSES.top + ' ' + className + '-top',
      style: _extends({}, style.all, style.top),
      x: 0,
      y: 0,
      width: width,
      height: marginTop
    })
  );
}

Borders.displayName = 'Borders';
Borders.defaultProps = {
  className: '',
  style: {
    all: {},
    bottom: {},
    left: {},
    right: {},
    top: {}
  }
};
Borders.propTypes = propTypes;
Borders.requiresSVG = true;

export default Borders;