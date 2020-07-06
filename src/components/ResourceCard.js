import React from 'react';
import ResourcePreview from './ResourcePreview';
import Link from './LinkProvider';

import {
  getResourceTitle,
  buildContextContent,
} from 'peritext-utils';

import {
  ellipse
} from '../utils';
import Section from './Section';
import Renderer from './Renderer';

const ResourceCard = ( {
  resource,
  elementId = 'nope',
  displayThumbnail,
  production,
  edition,
  level,
  status = '',
  displayHeader,
  highlights = [],
  isHighlighted,
  parentBoundingRect,
  parentScrollPosition,
  onScrollToElementId,
} ) => {
  if ( status === 'is-active' ) {
    return (
      <li
        className={ `resource-card ${status} is-level-${level}` }
        id={ `${elementId}-${resource.id}` }
      >
        <div className={ 'resource-card-content' }>
          <Section
            {
            ...{
              production,
              edition,
              section: resource,
              displayHeader,
              parentBoundingRect,
              parentScrollPosition,
              onScrollToElementId,
              level,
            }
          }
          />
        </div>
      </li>
    );
  }
  const mentions = highlights.map( ( contextualizationId ) => {
    const mention = buildContextContent( production, contextualizationId );
    return {
      ...mention,
      contextualizationId,
    };
  } );
  const authors = resource.metadata.type === 'bib' ? resource.data.citations[0].author : resource.metadata.authors;
  return (
    <li
      className={ `resource-card ${status} ${isHighlighted ? 'is-highlighted' : ''}  is-level-${level}` }
      id={ `${elementId}-${resource.id}` }
    >
      <div className={ 'resource-card-content' }>

        {
          mentions.length ?
            <div className={ 'mentions-container' }>
              <Link to={ {
                // routeClass: 'resourcePage',
                routeParams: {
                  resourceId: resource.id,
                  elementId,
                }
              } }
              >
                <h2 className={ 'card-title' }>{resource.metadata.type === 'section' ? getResourceTitle( resource ) : ellipse( getResourceTitle( resource ) )}</h2>
                {
                  authors && authors.length > 0 &&
                  <p className={ 'card-authors' }>
                    {
                      authors
                      .filter( ( { family } ) => family && family.length )
                      .map( ( { family, given }, thatIndex ) =>
                        <span key={ thatIndex }>{given} {family}</span> )
                      .reduce( ( cur, el, index ) => [ ...cur, index === 0 ? '' : ', ', el ], [] )
                    }
                  </p>
                }
              </Link>
              {
                mentions.map( ( { contextualizationId, contents }, index ) => {
                  return (
                    <div
                      key={ index }
                      className={ 'excerpt' }
                    >
                      <Link to={ {
                        routeParams: {
                          resourceId: resource.id,
                          selectedContextualizationId: contextualizationId,
                          elementId,
                        }
                      } }
                      >
                        <Renderer raw={ contents } />
                      </Link>
                    </div>
                  );
                } )
              }
            </div>
          :
            <Link to={ {
              // routeClass: 'resourcePage',
              routeParams: {
                resourceId: resource.id,
                elementId,
              }
            } }
            >
              {
                displayThumbnail && status !== 'is-active' &&
                <ResourcePreview resource={ resource } />
              }
              <h2 className={ 'card-title' }>{ellipse( getResourceTitle( resource ) )}</h2>
              {
                authors && authors.length > 0 &&
                <p className={ 'card-authors' }>
                  {
                    authors.map( ( { family, given }, thatIndex ) =>
                      <span key={ thatIndex }>{given} {family}</span> )
                      .reduce( ( cur, el, index ) => [ ...cur, index === 0 ? '' : ', ', el ], [] )
                  }
                </p>
              }
            </Link>
        }
      </div>
    </li>
  );
};

export default ResourceCard;
