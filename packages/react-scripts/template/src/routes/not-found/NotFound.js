import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

export default class NotFound extends PureComponent {

  static propTypes = {
    staticContext: PropTypes.shape({
      status: PropTypes.number,
    }),
  }

  componentWillMount() {
    const { staticContext } = this.props;

    if (typeof window === 'undefined' && staticContext) {
      staticContext.status = 404;
    }
  }

  render() {
    return (
      <div>
        <Helmet title="Not Found" />

        <h1>Not Found route</h1>
      </div>
    );
  }
}
