import React from 'react';
import PropTypes from 'prop-types';
import Link from './LinkProvider';

const SectionLink = ( {
  children,
  resourceId,
}, {
getViewForResourceId
} ) => (
  <Link
    to={ {
      routeClass: 'sections',
      viewId: getViewForResourceId( resourceId ),
      routeParams: {
        resourceId,
      }
    } }
  >
    {children}
  </Link>
);

SectionLink.contextTypes = {
  getViewForResourceId: PropTypes.func,
};

export default SectionLink;
