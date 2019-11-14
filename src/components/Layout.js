import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { buildCitations, StructuredCOinS } from 'peritext-utils';
import ProductionHead from './ProductionHead';

import { convertEditionToCslRecord } from '../utils';
import Header from './Header';
import templateStyle from '../defaultStyle';
import ContentsColumn from './ContentsColumn';
import CitationsProvider from './CitationsProvider';

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
      citations: this.buildCitations( props, context ),
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
      preprocessedData: this.props.preprocessedData,
      citationStyle: this.props.edition.data.citationStyle.data,
      citationLocale: this.props.edition.data.citationLocale.data,
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
    this.updateConstants( this.props, this.context );
  }

  componentWillReceiveProps = ( nextProps, nextContext ) => {
    if ( this.props.production !== nextProps.production ) {
      this.updateConstants( nextProps, nextContext );
    }
  }

  componentWillUpdate = ( nextProps, _nextState, nextContext ) => {
    if ( this.context.production && nextContext.production && this.context.production.id !== nextContext.production.id ) {
      this.updateConstants( nextProps, nextContext );
    }
  }

  updateConstants = ( props, context ) => {
    this.setState( {
      finalCss: this.updateStyles( props, context ),
      citations: this.buildCitations( props )
    } );
  }

  bindContextualizationElement = ( id, element ) => {
    this.contextualizationElements[id] = element;
  }

  buildCitations = ( props ) => {
    const { production, edition, preprocessedData } = props;
    return ( preprocessedData && preprocessedData.global && preprocessedData.global.citations ) || buildCitations( { production, edition }, true );

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
      <CitationsProvider
        citations={ citations }
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
                        isDefaultActive={ editionSummary.length === 1 }
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
      </CitationsProvider>
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

  preprocessedData: PropTypes.object,

  citationStyle: PropTypes.string,
  citationLocale: PropTypes.string,
};

export default inBrowser && sizeMe ? sizeMe( {
  monitorHeight: true,
  monitorWidth: true,
  monitorPosition: true,
} )( Layout ) : Layout;
