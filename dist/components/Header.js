"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Header = ({
  // locationTitle,
  title,
  subtitle,
  description,
  authors
}) => {
  const [isOpen, setIsOpen] = (0, _react.useState)(false);
  return _react.default.createElement("header", {
    className: `header ${isOpen ? 'is-open' : ''}`
  }, _react.default.createElement("h1", {
    className: 'title'
  }, _react.default.createElement(_LinkProvider.default, {
    to: {
      routeParams: {}
    }
  }, title), _react.default.createElement("span", {
    onClick: () => setIsOpen(!isOpen)
  }, "+")), _react.default.createElement("div", {
    className: 'additional-container'
  }, _react.default.createElement("div", {
    className: 'main-header'
  }, subtitle && _react.default.createElement("h2", {
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
  }, description))));
};

var _default = Header;
exports.default = _default;