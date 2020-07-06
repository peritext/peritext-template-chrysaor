"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _peritextUtils = require("peritext-utils");

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const InlineAssetWrapper = ({
  data,
  children
}, {
  production,
  contextualizers,
  openAsideContextualization,
  bindContextualizationElement,
  productionAssets: assets = {},
  viewParams = {}
}) => {
  const assetId = data.asset && data.asset.id;

  if (!assetId || !production) {
    return null;
  }

  const contextualization = production.contextualizations[assetId];

  if (!contextualization) {
    return null;
  }

  const contextualizer = production.contextualizers[contextualization.contextualizerId];
  const resource = production.resources[contextualization.sourceId];
  const contextualizerModule = contextualizers[contextualizer.type];
  const Component = contextualizerModule && contextualizerModule.Inline;

  const onClick = () => {
    if (typeof openAsideContextualization === 'function') {
      openAsideContextualization(contextualization.id);
    }
  };

  const handleMainClick = () => {
    if (resource.metadata.type === 'glossary' || resource.metadata.type === 'bib') {
      onClick();
    }
  };

  const active = viewParams.selectedResourceId === resource.id;

  const bindRef = element => {
    if (typeof bindContextualizationElement === 'function') {
      bindContextualizationElement(contextualization.id, element);
    }
  };

  if (contextualizer && Component) {
    return _react.default.createElement("span", {
      className: `${'InlineAssetWrapper ' + 'inline-'}${contextualizer.type} ${active ? 'is-active' : ''} inline-contextualization-container ${contextualizer.type}`,
      id: assetId,
      ref: bindRef,
      onClick: handleMainClick
    }, resource.metadata.type !== 'glossary' && _react.default.createElement(_peritextUtils.StructuredCOinS, {
      resource: resource
    }), _react.default.createElement(_LinkProvider.default, {
      to: {
        routeParams: _objectSpread({}, viewParams, {
          selectedResourceId: active ? undefined : resource.id
        })
      }
    }, _react.default.createElement(Component, {
      contextualization: contextualization,
      contextualizer: contextualizer,
      assets: assets,
      resource: resource,
      renderingMode: 'screened'
    }, children)));
  }

  return null;
};
/**
 * Component's properties types
 */


InlineAssetWrapper.propTypes = {
  /**
   * Corresponds to the data initially embedded in a draft-js entity
   */
  data: _propTypes.default.shape({
    asset: _propTypes.default.shape({
      id: _propTypes.default.string
    })
  })
};
/**
 * Component's context used properties
 */

InlineAssetWrapper.contextTypes = {
  production: _propTypes.default.object,
  contextualizers: _propTypes.default.object,
  onAssetContextRequest: _propTypes.default.func,
  openAsideContextualization: _propTypes.default.func,
  bindContextualizationElement: _propTypes.default.func,
  productionAssets: _propTypes.default.object,
  viewParams: _propTypes.default.object
};
var _default = InlineAssetWrapper;
exports.default = _default;