"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _peritextUtils = require("peritext-utils");

var _utils = require("../utils");

var _NotesContainer = _interopRequireDefault(require("./NotesContainer"));

var _Renderer = _interopRequireDefault(require("./Renderer"));

var _LinkProvider = _interopRequireDefault(require("./LinkProvider"));

var _ResourcePreview = _interopRequireDefault(require("./ResourcePreview"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Section extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "getChildContext", () => {
      const {
        // production = {},
        section
      } = this.props;
      return {
        notes: section.data.contents.notes,
        onNoteContentPointerClick: this.onNoteContentPointerClick
      };
    });

    _defineProperty(this, "componentWillUpdate", (nextProps, nextState, nextContext) => {
      /*
       * edge case of navigating mentions
       * within the same section
       */
      if (this.props.section.id === nextProps.section.id && this.state.gui.openedContextualizationId && !nextState.gui.openedContextualizationId && nextContext.asideVisible) {
        nextContext.toggleAsideVisible();
      }
    });

    _defineProperty(this, "onNoteContentPointerClick", noteId => {
      this.context.scrollToElementId(noteId);
    });

    _defineProperty(this, "onNotePointerClick", noteId => {
      this.context.scrollToElementId(`note-content-pointer-${noteId}`);
    });

    _defineProperty(this, "render", () => {
      const {
        props: {
          production,
          edition = {},
          section,
          displayHeader
        },
        context: {
          // dimensions,
          translate = {}
        },
        onNotePointerClick
      } = this;
      const {
        data: editionData = {}
      } = edition;
      const {} = editionData;
      const contents = section.data && section.data.contents ? section.data.contents.contents : {
        contents: {},
        notes: {},
        notesOrder: []
      };
      const sectionAuthors = section.metadata.authors || [];
      const sectionAsCSLRecord = (0, _utils.convertSectionToCslRecord)(section, production, edition);
      return _react.default.createElement("section", {
        className: 'main-contents-container section-player'
      }, _react.default.createElement(_peritextUtils.StructuredCOinS, {
        cslRecord: sectionAsCSLRecord
      }), _react.default.createElement("div", {
        className: 'main-column'
      }, _react.default.createElement("h1", {
        className: 'view-title section-title'
      }, _react.default.createElement("span", {
        className: 'title-content'
      }, (0, _peritextUtils.getResourceTitle)(section) || translate('untitled section') || 'Section sans titre'), _react.default.createElement(_LinkProvider.default, {
        to: {
          routeParams: {}
        }
      }, "\u2715")), displayHeader && _react.default.createElement(_ResourcePreview.default, {
        resource: section
      }), section.metadata.subtitle && _react.default.createElement("h2", {
        className: 'subtitle'
      }, section.metadata.subtitle), sectionAuthors.length > 0 && _react.default.createElement("h2", {
        className: 'authors'
      }, sectionAuthors && sectionAuthors.length > 0 && sectionAuthors.map((author, index) => _react.default.createElement("span", {
        key: index
      }, author.given, " ", author.family)).reduce((prev, curr) => [prev, ', ', curr])), _react.default.createElement("div", {
        className: 'main-contents-wrapper'
      }, _react.default.createElement(_Renderer.default, {
        raw: contents
      }))), Object.keys(section.data.contents.notes).length > 0 ? _react.default.createElement(_NotesContainer.default, {
        pointers: this.noteContentPointers,
        notes: section.data.contents.notes,
        notesOrder: section.data.contents.notesOrder,
        notesPosition: 'footnotes',
        title: translate('Notes'),
        id: 'notes-container',
        onNotePointerClick: onNotePointerClick
      }) : null);
    });

    this.state = {
      gui: {
        openedContextualizationId: undefined
      }
    };
  }

}

_defineProperty(Section, "contextTypes", {
  scrollToTop: _propTypes.default.func,
  dimensions: _propTypes.default.object
});

Section.childContextTypes = {
  notes: _propTypes.default.object,
  onNoteContentPointerClick: _propTypes.default.func
};
Section.contextTypes = {
  dimensions: _propTypes.default.object,
  production: _propTypes.default.object,
  scrollTopRatio: _propTypes.default.number,
  scrollTopAbs: _propTypes.default.number,
  scrollRatio: _propTypes.default.number,
  scrollHeight: _propTypes.default.number,
  scrollToTop: _propTypes.default.func,
  scrollToElementId: _propTypes.default.func,
  contextualizers: _propTypes.default.object,
  translate: _propTypes.default.func,
  citations: _propTypes.default.object,
  usedDocument: _propTypes.default.object,
  rawCitations: _propTypes.default.object,
  scrollToContextualization: _propTypes.default.func,
  scrollToElement: _propTypes.default.func,
  toggleAsideVisible: _propTypes.default.func,
  asideVisible: _propTypes.default.bool
};
var _default = Section;
exports.default = _default;