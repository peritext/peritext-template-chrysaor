import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HashRouter, BrowserRouter, Route, Switch } from 'react-router-dom';

const isBrowser = new Function( 'try {return this===window;}catch(e){ return false;}' );/* eslint no-new-func : 0 */
const inBrowser = isBrowser();

import SectionHead from './SectionHead';
import ProductionHead from './ProductionHead';
import Layout from './Layout';
import PreviewLink from './PreviewLink';
import RouterLink from './RouterLink';

export const getAdditionalRoutes = () => {
  return [
    {
      // routeClass: 'index',
      routeParams: {}
    }
   ];
};

export const buildNav = ( ) => {
    return [];
  };
export const routeItemToUrl = ( item, index ) => {

  /*
   * if nav index specified
   * and nav index is 0 then this is the landing page
   */
  if ( index !== undefined && index === 0 ) {
    return '/';
  }
  switch ( item.routeClass ) {
    default:
      const additional = Object.keys( item.routeParams )
      .reduce( ( res, key ) => `${res}${item.routeParams[key] ? `&${key}=${item.routeParams[key]}` : ''}`, '' );
      return `?${additional}`;
  }
};

export const renderHeadFromRouteItem = ( { item, production, edition } ) => {
    switch ( item.routeClass ) {
      case 'resourcePage':
        return (
          <SectionHead
            production={ production }
            edition={ edition }
            section={ production.resources[item.routeParams.resourceId] }
          />
        );
      default:
        return (
          <ProductionHead
            production={ production }
            edition={ edition }
            pageName={ `${production.metadata.title} - ${item.title}` }
          />
        );
    }
  };

export default class Wrapper extends Component {
  static childContextTypes = {
    activeViewParams: PropTypes.object,
    navigateTo: PropTypes.func,
    LinkComponent: PropTypes.func,
    production: PropTypes.object,
    edition: PropTypes.object,
    contextualizers: PropTypes.object,
    productionAssets: PropTypes.object,
    routeItemToUrl: PropTypes.func,
    usedDocument: PropTypes.object,
    translate: PropTypes.func,
    getViewIdForSectionId: PropTypes.func,
  }

  static propTypes = {
    contextualizers: PropTypes.object,
    locale: PropTypes.object,
    onActiveViewIdChange: PropTypes.object,
    production: PropTypes.object
  }

  constructor( props ) {
    super( props );
    const { production, edition, locale } = props;
    const summary = buildNav( { production, edition, locale, translate: this.translate } );
    const firstEl = summary.length && summary[0];
    this.state = {
      viewClass: props.viewClass || ( firstEl && firstEl.routeClass ) || 'landing',
      viewId: props.viewId || ( firstEl && firstEl.viewId ),
      viewParams: props.viewParams || ( firstEl && firstEl.routeParams ) || {},
      viewNavSummaryIndex: 0,
      navSummary: summary,
    };
  }

  getChildContext = () => ( {
    LinkComponent: this.props.previewMode ? PreviewLink : RouterLink,
    activeViewParams: this.state.viewParams,
    contextualizers: this.props.contextualizers,
    edition: this.props.edition,
    translate: this.translate,
    navigateTo: this.navigateTo,
    routeItemToUrl,
    production: this.props.production,
    productionAssets: this.props.production.assets,
    usedDocument: this.props.usedDocument,
    getViewIdForSectionId: this.getViewIdForSectionId,
  } )

  componentWillReceiveProps( nextProps ) {
    if (
      this.props.production !== nextProps.production
      || this.props.contextualizers !== nextProps.contextualizers
      || this.props.edition !== nextProps.edition
    ) {
      const { production, edition, locale } = nextProps;
      const summary = buildNav( { production, edition, locale, translate: this.translate } );
      const firstEl = summary.length && summary[0];
      const viewClass = nextProps.viewClass || ( firstEl && firstEl.routeClass ) || 'landing';
      const viewId = nextProps.viewId || ( firstEl && firstEl.viewId );
      const viewParams = nextProps.viewParams || ( firstEl && firstEl.routeParams ) || {};
      this.setState( {
        viewClass,
        viewParams,
        viewId,
        viewNavSummaryIndex: 0,
        navSummary: summary

      } );
    }
  }

  translate = ( key ) => {
    const { locale = {} } = this.props;
    return locale[key] || key;
  }

