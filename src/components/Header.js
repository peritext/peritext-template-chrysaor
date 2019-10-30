import React from 'react';

import Link from './LinkProvider';

const Header = ( {
  // locationTitle,
  title,
  subtitle,
  description,
  authors,
} ) => {

  return (
    <header className={ 'header' }>
      <div className={ 'main-header' }>
        <h1 className={ 'title' }>
          <Link to={ {
            routeParams: {}
          } }
          >
            {title}
          </Link>
        </h1>

        {
            subtitle &&
            <h2 className={ 'subtitle' }>
              {subtitle}
            </h2>
          }
        {
            authors && authors.length ?
              <h3 className={ 'authors' }>
                {
                authors.map( ( { given, family }, index ) => <span key={ index }>{given} {family}</span> )
              }
              </h3>
            : null
          }

      </div>
      <div className={ 'additional-header' }>

        {
            description &&
            <p className={ 'description' }>
              {description}
            </p>
          }
      </div>
    </header>
  );
};

export default Header;
