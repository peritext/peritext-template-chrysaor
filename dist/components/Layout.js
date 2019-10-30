"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactCiteproc = require("react-citeproc");

var _peritextUtils = require("peritext-utils");

var _ProductionHead = _interopRequireDefault(require("./ProductionHead"));

var _utils = require("../utils");

var _Header = _interopRequireDefault(require("./Header"));

var _defaultStyle = _interopRequireDefault(require("../defaultStyle"));

var _ContentsColumn = _interopRequireDefault(require("./ContentsColumn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
const inBrowser = isBrowser();
/* eslint no-new-func : 0 */

let sizeMe;

if (inBrowser) {
  sizeMe = require('react-sizeme');
}

class Layout extends _react.Component {
  constructor(_props, _context) {
    super(_props);

    _defineProperty(this, "getChildContext", () => {
      const dimensions = _objectSpread({}, this.props.size, {
        width: this.props.size && this.props.size.width || inBrowser && window.innerWidth,
        height: this.props.size && this.props.size.height || inBrowser && window.innerHeight
      });

      return {
        dimensions,

        /*
         * scrollToElement: this.scrollToElement,
         * scrollToElementId: this.scrollToElementId,
         * scrollToTop: this.scrollTo,
         * scrollTop: this.state.gui.scrollTop,
         * scrollTopAbs: this.state.gui.scrollTopAbs,
         * scrollRatio: this.state.gui.scrollRatio,
         * scrollTopRatio: this.state.gui.scrollTopRatio,
         * scrollHeight: this.globalScrollbar && this.globalScrollbar.getScrollHeight(),
         */
        viewParams: this.props.viewParams,
        rawCitations: this.state.citations,
        bindContextualizationElement: this.bindContextualizationElement,
        scrollToContextualization: this.scrollToContextualization
      };
    });

    _defineProperty(this, "componentDidMount", () => {
      this.updateConstants(this.props);
      this.onProductionChange(this.context.production);
    });

    _defineProperty(this, "componentWillReceiveProps", nextProps => {
      if (this.props.production !== nextProps.production) {
        this.updateConstants(nextProps);
      }
    });

    _defineProperty(this, "componentWillUpdate", (nextProps, nextState, nextContext) => {
      if (this.context.production && nextContext.production && this.context.production.id !== nextContext.production.id) {
        this.onProductionChange(nextContext.production);
      }
    });

    _defineProperty(this, "updateConstants", props => {
      this.setState({
        finalCss: this.updateStyles(props, this.context)
      });
    });

    _defineProperty(this, "bindContextualizationElement", (id, element) => {
      this.contextualizationElements[id] = element;
    });

    _defineProperty(this, "buildCitations", production => {
      const {
        contextualizations,
        resources,
        contextualizers
      } = production;
      const bibContextualizations = Object.keys(contextualizations).filter(assetKey => contextualizers[contextualizations[assetKey].contextualizerId].type === 'bib').map(assetKey => contextualizations[assetKey]); // build citations items data

      const citationItems = bibContextualizations.reduce((finalCitations, contextualization) => {
        const resource = resources[contextualization.sourceId];
        const citations = [...(0, _peritextUtils.resourceToCslJSON)(resource), ...(contextualization.additionalResources ? contextualization.additionalResources.map(resId => (0, _peritextUtils.resourceToCslJSON)(resources[resId])) : [])].flat();
        const newCitations = citations.reduce((final2, citation) => {
          return _objectSpread({}, final2, {
            [citation.id]: citation
          });
        }, {});
        return _objectSpread({}, finalCitations, newCitations);
      }, {}); // build citations's citations data

      const citationInstances = bibContextualizations // Object.keys(bibContextualizations)
      .map((bibCit, index) => {
        const key1 = bibCit.id;
        const contextualization = contextualizations[key1];
        const contextualizer = contextualizers[contextualization.contextualizerId];
        const resource = resources[contextualization.sourceId];
        const targets = [...(0, _peritextUtils.resourceToCslJSON)(resource), ...(bibCit.additionalResources ? bibCit.additionalResources.map(resId => (0, _peritextUtils.resourceToCslJSON)(resources[resId])) : [])].flat();
        return {
          citationID: key1,
          citationItems: targets.map(ref => ({
            locator: contextualizer.locator,
            prefix: contextualizer.prefix,
            suffix: contextualizer.suffix,
            // ...contextualizer,
            id: ref.id
          })),
          properties: {
            noteIndex: index + 1
          }
        };
      }).filter(c => c);
      /*
       * map them to the clumsy formatting needed by citeProc
       * todo: refactor the citationInstances --> citeProc-formatted data as a util
       */

      const citationData = citationInstances.map((instance, index) => [instance, // citations before
      citationInstances.slice(0, index === 0 ? 0 : index).map(oCitation => [oCitation.citationID, oCitation.properties.noteIndex]), []]);
      return {
        citationItems,
        citationData
      };
    });

    _defineProperty(this, "onProductionChange", production => {
      this.setState({
        citations: this.buildCitations(production)
      });
    });

    _defineProperty(this, "updateStyles", (props, context) => {
      const {
        edition: {
          data = {}
        }
      } = props;
      const {
        contextualizers = {}
      } = context;
      const {
        style: {
          css = '',
          mode = 'merge'
        } = {
          css: ''
        }
      } = data;
      const contextualizersStyles = Object.keys(contextualizers).map(type => contextualizers[type] && contextualizers[type].defaultCss || '').join('\n');

      if (mode === 'merge') {
        return [_defaultStyle.default, // templateStylesheet,
        contextualizersStyles, css].join('\n');
      } else {
        // styleMode === 'replace'
        return [contextualizersStyles, css].join('\n');
      }
    });

    _defineProperty(this, "render", () => {
      const {
        props: {
          children,
          production,
          edition = {},
          summary = [],
          viewParams,
          viewId,
          viewClass,
          translate
        },
        context: {},
        state: {
          finalCss,
          gui: {
            inTop
          },
          citations
        }
      } = this;
      const {
        data = {}
      } = edition;
      const {
        additionalHTML = ''
      } = data;
      const citationStyle = edition.data.citationStyle.data;
      const citationLocale = edition.data.citationLocale.data;
      const globalTitle = edition.data.publicationTitle && edition.data.publicationTitle.length ? edition.data.publicationTitle : production.metadata.title;
      const globalSubtitle = edition.data.publicationSubtitle && edition.data.publicationSubtitle.length ? edition.data.publicationSubtitle : production.metadata.subtitle;
      const globalDescription = production.metadata.abstract;
      const globalAuthors = edition.data.authors && edition.data.authors.length ? edition.data.authors : production.metadata.authors;
      const editionAsCSLRecord = (0, _utils.convertEditionToCslRecord)(production, edition);
      const activeItem = viewId && summary.find(v => v.viewId === viewId);
      const locationTitle = activeItem && activeItem.routeClass !== 'landing' && activeItem.title;
      const {
        plan = {}
      } = data;
      const {
        summary: editionSummary = []
      } = plan;
      const {
        resourceId,
        elementId,
        selectedResourceId,
        selectedContextualizationId
      } = viewParams;
      return _react.default.createElement(_reactCiteproc.ReferencesManager, {
        style: citationStyle,
        locale: citationLocale,
        items: citations.citationItems,
        citations: citations.citationData,
        componentClass: 'references-manager'
      }, _react.default.createElement(_ProductionHead.default, {
        production: production,
        edition: edition,
        withHelmet: true
      }), _react.default.createElement("section", {
        className: `chrysaor-layout has-view-class-${viewClass}`
      }, _react.default.createElement(_Header.default, {
        locationTitle: locationTitle,
        inTop: inTop,
        title: globalTitle,
        subtitle: globalSubtitle,
        description: globalDescription,
        authors: globalAuthors
      }), _react.default.createElement("section", {
        className: 'main-container'
      }, _react.default.createElement(_peritextUtils.StructuredCOinS, {
        cslRecord: editionAsCSLRecord
      }), _react.default.createElement("div", {
        className: 'columns-container'
      }, editionSummary.map(element => {
        return _react.default.createElement(_ContentsColumn.default, _extends({
          key: element.id
        }, {
          element,
          edition,
          activeResourceId: resourceId,
          activeElementId: elementId,
          selectedResourceId,
          selectedContextualizationId,
          production,
          translate,
          numberOfColumns: editionSummary.length
        }));
      })), children)), _react.default.createElement("style", {
        type: 'text/css',
        dangerouslySetInnerHTML: {
          /* eslint react/no-danger: 0 */
          __html: finalCss
        }
      }), _react.default.createElement("div", {
        dangerouslySetInnerHTML: {
          /* eslint react/no-danger: 0 */
          __html: additionalHTML
        }
      }));
    });

    this.state = {
      citations: this.buildCitations(_props.production),
      finalCss: this.updateStyles(_props, _context),
      gui: {}
    };
    this.contextualizationElements = {};
  }

}

Layout.contextTypes = {
  production: _propTypes.default.object,
  edition: _propTypes.default.object,
  usedDocument: _propTypes.default.object,
  contextualizers: _propTypes.default.object
};
Layout.childContextTypes = {
  dimensions: _propTypes.default.object,
  viewParams: _propTypes.default.object,
  rawCitations: _propTypes.default.object,
  bindContextualizationElement: _propTypes.default.func,
  scrollToContextualization: _propTypes.default.func
};

var _default = inBrowser && sizeMe ? sizeMe({
  monitorHeight: true,
  monitorWidth: true,
  monitorPosition: true
})(Layout) : Layout;

exports.default = _default;