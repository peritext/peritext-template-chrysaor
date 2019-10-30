
import React from 'react';
import PropTypes from 'prop-types';
import { StructuredCOinS } from 'peritext-utils';
import Link from './LinkProvider';

const InlineAssetWrapper = ( {
  data,
  children,
}, {
  production,
  contextualizers,
  openAsideContextualization,
  bindContextualizationElement,
  productionAssets: assets = {},
  viewParams = {},
} ) => {
  const assetId = data.asset && data.asset.id;
  if ( !assetId || !production ) {
    return null;
  }
  const contextualization = production.contextualizations[assetId];
  if ( !contextualization ) {
    return null;
  }

  const contextualizer = production.contextualizers[contextualization.contextualizerId];
  const resource = production.resources[contextualization.sourceId];
  const contextualizerModule = contextualizers[contextualizer.type];
  const Component = contextualizerModule && contextualizerModule.Inline;

  const onClick = () => {
    if ( typeof openAsideContextualization === 'function' ) {
      openAsideContextualization( contextualization.id );
    }
  };

  const handleMainClick = () => {
    if ( resource.metadata.type === 'glossary' || resource.metadata.type === 'bib' ) {
      onClick();
    }
  };

  const active = viewParams.selectedResourceId === resource.id;

  const bindRef = ( element ) => {
    if ( typeof bindContextualizationElement === 'function' ) {
      bindContextualizationElement( contextualization.id, element );
    }
  };

  if ( contextualizer && Component ) {
    return (
      <span
        className={ `${'InlineAssetWrapper ' + 'inline-'}${ contextualizer.type } ${active ? 'is-active' : ''} inline-contextualization-container ${ contextualizer.type}` }
        id={ assetId }
        ref={ bindRef }
        onClick={ handleMainClick }
      >
        {resource.metadata.type !== 'glossary' &&
        <StructuredCOinS resource={ resource } />
        }
        <Link
          to={ {
              routeParams: {
                ...viewParams,
                selectedResourceId: active ? undefined : resource.id
              }
            } }
        >
            ●
        </Link>
        <Link
          to={ {
              routeParams: {
                ...viewParams,
                selectedResourceId: active ? undefined : resource.id
              }
            } }
        >
          <Component
            contextualization={ contextualization }
            contextualizer={ contextualizer }

            assets={ assets }

            resource={ resource }
            renderingMode={ 'screened' }
          >
            {children}
          </Component>
        </Link>
        <Link
          to={ {
            routeParams: {
              ...viewParams,
              selectedResourceId: active ? undefined : resource.id
            }
          } }
        >
          ●
        </Link>
      </span>
    );
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
  data: PropTypes.shape( {
    asset: PropTypes.shape( {
      id: PropTypes.string
    } )
  } )
};

/**
 * Component's context used properties
 */
InlineAssetWrapper.contextTypes = {
  production: PropTypes.object,
  contextualizers: PropTypes.object,
  onAssetContextRequest: PropTypes.func,
  openAsideContextualization: PropTypes.func,
  bindContextualizationElement: PropTypes.func,
  productionAssets: PropTypes.object,
  viewParams: PropTypes.object,
};

export default InlineAssetWrapper;
