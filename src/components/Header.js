import React, { useState } from 'react';

import Link from './LinkProvider';

const Header = ( {
  // locationTitle,
  title,
  subtitle,
  description,
  authors,
} ) => {

  const [ isOpen, setIsOpen ] = useState( false );

  return (
    <header className={ `header ${isOpen ? 'is-open' : ''}` }>
      <h1 className={ 'title' }>
        <Link to={ {
          routeParams: {}
        } }
        >
          {title}
        </Link>
        <span onClick={ () => setIsOpen( !isOpen ) }>
          +
        </span>
      </h1>
      <div className={ 'additional-container' }>
        <div className={ 'main-header' }>

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
      </div>

    </header>
  );
};

export default Header;
