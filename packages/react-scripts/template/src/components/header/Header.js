import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import UenoLogo from './UenoLogo.svgx';

import s from './Header.scss';

export default class Header extends Component {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <header className={s.header}>
        <div className={s.header__container}>
          <div className={s.header__content}>
            <Link to="/" aria-label="Logo" className={s.header__logo}>
              <UenoLogo className={s.header__logoSvg} />
            </Link>

            <div className={s.header__navigation}>
              {children}
            </div>
          </div>
        </div>
      </header>
    );
  }
}
