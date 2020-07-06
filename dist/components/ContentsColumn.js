"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _peritextUtils = require("peritext-utils");

var _ResourceCard = _interopRequireDefault(require("./ResourceCard"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _intersection = _interopRequireDefault(require("lodash/intersection"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
const inBrowser = isBrowser();
/* eslint no-new-func : 0 */

const ContentsColumn = function ({
  element,
  production,
  edition,
  translate,
  activeResourceId,
  activeElementId,
  selectedResourceId,
  numberOfColumns = 1,
  selectedContextualizationId,
  isDefaultActive
}, {
  usedDocument
}) {
  const realDocument = usedDocument || (inBrowser ? document : {});
  const {
    data = {}
  } = element;
  const containerRef = (0, _react.useRef)(null);
  const {
    displayThumbnail,
    displayHeader
  } = data;
  const title = data.customTitle || translate('Selection');
  const sections = (0, _peritextUtils.buildResourceSectionsSummary)({
    production,
    options: element.data
  });
  let status = isDefaultActive ? 'is-active' : '';
  let activeResourceIndex;

  if (activeElementId !== undefined && !isDefaultActive) {
    status = activeElementId === (element.id || 'nope') ? 'is-active' : 'is-collapsed';
    sections.some(({
      resourceId
    }, index) => {
      if (resourceId === activeResourceId) {
        activeResourceIndex = index;
        return true;
      }
    });
  }

  let relatedResourcesIds = [];
  let highlightedResources = {};

  if (activeResourceId) {
    relatedResourcesIds = Object.keys(production.contextualizations).reduce((res, contextualizationId) => {
      const contextualization = production.contextualizations[contextualizationId];

      if (contextualization.sourceId === activeResourceId) {
        highlightedResources[contextualization.targetId] = highlightedResources[contextualization.targetId] ? [...highlightedResources[contextualization.targetId], contextualization.id] : [contextualization.id];
        return [...res, contextualization.targetId];
      } else if (contextualization.targetId === activeResourceId) {
        return [...res, contextualization.sourceId];
      }

      return res;
    }, []);
  }

  relatedResourcesIds = (0, _intersection.default)(relatedResourcesIds, sections.map(({
    resourceId
  }) => resourceId));

  if (selectedResourceId) {
    highlightedResources = sections.reduce((res, {
      resourceId
    }) => {
      const pointingContextualizationsIds = Object.keys(production.contextualizations).filter(contextualizationId => {
        const contextualization = production.contextualizations[contextualizationId];
        return contextualization.sourceId === selectedResourceId && contextualization.targetId === resourceId;
      });
      return pointingContextualizationsIds.length ? _objectSpread({}, res, {
        [resourceId]: res[resourceId] ? (0, _uniq.default)([...res[resourceId], ...pointingContextualizationsIds]) : pointingContextualizationsIds
      }) : res;
    }, highlightedResources);
  }

  (0, _react.useEffect)(() => {
    if (activeElementId === element.id && activeResourceId) {
      setTimeout(() => {
        let targetElement;

        if (selectedContextualizationId) {
          targetElement = realDocument.getElementById(`${selectedContextualizationId}`);
        } else {
          targetElement = realDocument.getElementById(`${activeElementId}-${activeResourceId}`);
        }

        if (targetElement) {
          containerRef.current.scrollTop = targetElement.offsetTop - 80;
        }
      }, 1600);
    }
  }, [activeResourceId, selectedContextualizationId]);
  (0, _react.useEffect)(() => {
    if (selectedResourceId) {
      const target = realDocument.getElementById(`${element.id}-${selectedResourceId}`);

      if (target) {
        containerRef.current.scrollTop = target.offsetTop - 80;
      }
    }
  }, [selectedResourceId]);
  let maxWidth;

  if (status === 'is-collapsed' && Object.keys(highlightedResources).length && !relatedResourcesIds.length) {
    status = 'is-hidden';
    maxWidth = 0;
  } else if (status === 'is-active') {// maxWidth = '50%';
  } else {
    maxWidth = `${100 / numberOfColumns}%`;
  }

  const [parentScrollPosition, setParentScrollPosition] = (0, _react.useState)(0);

  const handleScroll = e => {
    setParentScrollPosition(e.target.scrollTop);
  };

  const onScrollToElementId = id => {
    const target = realDocument.getElementById(id);

    if (target && containerRef.current) {
      containerRef.current.scrollTop = target.offsetTop;
    }
  };

  const parentBoundingRect = containerRef && containerRef.current && containerRef.current.getBoundingClientRect();
  return _react.default.createElement("section", {
    style: {
      maxWidth,
      minWidth: status === 'is-collapsed' ? 0 : undefined
    },
    className: `contents-column ${status}`
  }, _react.default.createElement("div", {
    className: 'column-header'
  }, _react.default.createElement("h1", null, title)), _react.default.createElement("ul", {
    ref: containerRef,
    className: 'cards-list',
    id: element.id || 'nope',
    onScroll: handleScroll
  }, sections.map(({
    resourceId,
    level
  }, index) => {
    let thatResourceStatus;

    if (activeResourceId !== undefined) {
      if (activeResourceId === resourceId && status === 'is-active') {
        thatResourceStatus = 'is-active';
      } else if (highlightedResources[resourceId]) {
        thatResourceStatus = 'has-related';
      } else if (index === activeResourceIndex - 1 || index === activeResourceIndex + 1) {
        thatResourceStatus = 'is-adjacent';
      } else if (relatedResourcesIds.includes(resourceId)) {
        thatResourceStatus = 'is-related';
      } else {
        thatResourceStatus = 'is-collapsed';
      }
    }

    return _react.default.createElement(_ResourceCard.default, {
      key: index,
      resource: production.resources[resourceId],
      level: level,
      elementId: element.id,
      status: thatResourceStatus,
      production: production,
      isHighlighted: selectedResourceId === resourceId,
      highlights: highlightedResources[resourceId],
      edition: edition,
      displayThumbnail: displayThumbnail,
      displayHeader: displayHeader,
      parentBoundingRect: parentBoundingRect,
      parentScrollPosition: parentScrollPosition,
      onScrollToElementId: onScrollToElementId
    });
  })));
};

ContentsColumn.contextTypes = {
  usedDocument: _propTypes.default.object
};
var _default = ContentsColumn;
exports.default = _default;