import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ReferencesManager } from 'react-citeproc';
import { resourceToCslJSON, StructuredCOinS } from 'peritext-utils';
import ProductionHead from './ProductionHead';

import { convertEditionToCslRecord } from '../utils';
import Header from './Header';
import templateStyle from '../defaultStyle';
import ContentsColumn from './ContentsColumn';

const isBrowser = new Function( 'try {return this===window;}catch(e){ return false;}' );
const inBrowser = isBrowser();/* eslint no-new-func : 0 */
let sizeMe;

if ( inBrowser ) {
  sizeMe = require( 'react-sizeme' );
}

class Layout extends Component {
  constructor( props, context ) {
    super( props );
    this.state = {
      citations: this.buildCitations( props.production ),
      finalCss: this.updateStyles( props, context ),
      gui: {}
    };
    this.contextualizationElements = {};
  }

  getChildContext = () => {
    const dimensions = {
      ...this.props.size,
      width: ( this.props.size && this.props.size.width ) || ( inBrowser && window.innerWidth ),
      height: ( this.props.size && this.props.size.height ) || ( inBrowser && window.innerHeight ),
    };
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
      scrollToContextualization: this.scrollToContextualization,
    };
  }

  /**
   * Livecycle methods
   */
  componentDidMount = () => {
    this.updateConstants( this.props );
    this.onProductionChange( this.context.production );
  }

  componentWillReceiveProps = ( nextProps ) => {
    if ( this.props.production !== nextProps.production ) {
      this.updateConstants( nextProps );
    }
  }

  componentWillUpdate = ( nextProps, nextState, nextContext ) => {
    if ( this.context.production && nextContext.production && this.context.production.id !== nextContext.production.id ) {
      this.onProductionChange( nextContext.production );
    }
  }

  updateConstants = ( props ) => {
    this.setState( {
      finalCss: this.updateStyles( props, this.context )
    } );
  }

  bindContextualizationElement = ( id, element ) => {
    this.contextualizationElements[id] = element;
  }

  buildCitations = ( production ) => {
    const {
      contextualizations,
      resources,
      contextualizers
    } = production;

    const bibContextualizations = Object.keys( contextualizations )
      .filter( ( assetKey ) =>
          contextualizers[contextualizations[assetKey].contextualizerId].type === 'bib'
        )
      .map( ( assetKey ) => contextualizations[assetKey] );

    // build citations items data
    const citationItems = bibContextualizations
      .reduce( ( finalCitations, contextualization ) => {
        const resource = resources[contextualization.sourceId];
        const citations = [
          ...resourceToCslJSON( resource ),
          ...( contextualization.additionalResources ? contextualization.additionalResources.map( ( resId ) => resourceToCslJSON( resources[resId] ) ) : [] )
        ].flat();
        const newCitations = citations.reduce( ( final2, citation ) => {
          return {
            ...final2,
            [citation.id]: citation
          };
        }, {} );
        return {
          ...finalCitations,
          ...newCitations,
        };
      }, {} );

    // build citations's citations data
    const citationInstances = bibContextualizations // Object.keys(bibContextualizations)
      .map( ( bibCit, index ) => {
        const key1 = bibCit.id;
        const contextualization = contextualizations[key1];

        const contextualizer = contextualizers[contextualization.contextualizerId];
        const resource = resources[contextualization.sourceId];
        const targets = [
          ...resourceToCslJSON( resource ),
          ...( bibCit.additionalResources ? bibCit.additionalResources.map( ( resId ) => resourceToCslJSON( resources[resId] ) ) : [] )
        ].flat();
        return {
          citationID: key1,
          citationItems: targets.map( ( ref ) => ( {
            locator: contextualizer.locator,
            prefix: contextualizer.prefix,
            suffix: contextualizer.suffix,
            // ...contextualizer,
            id: ref.id,
          } ) ),
          properties: {
            noteIndex: index + 1
          }
        };
      } ).filter( ( c ) => c );

    /*
     * map them to the clumsy formatting needed by citeProc
     * todo: refactor the citationInstances --> citeProc-formatted data as a util
     */
    const citationData = citationInstances.map( ( instance, index ) => [
      instance,
      // citations before
      citationInstances.slice( 0, ( index === 0 ? 0 : index ) )
        .map( ( oCitation ) => [
            oCitation.citationID,
            oCitation.properties.noteIndex
          ]
        ),
      []
    ] );

    return { citationItems, citationData };
  }

  onProductionChange = ( production ) => {
    this.setState( {
      citations: this.buildCitations( production )
    } );
  }

  updateStyles = ( props, context ) => {
    const {
      edition: {
        data = {}
      },

    } = props;
    const {
      contextualizers = {}
    } = context;

    const {
          style: {
            css = '',
            mode = 'merge',
          } = { css: '' }
    } = data;

    const contextualizersStyles = Object.keys( contextualizers )
      .map( ( type ) => contextualizers[type] && contextualizers[type].defaultCss || '' )
      .join( '\n' );
    if ( mode === 'merge' ) {
      return [
        templateStyle,
        // templateStylesheet,
        contextualizersStyles,
        css
      ]
      .join( '\n' );
    }
    else { // styleMode === 'replace'
      return [
        contextualizersStyles,
        css
      ].join( '\n' );
    }

  }

  render = () => {

    const {
      props: {
        children,
        production,
        edition = {},
        summary = [],
        viewParams = {},
        viewId,
        viewClass,
        translate,
      },
      context: {

      },
      state: {
        finalCss,
        gui: {
          inTop,
        },
        citations,
      },
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
    const editionAsCSLRecord = convertEditionToCslRecord( production, edition );
    const activeItem = viewId && summary.find( ( v ) => v.viewId === viewId );
    const locationTitle = activeItem && activeItem.routeClass !== 'landing' && activeItem.title;

    const { plan = {} } = data;
    const { summary: editionSummary = [] } = plan;

    const {
      resourceId,
      elementId,
      selectedResourceId,
      selectedContextualizationId,
    } = viewParams;

    return (
      <ReferencesManager
        style={ citationStyle }
        locale={ citationLocale }
        items={ citations.citationItems }
        citations={ citations.citationData }
        componentClass={ 'references-manager' }
      >
        <ProductionHead
          production={ production }
          edition={ edition }
          withHelmet
        />
        <section
          className={ `chrysaor-layout has-view-class-${viewClass}` }
        >
          <Header
            locationTitle={ locationTitle }
            inTop={ inTop }
            title={ globalTitle }
            subtitle={ globalSubtitle }
            description={ globalDescription }
            authors={ globalAuthors }
          />
          <section className={ 'main-container' }>
            <StructuredCOinS cslRecord={ editionAsCSLRecord } />
            <div className={ 'columns-container' }>
              {
                  editionSummary.map( ( element ) => {
                    return (
                      <ContentsColumn
                        key={ element.id }
                        {
                          ...{
                            element,
                            edition,
                            activeResourceId: resourceId,
                            activeElementId: elementId,
                            selectedResourceId,
                            selectedContextualizationId,
                            production,
                            translate,
                            numberOfColumns: editionSummary.length,
                          }
                        }
                      />
                    );
                  } )
                }
            </div>
            {children}
          </section>

        </section>
        <style
          type={ 'text/css' }
          dangerouslySetInnerHTML={ {/* eslint react/no-danger: 0 */
            __html: finalCss
          } }
        />
        <div
          dangerouslySetInnerHTML={ {/* eslint react/no-danger: 0 */
            __html: additionalHTML
          } }
        />
      </ReferencesManager>
    );
  }
}

Layout.contextTypes = {
  production: PropTypes.object,
  edition: PropTypes.object,
  usedDocument: PropTypes.object,
  contextualizers: PropTypes.object,
};

Layout.childContextTypes = {
  dimensions: PropTypes.object,
  viewParams: PropTypes.object,
  rawCitations: PropTypes.object,
  bindContextualizationElement: PropTypes.func,
  scrollToContextualization: PropTypes.func,
};

export default inBrowser && sizeMe ? sizeMe( {
  monitorHeight: true,
  monitorWidth: true,
  monitorPosition: true,
} )( Layout ) : Layout;
