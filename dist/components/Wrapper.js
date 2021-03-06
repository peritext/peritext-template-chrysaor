"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.renderHeadFromRouteItem = exports.routeItemToUrl = exports.buildNav = exports.getAdditionalRoutes = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRouterDom = require("react-router-dom");

var _SectionHead = _interopRequireDefault(require("./SectionHead"));

var _ProductionHead = _interopRequireDefault(require("./ProductionHead"));

var _Layout = _interopRequireDefault(require("./Layout"));

var _PreviewLink = _interopRequireDefault(require("./PreviewLink"));

var _RouterLink = _interopRequireDefault(require("./RouterLink"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
/* eslint no-new-func : 0 */

const inBrowser = isBrowser();

const getAdditionalRoutes = () => {
  return [{
    // routeClass: 'index',
    routeParams: {}
  }];
};

exports.getAdditionalRoutes = getAdditionalRoutes;

const buildNav = () => {
  return [];
};

exports.buildNav = buildNav;

const routeItemToUrl = (item, index) => {
  /*
   * if nav index specified
   * and nav index is 0 then this is the landing page
   */
  if (index !== undefined && index === 0) {
    return '/';
  }

  switch (item.routeClass) {
    default:
      const additional = Object.keys(item.routeParams).reduce((res, key) => `${res}${item.routeParams[key] ? `&${key}=${item.routeParams[key]}` : ''}`, '');
      return `?${additional}`;
  }
};

exports.routeItemToUrl = routeItemToUrl;

const renderHeadFromRouteItem = ({
  item,
  production,
  edition
}) => {
  switch (item.routeClass) {
    case 'resourcePage':
      return _react.default.createElement(_SectionHead.default, {
        production: production,
        edition: edition,
        section: production.resources[item.routeParams.resourceId]
      });

    default:
      return _react.default.createElement(_ProductionHead.default, {
        production: production,
        edition: edition,
        pageName: `${production.metadata.title} - ${item.title}`
      });
  }
};

exports.renderHeadFromRouteItem = renderHeadFromRouteItem;

class Wrapper extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "getChildContext", () => ({
      LinkComponent: this.props.previewMode ? _PreviewLink.default : _RouterLink.default,
      activeViewParams: this.state.viewParams,
      contextualizers: this.props.contextualizers,
      edition: this.props.edition,
      translate: this.translate,
      navigateTo: this.navigateTo,
      routeItemToUrl,
      production: this.props.production,
      productionAssets: this.props.production.assets,
      usedDocument: this.props.usedDocument,
      getViewForResourceId: this.getViewForResourceId
    }));

    _defineProperty(this, "translate", key => {
      const {
        locale = {}
      } = this.props;
      return locale[key] || key;
    });

    _defineProperty(this, "identifyView", (viewType, params1, params2) => {
      switch (viewType) {
        case 'sections':
          return params1.resourceId === params2.resourceId;

        default:
          return true;
      }
    });

    _defineProperty(this, "getSummaryIndex", ({
      viewId,
      routeClass,
      routeParams
    }) => {
      let index;
      this.state.navSummary.find((item, thatIndex) => {
        if (item.viewId === viewId
        /* ||  item.routeClass === routeClass && this.identifyView( routeClass, routeParams, item.routeParams )
        */
        ) {
            index = thatIndex;
            return true;
          }
      });

      if (!index) {
        this.state.navSummary.find((item, thatIndex) => {
          if (item.routeClass === routeClass && this.identifyView(routeClass, routeParams, item.routeParams)) {
            index = thatIndex;
            return true;
          }
        });
      }

      return index;
    });

    _defineProperty(this, "navigateTo", ({
      routeClass,
      routeParams,
      viewNavSummaryIndex,
      viewId
    }) => {
      let index = viewNavSummaryIndex;
      let finalViewId = viewId;

      if (!index) {
        index = this.getSummaryIndex({
          routeClass,
          routeParams,
          viewId
        });

        if (!finalViewId && index) {
          finalViewId = this.state.navSummary[index].viewId;
        }
      }

      if (!index) {
        this.state.navSummary.some((item, thatIndex) => {
          if (item.routeClass === routeClass) {
            index = thatIndex;
            finalViewId = item.viewId;
            return true;
          }
        });
      }

      this.setState({
        viewClass: routeClass,
        viewParams: routeParams,
        viewNavSummaryIndex: index,
        viewId: finalViewId
      });

      if (typeof this.props.onActiveViewChange === 'function') {
        this.props.onActiveViewChange({
          viewClass: routeClass,
          viewId: finalViewId,
          viewParams: routeParams
        });
      }
    });

    _defineProperty(this, "getViewForResourceId", resourceId => {
      /*
       * gets the first section nav item that matches a specific section
       * (explanations: there can be several times the same section)
       */
      const {
        navSummary
      } = this.state;
      const firstMatch = navSummary.find(item => item.routeClass === 'sections' && item.routeParams.resourceId === resourceId);

      if (firstMatch) {
        return firstMatch.viewId;
      }
    });

    const {
      production,
      edition,
      locale: _locale
    } = props;
    const summary = buildNav({
      production,
      edition,
      locale: _locale,
      translate: this.translate
    });
    const firstEl = summary.length && summary[0];
    this.state = {
      viewClass: props.viewClass || firstEl && firstEl.routeClass || 'landing',
      viewId: props.viewId || firstEl && firstEl.viewId,
      viewParams: props.viewParams || firstEl && firstEl.routeParams || {},
      viewNavSummaryIndex: 0,
      navSummary: summary
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.production !== nextProps.production || this.props.contextualizers !== nextProps.contextualizers || this.props.edition !== nextProps.edition) {
      const {
        production,
        edition,
        locale
      } = nextProps;
      const summary = buildNav({
        production,
        edition,
        locale,
        translate: this.translate
      });
      const firstEl = summary.length && summary[0];
      const viewClass = nextProps.viewClass || firstEl && firstEl.routeClass || 'landing';
      const viewId = nextProps.viewId || firstEl && firstEl.viewId;
      const viewParams = nextProps.viewParams || firstEl && firstEl.routeParams || {};
      this.setState({
        viewClass,
        viewParams,
        viewId,
        viewNavSummaryIndex: 0,
        navSummary: summary
      });
    }
  }

  render() {
    const {
      props: {
        production,
        edition,
        previewMode,
        useBrowserRouter = false,
        preprocessedData,
        excludeCss,
        staticRender
      },
      state: {
        viewId,
        viewClass,
        viewParams,
        navSummary
      }
    } = this;
    const Router = useBrowserRouter ? _reactRouterDom.BrowserRouter : _reactRouterDom.HashRouter;

    if (previewMode || !inBrowser) {
      return _react.default.createElement(_Layout.default, {
        summary: navSummary,
        production: production,
        edition: edition,
        viewId: viewId,
        viewClass: viewClass,
        viewParams: viewParams,
        translate: this.translate,
        preprocessedData: preprocessedData,
        excludeCss: excludeCss,
        staticRender: staticRender
      });
    }

    let routerSummary = navSummary;
    /**
     * If first view is not landing
     * then we double it to allow internal links
     */

    if (routerSummary.length && routerSummary[0].routeClass !== 'landing') {
      routerSummary = [routerSummary[0], ...routerSummary];
    }

    return _react.default.createElement(Router, {
      basename: window.__urlBaseName
    }, _react.default.createElement(_reactRouterDom.Switch, null, _react.default.createElement(_reactRouterDom.Route, {
      path: '/',
      component: props => {
        let additionalRouteParams = {};

        if (props.location.search) {
          additionalRouteParams = props.location.search.slice(1).split('&').map(item => item.split('=')).map(tuple => ({
            [tuple[0]]: tuple[1]
          })).reduce((result, mini) => _objectSpread({}, result, mini), {});
        }

        return _react.default.createElement(_Layout.default, {
          summary: navSummary,
          production: production,
          edition: edition,
          translate: this.translate,
          viewClass: viewClass,
          viewParams: additionalRouteParams,
          preprocessedData: preprocessedData,
          excludeCss: excludeCss,
          staticRender: staticRender
        });
      }
    }), _react.default.createElement(_reactRouterDom.Route, {
      component: () => {
        return _react.default.createElement("div", {
          className: 'main-contents-container'
        }, _react.default.createElement("div", {
          className: 'main-column'
        }, _react.default.createElement("h1", null, this.translate('Nothing to see here!')), _react.default.createElement("h2", null, this.translate('There is not content to display for this URL.'))));
      }
    })));
  }

}

exports.default = Wrapper;

_defineProperty(Wrapper, "childContextTypes", {
  activeViewParams: _propTypes.default.object,
  navigateTo: _propTypes.default.func,
  LinkComponent: _propTypes.default.func,
  production: _propTypes.default.object,
  edition: _propTypes.default.object,
  contextualizers: _propTypes.default.object,
  productionAssets: _propTypes.default.object,
  routeItemToUrl: _propTypes.default.func,
  usedDocument: _propTypes.default.object,
  translate: _propTypes.default.func,
  getViewForResourceId: _propTypes.default.func
});

_defineProperty(Wrapper, "propTypes", {
  contextualizers: _propTypes.default.object,
  locale: _propTypes.default.object,
  onActiveViewIdChange: _propTypes.default.object,
  production: _propTypes.default.object
});