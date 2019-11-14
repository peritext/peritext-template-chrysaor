"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _ResourcePreview = _interopRequireDefault(require("./ResourcePreview"));

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

var _peritextUtils = require("peritext-utils");

var _utils = require("../utils");

var _Section = _interopRequireDefault(require("./Section"));

var _Renderer = _interopRequireDefault(require("./Renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ResourceCard = ({
  resource,
  elementId = 'nope',
  displayThumbnail,
  production,
  edition,
  status = '',
  displayHeader,
  highlights = [],
  isHighlighted,
  parentBoundingRect,
  parentScrollPosition,
  onScrollToElementId
}) => {
  if (status === 'is-active') {
    return _react.default.createElement("li", {
      className: `resource-card ${status}`,
      id: `${elementId}-${resource.id}`
    }, _react.default.createElement("div", {
      className: 'resource-card-content'
    }, _react.default.createElement(_Section.default, {
      production,
      edition,
      section: resource,
      displayHeader,
      parentBoundingRect,
      parentScrollPosition,
      onScrollToElementId
    })));
  }

  const mentions = highlights.map(contextualizationId => {
    const mention = (0, _peritextUtils.buildContextContent)(production, contextualizationId);
    return _objectSpread({}, mention, {
      contextualizationId
    });
  });
  return _react.default.createElement("li", {
    className: `resource-card ${status} ${isHighlighted ? 'is-highlighted' : ''}`,
    id: `${elementId}-${resource.id}`
  }, _react.default.createElement("div", {
    className: 'resource-card-content'
  }, mentions.length ? _react.default.createElement("div", {
    className: 'mentions-container'
  }, _react.default.createElement(_LinkProvider.default, {
    to: {
      // routeClass: 'resourcePage',
      routeParams: {
        resourceId: resource.id,
        elementId
      }
    }
  }, _react.default.createElement("h2", {
    className: 'card-title'
  }, (0, _utils.ellipse)((0, _peritextUtils.getResourceTitle)(resource))), resource.metadata.authors && resource.metadata.authors.length > 0 && _react.default.createElement("p", {
    className: 'card-authors'
  }, resource.metadata.authors.map(({
    family,
    given
  }, thatIndex) => _react.default.createElement("span", {
    key: thatIndex
  }, given, " ", family)))), mentions.map(({
    contextualizationId,
    contents
  }, index) => {
    return _react.default.createElement("div", {
      key: index,
      className: 'excerpt'
    }, _react.default.createElement(_LinkProvider.default, {
      to: {
        routeParams: {
          resourceId: resource.id,
          selectedContextualizationId: contextualizationId,
          elementId
        }
      }
    }, _react.default.createElement(_Renderer.default, {
      raw: contents
    })));
  })) : _react.default.createElement(_LinkProvider.default, {
    to: {
      // routeClass: 'resourcePage',
      routeParams: {
        resourceId: resource.id,
        elementId
      }
    }
  }, displayThumbnail && status !== 'is-active' && _react.default.createElement(_ResourcePreview.default, {
    resource: resource
  }), _react.default.createElement("h2", {
    className: 'card-title'
  }, (0, _utils.ellipse)((0, _peritextUtils.getResourceTitle)(resource))), resource.metadata.authors && resource.metadata.authors.length > 0 && _react.default.createElement("p", {
    className: 'card-authors'
  }, resource.metadata.authors.map(({
    family,
    given
  }, thatIndex) => _react.default.createElement("span", {
    key: thatIndex
  }, given, " ", family))))));
};

var _default = ResourceCard;
exports.default = _default;