import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import s from './Button.scss';

export default class Button extends PureComponent {

  static propTypes = {
    to: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
  }

  render() {
    const { to, children, className, disabled, ...rest } = this.props;

    const isLink = typeof to !== 'undefined';
    const isExternal = isLink && /^((https?:)?\/\/|[0-9a-zA-Z]+:)/.test(to);

    rest.className = s(s.button, className, { disabled });
    rest.disabled = disabled;

    // http, https, //, mailto, etc.
    if (isExternal) {
      return (
        <a target="_blank" rel="noopener noreferrer" href={to} {...rest}>
          {children}
        </a>
      );
    }

    // Everything else
    if (isLink) {
      return (
        <Link to={to} {...rest}>
          {children}
        </Link>
      );
    }

    // Default
    return <button {...rest}>{children}</button>;
  }
}
