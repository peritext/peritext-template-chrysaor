/**
 * This module exports a stateless reusable block asset wrapper component
 * It handles the connection to context's data and builds proper data to render the asset
 * ============
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StructuredCOinS } from 'peritext-utils';
import MarkdownPlayer from './MarkdownPlayer';
import Link from './LinkProvider';

const BlockAssetWrapper = ( {
  data
}, {
  production = {},
  productionAssets: assets = {},
  contextualizers,
  containerId,
  bindContextualizationElement,
  renderingMode = 'screened',
  viewParams = {}
} ) => {
  const assetId = data.asset.id;
  const contextualization = production && production.contextualizations && production.contextualizations[assetId];
  if ( !contextualization ) {
    return null;
  }
  const {
    visibility = {
      paged: true,
      screened: true
    },
  } = contextualization;
  const contextualizer = production.contextualizers[contextualization.contextualizerId];
  const resource = production.resources[contextualization.sourceId];

  const contextualizerModule = contextualizers[contextualizer.type];

  const Component = contextualizerModule && contextualizerModule.Block;

  const bindRef = ( element ) => {
    if ( typeof bindContextualizationElement === 'function' ) {
      bindContextualizationElement( contextualization.id, element );
    }
  };

  const active = viewParams.selectedResourceId === resource.id;

  if ( contextualization && Component ) {

    const isHidden = !visibility[renderingMode];
    return isHidden ? null : (
      <figure
        className={ `block-contextualization-container ${active ? 'is-active' : ''} ${ contextualizer.type}` }
        style={ {
          position: 'relative',
        } }
        id={ `contextualization-${containerId}-${assetId}` }
        ref={ bindRef }
      >
        <Component
          resource={ resource }
          contextualizer={ contextualizer }
          contextualization={ contextualization }
          renderingMode={ renderingMode }
          assets={ assets }
        />
        <figcaption className={ 'figure-caption' }>
          {
            <h4 className={ 'figure-title' }>

              {
                renderingMode === 'screened' ?
                  <div>
                    <Link
                      className={ 'link mention-context-pointer' }
                      to={ {
                        routeParams: {
                          ...viewParams,
                          selectedResourceId: active ? undefined : resource.id
                        }
                      } }
                    >
                      <span>{contextualization.title || resource.metadata.title}</span>
                    </Link>
                  </div> :
                  <span>{contextualization.title || resource.metadata.title}</span>
              }
            </h4>
          }
          {contextualization.legend &&
            <div className={ 'figure-legend' }>
              <MarkdownPlayer src={ contextualization.legend } />
            </div>
          }

        </figcaption>
        <StructuredCOinS resource={ resource } />
      </figure>
    );
  }
  else {
    return null;
  }
};

/**
 * Component's properties types
 */
BlockAssetWrapper.propTypes = {

  /**
   * Corresponds to the data initially embedded in a draft-js entity
   */
  data: PropTypes.shape( {
    asset: PropTypes.shape( {
      id: PropTypes.string
    } )
  } )
};

/**
 * Component's context used properties
 */
BlockAssetWrapper.contextTypes = {

  /**
   * The active production data
   */
  production: PropTypes.object,

  /**
   * Dimensions of the wrapping element
   */
  dimensions: PropTypes.object,

  /**
   * Whether the block asset is displayed in a note (and not in main content)
   */
  inNote: PropTypes.bool,

  contextualizers: PropTypes.object,

  productionAssets: PropTypes.object,

  containerId: PropTypes.string,

  bindContextualizationElement: PropTypes.func,

  renderingMode: PropTypes.string,

  viewParams: PropTypes.object,
};

export default BlockAssetWrapper;

