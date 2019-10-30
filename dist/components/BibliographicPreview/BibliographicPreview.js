"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _components = require("quinoa-design-library/components");

var _reactCiteproc = require("react-citeproc");

require("./BibliographicPreview.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This module provides a reusable bibliography preview element component.
 * It displays a simple bibliography
 * @module ovide/components/BibliographicPreview
 */

/**
 * Imports Libraries
 */

/**
 * Imports Assets
 */
const english = require('raw-loader!./english-locale.xml');

const apa = require('raw-loader!./apa.csl');
/**
 * Renders the BibliographicPreview component as a pure function
 * @param {object} props - used props (see prop types below)
 * @todo: load style and locale from currently set style and locale
 * @return {ReactElement} component - the resulting component
 */


const BibliographicPreview = ({
  items
}) => _react.default.createElement(_components.Content, null, _react.default.createElement("blockquote", null, _react.default.createElement(_reactCiteproc.Bibliography, {
  items: items,
  style: apa,
  locale: english
})));
/**
 * Component's properties types
 */


BibliographicPreview.propTypes = {
  /**
   * Map of the bibliographic items to render (keys are ids)
   */
  items: _propTypes.default.object
};
var _default = BibliographicPreview;
exports.default = _default;