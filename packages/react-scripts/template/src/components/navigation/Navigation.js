import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import s from './Navigation.scss';

export default class Navigation extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  };

  renderItem(component) {
    return (
      <li className={s.navigation__item}>
        {React.cloneElement(component, {
          className: s.navigation__link,
        })}
      </li>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <nav className={s.navigation}>
        <ul className={s.navigation__list}>
          {React.Children.map(children, this.renderItem)}
        </ul>
      </nav>
    );
  }
}
