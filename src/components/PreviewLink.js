import React from 'react';
import PropTypes from 'prop-types';

const PreviewLink = ( {
  to = {},
  children,
  onButtonClick,
}, {
  navigateTo,
  // activeViewId,
} ) => {
  const active = false; // to.viewId === activeViewId;

  return (
    <span
      onClick={ ( ) => {
        if ( typeof onButtonClick === 'function' ) {
          onButtonClick();
        }
        navigateTo( to );
      } }
      className={ `link ${active ? 'active' : ''}` }
    >
      {children}
    </span>
  );
};

PreviewLink.contextTypes = {
  navigateTo: PropTypes.func,
};

export default PreviewLink;