  identifyView = ( viewType, params1, params2 ) => {
    switch ( viewType ) {
      case 'sections':
        return params1.resourceId === params2.resourceId;
      default:
        return true;
    }
  }

  getSummaryIndex = ( { viewId, routeClass, routeParams } ) => {
    let index;
    this.state.navSummary.find( ( item, thatIndex ) => {
      if ( item.viewId === viewId/* ||  item.routeClass === routeClass && this.identifyView( routeClass, routeParams, item.routeParams )
        */ ) {
        index = thatIndex;
        return true;
      }
    } );
    if ( !index ) {
      this.state.navSummary.find( ( item, thatIndex ) => {
        if ( item.routeClass === routeClass && this.identifyView( routeClass, routeParams, item.routeParams )
           ) {
          index = thatIndex;
          return true;
        }
      } );

    }
    return index;
  }

  navigateTo = ( { routeClass, routeParams, viewNavSummaryIndex, viewId } ) => {
    let index = viewNavSummaryIndex;
    let finalViewId = viewId;
    if ( !index ) {
      index = this.getSummaryIndex( { routeClass, routeParams, viewId } );
      if ( !finalViewId && index ) {
        finalViewId = this.state.navSummary[index].viewId;
      }
    }
    if ( !index ) {
      this.state.navSummary.some( ( item, thatIndex ) => {
        if ( item.routeClass === routeClass ) {
          index = thatIndex;
          finalViewId = item.viewId;
          return true;
        }
      } );
    }
    this.setState( {
      viewClass: routeClass,
      viewParams: routeParams,
      viewNavSummaryIndex: index,
      viewId: finalViewId
    } );
    if ( typeof this.props.onActiveViewChange === 'function' ) {
      this.props.onActiveViewChange( { viewClass: routeClass, viewId: finalViewId, viewParams: routeParams } );
    }
  }

  getViewIdForSectionId = ( sectionId ) => {

    /*
     * gets the first section nav item that matches a specific section
     * (explanations: there can be several times the same section)
     */
    const { navSummary } = this.state;
    const firstMatch = navSummary.find( ( item ) => item.routeClass === 'sections' && item.routeParams.resourceId === sectionId );
    if ( firstMatch ) {
      return firstMatch.viewId;
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
       },
       state: {
        viewId,
        viewClass,
        viewParams,
        navSummary,
       },
    } = this;

    const Router = useBrowserRouter ? BrowserRouter : HashRouter;

    if ( previewMode || !inBrowser ) {
      return (
        <Layout
          summary={ navSummary }
          production={ production }
          edition={ edition }
          viewId={ viewId }
          viewClass={ viewClass }
          viewParams={ viewParams }
          translate={ this.translate }
          preprocessedData={ preprocessedData }
        />
      );
    }

    let routerSummary = navSummary;

    /**
     * If first view is not landing
     * then we double it to allow internal links
     */
    if ( routerSummary.length && routerSummary[0].routeClass !== 'landing' ) {
      routerSummary = [ routerSummary[0], ...routerSummary ];
    }

    return (
      <Router basename={ window.__urlBaseName }>
        <Switch>
          <Route
            path={ '/' }
            component={ ( props ) => {
                let additionalRouteParams = {};
                if ( props.location.search ) {
                  additionalRouteParams = props.location.search.slice( 1 )
                    .split( '&' )
                    .map( ( item ) => item.split( '=' ) )
                    .map( ( tuple ) => ( {
                      [tuple[0]]: tuple[1]
                    } ) )
                    .reduce( ( result, mini ) => ( {
                      ...result,
                      ...mini
                    } ), {} );
                }
                return (
                  <Layout
                    summary={ navSummary }
                    production={ production }
                    edition={ edition }
                    translate={ this.translate }
                    viewClass={ viewClass }
                    viewParams={ additionalRouteParams }
                    preprocessedData={ preprocessedData }
                  />
                );
              } }
          />
          {/* 404 */}
          <Route
            component={ () => {
              return (
                <div className={ 'main-contents-container' }>
                  <div className={ 'main-column' }>
                    <h1>{this.translate( 'Nothing to see here!' )}</h1>
                    <h2>{this.translate( 'There is not content to display for this URL.' )}</h2>
                  </div>
                </div>

              );
            } }
          />
        </Switch>
      </Router>
    );

  }
}
