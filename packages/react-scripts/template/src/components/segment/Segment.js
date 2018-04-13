import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Container from 'components/container';

import s from './Segment.scss';

export default class Segment extends PureComponent {

  static propTypes = {
    container: PropTypes.bool,
    children: PropTypes.node,
  }

  static defaultProps = {
    container: true,
  }

  render() {
    const { children, container } = this.props;

    const content = container ? <Container>{children}</Container> : children;

    return (
      <section className={s.segment}>
        {content}
      </section>
    );
  }
}
