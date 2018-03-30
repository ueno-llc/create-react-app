import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import s from './AppLayout.scss';

export default class AppLayout extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;

    return (
      <div className={s.layout}>
        {children}
      </div>
    );
  }
}
