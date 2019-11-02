"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const styles = `
/**
 * DOCUMENTATION

This template is programmed according to mobile-first methodology (no media query = mobile version)

The organization is roughly as following :
0. template's CSS variables
1. first-level containers layout rules, for mobile, then tablet, then desktop version
2. reused components rules
3. view-specific rules

Used breakpoints
- tablet : 768px;
- desktop: 1224px;
 */
/**
 * =================
 * =================
 * =================
 * Default variables
 * =================
 * =================
 * =================
 */
:root 
{
  --transition-medium: 1000ms;


  --color-background: #ffffff;
  --color-link-default: #99B6BD;/* bleu délavé */
  --color-link-active:#D4613E;/* rouille */
  --color-text: #4d4c4c;

  --gutter-medium: 1rem;
  --gutter-large: 2rem;

  font-size: 18px;
}
html{
  scroll-behavior: smooth;
}

@media screen and (min-width: 1224px){
  :root{
    font-size: 15px;
  }
}

/**
 * =================
 * =================
 * =================
 * Resets
 * =================
 * =================
 * =================
 */
button{
  background: inherit;
  border: none;
  outline: none;
  cursor: pointer;
}

/**
 * =================
 * =================
 * =================
 * Register animated elements here
 * =================
 * =================
 * =================
 */
.chrysaor-layout .main-container
{
  transition: all ease var(--transition-medium);
}

/**
 * =================
 * =================
 * =================
 * Global layout, mobile version
 * =================
 * =================
 * =================
 */

/**
 * Main contents mobile layout
 */

