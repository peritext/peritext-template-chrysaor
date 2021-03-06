"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SectionLink = ({
  children,
  resourceId
}, {
  getViewForResourceId
}) => _react.default.createElement(_LinkProvider.default, {
  to: {
    routeClass: 'sections',
    viewId: getViewForResourceId(resourceId),
    routeParams: {
      resourceId
    }
  }
}, children);

SectionLink.contextTypes = {
  getViewForResourceId: _propTypes.default.func
};
var _default = SectionLink;
exports.default = _default;