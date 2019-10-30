import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { StructuredCOinS, getResourceTitle } from 'peritext-utils';

import { convertSectionToCslRecord } from '../utils';

import NotesContainer from './NotesContainer';
import Renderer from './Renderer';
// import SectionHead from './SectionHead';
import Link from './LinkProvider';
import ResourcePreview from './ResourcePreview';

class Section extends Component {

  static contextTypes = {
    scrollToTop: PropTypes.func,
    dimensions: PropTypes.object,
  }
  constructor ( props ) {
    super( props );
    this.state = {
      gui: {
        openedContextualizationId: undefined
      }
    };
  }

  getChildContext = () => {
    const {
      // production = {},
      section
    } = this.props;
    const {
      data: {
        contents = {
          contents: {},
          notesOrder: [],
          notes: {}
        }
      }
    } = section;
    return {
      notes: contents.notes,
      onNoteContentPointerClick: this.onNoteContentPointerClick,
    };
  }

  componentWillUpdate = ( nextProps, nextState, nextContext ) => {

    /*
     * edge case of navigating mentions
     * within the same section
     */
    if (
      this.props.section.id === nextProps.section.id
      && this.state.gui.openedContextualizationId
      && !nextState.gui.openedContextualizationId
      && nextContext.asideVisible
    ) {
      nextContext.toggleAsideVisible();
    }
  }

  onNoteContentPointerClick = ( noteId ) => {
    this.context.scrollToElementId( noteId );
  }

  onNotePointerClick = ( noteId ) => {
    this.context.scrollToElementId( `note-content-pointer-${noteId}` );
  }

  render = () => {
    const {
      props: {
        production,
        edition = {},
        section,
        displayHeader,
      },
      context: {
        // dimensions,
        translate = {},
      },
      onNotePointerClick,
    } = this;

    const {
      data: editionData = {}
    } = edition;

    const {
    } = editionData;

    const contents = ( section.data && section.data.contents ) ?
     section.data.contents.contents : {
       contents: {},
       notes: {},
       notesOrder: []
     };
    const sectionAuthors = section.metadata.authors || [];

    const sectionAsCSLRecord = convertSectionToCslRecord( section, production, edition );
    return (
      <section className={ 'main-contents-container section-player' }>
        {

         /*
          * <SectionHead
          * production={ production }
          * section={ section }
          * edition={ edition }
          * withHelmet
          * />
          */
        }
        <StructuredCOinS cslRecord={ sectionAsCSLRecord } />
        <div className={ 'main-column' }>
          <h1 className={ 'view-title section-title' }>
            <span className={ 'title-content' }>{getResourceTitle( section ) || ( translate( 'untitled section' ) || 'Section sans titre' )}</span>
            <Link
              to={ {
                routeParams: {}
              } }
            >
                ✕
            </Link>
          </h1>
          {
            displayHeader &&
            <ResourcePreview resource={ section } />
          }
          {section.metadata.subtitle && <h2 className={ 'subtitle' }>{section.metadata.subtitle}</h2>}
          {sectionAuthors.length > 0 &&
          <h2 className={ 'authors' }>
            {
                  sectionAuthors &&
                  sectionAuthors.length > 0 &&
                  sectionAuthors
                  .map( ( author, index ) => <span key={ index }>{author.given} {author.family}</span> )
                  .reduce( ( prev, curr ) => [ prev, ', ', curr ] )
                }
          </h2>
            }
          <div className={ 'main-contents-wrapper' }>
            <Renderer raw={ contents } />
          </div>

        </div>
        {section.data.contents && 
        Object.keys( section.data.contents.notes ).length > 0 ?
          <NotesContainer
            pointers={ this.noteContentPointers }
            notes={ section.data.contents.notes }
            notesOrder={ section.data.contents.notesOrder }
            notesPosition={ 'footnotes' }
            title={ translate( 'Notes' ) }
            id={ 'notes-container' }
            onNotePointerClick={ onNotePointerClick }
          />
           : null}
      </section>
    );
  }
}

Section.childContextTypes = {
  notes: PropTypes.object,
  onNoteContentPointerClick: PropTypes.func,
};

Section.contextTypes = {
  dimensions: PropTypes.object,
  production: PropTypes.object,
  scrollTopRatio: PropTypes.number,
  scrollTopAbs: PropTypes.number,
  scrollRatio: PropTypes.number,
  scrollHeight: PropTypes.number,
  scrollToTop: PropTypes.func,
  scrollToElementId: PropTypes.func,
  contextualizers: PropTypes.object,
  translate: PropTypes.func,
  citations: PropTypes.object,
  usedDocument: PropTypes.object,
  rawCitations: PropTypes.object,

  scrollToContextualization: PropTypes.func,
  scrollToElement: PropTypes.func,
  toggleAsideVisible: PropTypes.func,
  asideVisible: PropTypes.bool,
};

export default Section;