.chrysaor-layout
{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: stretch;
  overflow: hidden;
  transition: all .5s ease;
}
.chrysaor-layout .main-container{
  flex: 1;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.chrysaor-layout .columns-container{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  justify-content: stretch;
}

.chrysaor-layout .contents-column{
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  justify-content: stretch;
  flex: 1;
  opacity: 1;
  transition: all .5s ease;
}

.chrysaor-layout .contents-column .column-header{
  padding: .5rem;
}

.chrysaor-layout .contents-column .column-header h1{
  margin: 0;
  font-size: 1rem;
}
.chrysaor-layout .contents-column.is-active{
  flex: 6;
}
/*
.chrysaor-layout .contents-column.is-collapsed:not(:hover){
  opacity: .5;
}*/
.chrysaor-layout .contents-column.is-collapsed{
  flex: 2;
}
.chrysaor-layout .contents-column.is-hidden{
  opacity: 0;
  max-width: 0;
}

.chrysaor-layout .contents-column .cards-list
{
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  scroll-behavior: smooth;
}

.chrysaor-layout .header{
  display: flex;
  flex-flow: row nowrap;
  justify-content: stretch;
  transition: all .5s ease;
}

.chrysaor-layout .header .main-header
{
  flex: 1;
  padding: .5rem;
}
.chrysaor-layout .header .additional-header{
  max-width: 50vw;
  padding: .5rem;
}

.chrysaor-layout .header .title{
  font-size: 1.2rem;
  padding: 0;
  margin: 0;
  transition: all .5s ease;
}

.chrysaor-layout .header .subtitle
{
  font-size: 1rem;
}

.chrysaor-layout .header .authors
{
  font-size: .8rem;
}

.chrysaor-layout .header .subtitle,
.chrysaor-layout .header .authors,
.chrysaor-layout .header .additional-header{
  max-height: 0;
  overflow: hidden;
  transition: all .5s ease;
  opacity: 0;
}
.chrysaor-layout .header:hover .subtitle,
.chrysaor-layout .header:hover .authors,
.chrysaor-layout .header:hover .additional-header{
  max-height: 100%;
  opacity: 1;
}

.chrysaor-layout .header:hover .main-header{
  padding: .5rem;
}

.chrysaor-layout .header .subtitle,
.chrysaor-layout .header .authors{
  margin: 0;
  margin-bottom: .2rem;
}

.chrysaor-layout .header .description{
  font-size: .8rem;
}

/**
 * =================
 * =================
 * =================
 * Global layout, tablet version
 * =================
 * =================
 * =================
 */
@media screen and (min-width: 768px) {
  
}

/**
 * =================
 * =================
 * =================
 * Global layout, desktop version
 * =================
 * =================
 * =================
 */
@media screen and (min-width: 1224px) {
  
}

/**
 * =================
 * =================
 * =================
 * Global layout, print version
 * =================
 * =================
 * =================
 */
@media print {

}

/**
 * ======
 * ======
 * ======
 * ======
 * ======
 * END of global layout rules
 * ======
 * ======
 * ======
 * ======
 * ======
 */

/**
 * ======
 * Components styling
 * ======
 */
/**
 * GENERAL TYPOGRAPHY
 */
.chrysaor-layout{
  text-rendering: optimizeLegibility;
  color: var(--color-text);
  font-family:"Fira Sans", serif;
}
.link,
a,
a:visited,
.inline-glossary
{
  color: var(--color-link-default);
  cursor: pointer;
  text-decoration: none;
}
.link.active,
.inline-glossary.active,
a:active{
  color: var(--color-link-active);
}

.chrysaor-layout sup{
  font-size: .5em;
}
/**
 * GENERAL COMPONENTS
 */
/* bibliographic citations */
.csl-entry {
    word-break: break-all;
}

/* views title */
.view-title{
  margin-top: 0;
}

/* views main contents */
/** we always keep the same padding left for main column
even when notes are in the end*/
.main-contents-container .main-column {
  padding-left: var(--content-margin-width);
  padding-right: var(--gutter-medium);
}

/**
 * RENDERED CONTENT (ANYTHING COMING FROM DRAFT)
 */
.rendered-content p,
.rendered-content ul,
.rendered-content ol,
.rendered-content blockquote,
.rendered-content pre,
.rendered-content .unstyled
{
  margin-bottom: var(--gutter-medium);
  line-height: 1.4;
}

.rendered-content .unstyled:not(:first-of-type){
  text-indent : 2em;
}

.has-view-class-sections .main-column .rendered-content .unstyled:first-of-type::first-letter{
  font-size:3.5em;
  padding-right:0.2em;
  padding-bottom: 0;
  float:left;
}
h1{
    font-size: 1.5em;
    margin-bottom: .5em;
}

.rendered-content blockquote{
  margin: 0;
  margin-bottom: var(--gutter-medium);
  padding: var(--gutter-medium);
  padding-left: var(--gutter-large);
  position: relative;
  background: rgba(0,0,0,0.03);
  quotes: '« ' ' »' '‹ ' ' ›';
}

/*
.note-item .rendered-content blockquote{
  padding: var(--gutter-small);
}
*/
.rendered-content blockquote:after
{
    position: absolute;
    right: 2px;
    bottom: 2px;

    content: close-quote;
}

.rendered-content blockquote:before
{
    position: absolute;
    top: 2px;
    left: 2px;
    content: open-quote;
}


/**
 * Figures (general)
 */
.block-contextualization-container,
.block-contextualization-container figure
{
  padding: 0;
  margin: 0;
}
.block-contextualization-container .figure-caption{
  /*border-top: 1px solid var(--color-link-default);*/
  padding-top: var(--gutter-medium);
}

.block-contextualization-container.is-active .figure-caption .link{
  color : var(--color-link-active);
}
.block-contextualization-container .figure-title{
  margin: 0;
}
.block-contextualization-container .figure-title .mention-context-pointer,
  .block-contextualization-container .figure-title button.mention-context-pointer{
  font-size: 1rem;
  padding: 0;
  text-align: left;
}
.block-contextualization-container .figure-legend{
  font-size: 1em;
  margin-top: 0;
}
.block-contextualization-container .figure-legend p{
  margin-top: 0;
}
.block-contextualization-container figure{
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  position: relative;
}
.block-contextualization-container img
{
  max-width: 100%;
  max-height: 100%;
}
.block-contextualization-container iframe
{
  min-height: 50vh;
  outline: none;
  border: none;
  width: 100%;
  max-width: 100%;  
  height: 100%;
}
/**
 * Figures (specific)
 */
.block-contextualization-container.bib .figure-caption{
  display: none;
}
.block-contextualization-container.image img{
  cursor: pointer;
  transition: opacity ease var(--transition-medium);
}
.block-contextualization-container.image img:hover{
  opacity: .8;
}
.block-contextualization-container.image .image-nav-container{
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
}
.block-contextualization-container.image .image-nav-item{
  list-style-type: none;
  cursor: pointer;
}

.block-contextualization-container.image .image-nav-item-counter{
  display: none;
}

.block-contextualization-container.image .image-nav-item::after{
  content : "◉";
  color: var(--color-link-default);
}
.block-contextualization-container.image .image-nav-item.is-active::after{
  color: var(--color-link-active);
}

.inline-contextualization-container.is-active .link{
  color: var(--color-link-active);
}

.inline-contextualization-container.image{
  cursor: pointer;
}

.inline-images-container img {
      max-width: 2rem;
      max-height: 1rem;
      padding-right: .3rem;
}

.block-contextualization-container.embed{
  min-height: 50vh;
  max-height: 80vh;
  position: absolute;
}

.block-contextualization-container.embed .fullscreen > div{
  height: 100%;
}

.block-contextualization-container.embed .fullscreen-btn{
  position : absolute;
  right: 1rem;
  bottom: 4rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: white;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.block-contextualization-container.embed .fullscreen .fullscreen-btn{
  right: 1rem;
  botttom: 1rem;
}

.block-contextualization-container.table{
  max-width: 100%;
  width: 100%;
}
.block-contextualization-container.table .static-table-container{
  max-width: 100%;
  width: 100%;
  position: relative;
  overflow: auto;
  height: 70vh;
}
.block-contextualization-container.table .static-table-container table{
  position: absolute;
  left: 0;
  top: 0;
}
.block-contextualization-container.table .ReactTable .rt-tbody{
  max-height: 70vh;
  overflow: auto;
}

.block-contextualization-container.table .ReactTable
{
    max-width: 100%;
}

.block-contextualization-container.table .ReactTable .-pagination
{
    height: 5rem;
}

.block-contextualization-container.table table th {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    text-align: left;
    font-weight: 400;
    text-indent: 0;
    font-size: .8em;
}

.block-contextualization-container.table table thead th {
  font-weight: 800;
}

.block-contextualization-container.vegaLite .vegaLite > div {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  padding: var(--gutter-medium);
}

/**
 * Inline (specific)
 * */
.block-contextualization-container.bib {
  cursor: pointer;
}

/**
 * BIG LISTS (GLOSSARY, REFERENCES, ...)
 */
.big-list-items-container{
  padding: 0;
}

.big-list-item-actions .link{
  font-size: .8rem;
  padding: 0;
}

.big-list-item{
  margin: 0;
  list-style-type: none;
  margin-bottom: var(--gutter-medium);
}
.big-list-item h1,
.big-list-item h2,
.big-list-item h3
{
  margin: 0;
}

.__react_component_tooltip{
  font-size: .5em;
}

/**
 * SECTION VIEW COMPONENTS STYLING
 */
.section-player{
  min-height: calc(100% - var(--gutter-medium) * 5);
  position: relative;
}

.section-player .section-title{
  display: flex;
  flex-flow: row nowrap;
  max-width: 100%;
  justify-content: stretch;
  overflow: hidden;
}

.section-player.is-sticky .section-title{
  position: fixed;
  background: var(--color-background);
  font-size: 1rem;
  left: 0;
  padding-left: 1.5rem;
  padding-right: 1rem;
  box-sizing: border-box;
  z-index: 1;
}

.section-player .section-title .title-content{
  flex: 1;
  // word-break: break-all;
}

.main-contents-container{
  overflow-x: hidden;
}

/**
 * Notes can be displayed as sidenotes starting from tablet
 */
@media screen and (min-width: 768px) {
  
}
@media screen and (min-width: 1224px) {
}
  
/** reset notes position in print and mobile*/
@media screen and (max-width: 768px) {
  
}
@media print {
  
}

/* notes */
.notes-list{
  margin-left: 0;
  padding-left: 0;
}
.note-item{
  list-style-type: none;
  margin: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  max-width: 100%;
}
.section-player.has-notes-position-sidenotes .note-item {
  max-width: calc(var(--content-margin-width) - 1rem);
  overflow: hidden;
}
.note-item > div{
  flex: 1;
  max-width: calc(100% - 1rem);
}
.note-block-pointer::after{
  content: '.';
  padding-right: var(--gutter-medium);
}

.notes-title{
  font-size: 1.1rem;
}

/**
 * Resource card component
 */

.resource-card{
  margin: .5rem;
  padding: 0;
  border: 1px solid lightgrey;
  cursor: pointer;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  transition: all .5s ease;
}

.resource-card .resource-card-content{
  max-height: 100%;
  overflow: hidden;
  padding: 0;
  transition: max-height .5s ease;
}

.resource-card.is-collapsed .resource-card-content > .link,
.resource-card.is-collapsed .resource-card-content > .link > .card-title{
  opacity: 1;
  transition: all .5s ease;
}

.resource-card .resource-card-content .card-title,
.resource-card .resource-card-content .card-authors
{
  margin: 0;
  padding: .5rem;
}

.resource-card .resource-card-content .card-title{
	font-size: 1rem;
}

.contents-column.is-collapsed .resource-card .resource-card-content .card-title{
	font-size: .7rem;
}

.resource-card.is-highlighted .link {
  color: var(--color-link-active);
}

.resource-card.is-active .resource-card-content{
  padding: 1rem;
}

.resource-card.is-collapsed{
  padding: 0;
  margin: 0;
  border: none;
}

.resource-card.is-collapsed .resource-card-content{
  max-height: .1rem;
  border: 1px solid lightgrey;
  margin: .1rem .5rem;;
}

.contents-column.is-active .resource-card.is-collapsed .resource-card-content{
  max-height: .5rem;
  border: 1px solid lightgrey;
  margin: .2rem .5rem;;
}

.resource-card.is-collapsed .resource-card-content > .link {
  opacity: 0;
}

.resource-card.is-collapsed .resource-card-content > .link > .card-title{
  margin: 0;
  padding: 0;
}

.excerpt{
  padding: .5rem;
  margin: .5rem;
  background: rgba(0,0,0,0.05);
  font-size: .6rem;
}
.excerpt .rendered-content div{
  margin-bottom: 0;
}

@media screen and (min-width: 1224px) {

}

/**
 *  =============
 * ANIMATIONS
 * ==============
 * */
@keyframes appear {
  0% {
      opacity: 0;
  }
  100% {
      opacity: 1;
  }
}


@-webkit-keyframes Gradient {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

@-moz-keyframes Gradient {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

@keyframes Gradient {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

`;
var _default = styles;
exports.default = _default;