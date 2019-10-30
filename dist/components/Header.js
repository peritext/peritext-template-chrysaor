"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Header = ({
  // locationTitle,
  title,
  subtitle,
  description,
  authors
}) => {
  return _react.default.createElement("header", {
    className: 'header'
  }, _react.default.createElement("div", {
    className: 'main-header'
  }, _react.default.createElement("h1", {
    className: 'title'
  }, _react.default.createElement(_LinkProvider.default, {
    to: {
      routeParams: {}
    }
  }, title)), subtitle && _react.default.createElement("h2", {
    className: 'subtitle'
  }, subtitle), authors && authors.length ? _react.default.createElement("h3", {
    className: 'authors'
  }, authors.map(({
    given,
    family
  }, index) => _react.default.createElement("span", {
    key: index
  }, given, " ", family))) : null), _react.default.createElement("div", {
    className: 'additional-header'
  }, description && _react.default.createElement("p", {
    className: 'description'
  }, description)));
};

var _default = Header;
exports.default = _default;