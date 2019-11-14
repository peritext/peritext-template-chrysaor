import React, { useEffect, useRef, useState } from 'react';
import {
  buildResourceSectionsSummary
} from 'peritext-utils';

import ResourceCard from './ResourceCard';
import PropTypes from 'prop-types';
import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';

const isBrowser = new Function( 'try {return this===window;}catch(e){ return false;}' );
const inBrowser = isBrowser();/* eslint no-new-func : 0 */

const ContentsColumn = function( {
  element,
  production,
  edition,
  translate,
  activeResourceId,
  activeElementId,
  selectedResourceId,
  numberOfColumns = 1,
  selectedContextualizationId,
  isDefaultActive,
}, {
  usedDocument
} ) {
  const realDocument = usedDocument || ( inBrowser ? document : {} );
  const { data = {} } = element;
  const containerRef = useRef( null );

  const {
    displayThumbnail,
    displayHeader,
  } = data;
  const title = data.customTitle || translate( 'Selection' );
  const sections = buildResourceSectionsSummary( { production, options: element.data } );
  let status = isDefaultActive ? 'is-active' : '';
  let activeResourceIndex;
  if ( activeElementId !== undefined && !isDefaultActive ) {
    status = activeElementId === ( element.id || 'nope' ) ? 'is-active' : 'is-collapsed';
    sections.some( ( { resourceId }, index ) => {
      if ( resourceId === activeResourceId ) {
        activeResourceIndex = index;
        return true;
      }
    } );
  }
  let relatedResourcesIds = [];
  let highlightedResources = {};
  if ( activeResourceId ) {
    relatedResourcesIds =
      Object.keys( production.contextualizations )
      .reduce( ( res, contextualizationId ) => {
        const contextualization = production.contextualizations[contextualizationId];
        if ( contextualization.sourceId === activeResourceId ) {
          highlightedResources[contextualization.targetId] = highlightedResources[contextualization.targetId] ?
          [ ...highlightedResources[contextualization.targetId], contextualization.id ] : [ contextualization.id ];
          return [
            ...res,
            contextualization.targetId
          ];
        }
        else if ( contextualization.targetId === activeResourceId ) {
          return [
            ...res,
            contextualization.sourceId
          ];
        }
        return res;
      }, [] );
  }
  relatedResourcesIds = intersection( relatedResourcesIds, sections.map( ( { resourceId } ) => resourceId ) );
  if ( selectedResourceId ) {
    highlightedResources = sections.reduce( ( res, { resourceId } ) => {
      const pointingContextualizationsIds = Object.keys( production.contextualizations )
      .filter( ( contextualizationId ) => {
        const contextualization = production.contextualizations[contextualizationId];
        return ( contextualization.sourceId === selectedResourceId && contextualization.targetId === resourceId );
      } );
      return pointingContextualizationsIds.length ? {
        ...res,
        [resourceId]: res[resourceId] ? uniq( [ ...res[resourceId], ...pointingContextualizationsIds ] ) : pointingContextualizationsIds
      } : res;
    }, highlightedResources );

  }

  useEffect( () => {
    if ( activeElementId === element.id && activeResourceId ) {
      setTimeout( () => {
        let targetElement;
        if ( selectedContextualizationId ) {
          targetElement = realDocument.getElementById( `${selectedContextualizationId}` );
        }
        else {
          targetElement = realDocument.getElementById( `${activeElementId}-${activeResourceId}` );
        }
        if ( targetElement ) {
          containerRef.current.scrollTop = targetElement.offsetTop - 80;
        }

      }, 1200 );

    }

  }, [ activeResourceId, selectedContextualizationId ] );

  useEffect( () => {
    if ( selectedResourceId ) {
      const target = realDocument.getElementById( `${element.id}-${selectedResourceId}` );
      if ( target ) {
        containerRef.current.scrollTop = target.offsetTop - 80;
      }
    }
  }, [ selectedResourceId ] );
  let maxWidth;
  if ( status === 'is-collapsed' && !Object.keys( highlightedResources ).length && !relatedResourcesIds.length ) {
    status = 'is-hidden';
    maxWidth = 0;
  }
  else if ( status === 'is-active' ) {
    // maxWidth = '50%';
  }
 else {
    maxWidth = `${100 / numberOfColumns }%`;
  }

  const [ parentScrollPosition, setParentScrollPosition ] = useState( 0 );
  const handleScroll = ( e ) => {
    setParentScrollPosition( e.target.scrollTop );
  };

  const onScrollToElementId = ( id ) => {
    const target = realDocument.getElementById( id );
    if ( target && containerRef.current ) {
      containerRef.current.scrollTop = target.offsetTop;
    }
  };

  const parentBoundingRect = containerRef && containerRef.current && containerRef.current.getBoundingClientRect();
  return (
    <section
      style={ {
        maxWidth,
        minWidth: status === 'is-collapsed' ? '10%' : undefined
      } }
      className={ `contents-column ${status}` }
    >
      <div className={ 'column-header' }>
        <h1>{title}</h1>
      </div>
      <ul
        ref={ containerRef }
        className={ 'cards-list' }
        id={ element.id || 'nope' }
        onScroll={ handleScroll }
      >
        {
          sections.map( ( { resourceId }, index ) => {
            let thatResourceStatus;
            if ( activeResourceId !== undefined ) {
              if ( activeResourceId === resourceId && status === 'is-active' ) {
                thatResourceStatus = 'is-active';
              }
             else if ( highlightedResources[resourceId] ) {
                thatResourceStatus = 'has-related';
              }
              else if ( index === activeResourceIndex - 1 || index === activeResourceIndex + 1 ) {
                thatResourceStatus = 'is-adjacent';
              }
              else if ( relatedResourcesIds.includes( resourceId ) ) {
                thatResourceStatus = 'is-related';
              }
              else {
                thatResourceStatus = 'is-collapsed';
              }
            }
            return (
              <ResourceCard
                key={ index }
                resource={ production.resources[resourceId] }
                elementId={ element.id }
                status={ thatResourceStatus }
                production={ production }
                isHighlighted={ selectedResourceId === resourceId }
                highlights={ highlightedResources[resourceId] }
                edition={ edition }
                displayThumbnail={ displayThumbnail }
                displayHeader={ displayHeader }
                parentBoundingRect={ parentBoundingRect }
                parentScrollPosition={ parentScrollPosition }
                onScrollToElementId={ onScrollToElementId }
              />
            );
          } )
        }
      </ul>
    </section>
  );
};

ContentsColumn.contextTypes = {
  usedDocument: PropTypes.object
};

export default ContentsColumn;
