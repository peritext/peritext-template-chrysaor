import React from 'react';
import PropTypes from 'prop-types';
import { v4 as genId } from 'uuid';

const ResourcePreview = ( {
  resource
}, {
  contextualizers,
  productionAssets
} ) => {
  if ( ![ 'glossary', 'section' ].includes( resource.metadata.type ) ) {
    const ContextualizerComponent = contextualizers[resource.metadata.type] && contextualizers[resource.metadata.type].Block;
    const contextualizerId = genId();
    const contextualization = {
      contextualizerId,
      sourceId: resource.id,
      targetId: resource.id,
    };
    const contextualizer = {
      id: contextualizerId,
      type: resource.metadata.type,
      parameters: {}
    };
    return (
      <figure
        className={ `resource-preview block-contextualization-container ${ contextualizer.type}` }
        style={ { pointerEvents: 'none' } }
      >
        <ContextualizerComponent
          renderingMode={ 'screened' }
          resource={ resource }
          contextualization={ contextualization }
          contextualizer={ contextualizer }
          assets={ productionAssets }
        />
      </figure>
    );
  }
  return null;
};

ResourcePreview.contextTypes = {
  contextualizers: PropTypes.object,
  productionAssets: PropTypes.object,
};

export default ResourcePreview;
