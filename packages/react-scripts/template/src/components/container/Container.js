import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Container.scss';

export default class Container extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <div className={s.container}>
        {children}
      </div>
    )
  }
}
