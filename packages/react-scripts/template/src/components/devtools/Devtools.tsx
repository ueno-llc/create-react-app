import React from 'react';
import { GridOverlay } from './GridOverlay';

export class Devtools extends React.PureComponent {
  render() {
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }

    return (
      <React.Fragment>
        <GridOverlay columns={12} />
      </React.Fragment>
    );
  }
}
