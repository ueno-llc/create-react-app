import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';

import s from './Intro.scss';

export default class Intro extends PureComponent {

  static propTypes = {
    heading: PropTypes.string,
    subheading: PropTypes.string,
    copy: PropTypes.string,
    toggle: PropTypes.bool,
  }

  componentWillReceiveProps(props) {
    if (props.toggle) {
      this.animate();
    } else {
      this.timeline.reversed(this.timeline.reverse());
    }
  }

  animate = () => {
    if (!this.heading || !this.copy) {
      return;
    }

    const timeline = new TimelineLite();
    const ease = 'Power4.easeInOut';

    timeline.staggerFromTo(
      [this.heading, this.subheading, this.copy],
      1,
      { autoAlpha: 0, x: -30 },
      { autoAlpha: 1, x: 0, ease },
      0.045,
    );

    this.timeline = timeline;
    return timeline;
  }

  render() {
    const { heading, subheading, copy } = this.props;

    return (
      <div className={s.intro}>
        <h1
          className={s.intro__heading}
          ref={(c) => { this.heading = c; }}
        >
          {heading}
        </h1>

        <h2
          className={s.intro__subheading}
          ref={(c) => { this.subheading = c; }}
        >
          {subheading}
        </h2>

        <p
          className={s.intro__copy}
          ref={(c) => { this.copy = c; }}
        >
          {copy}
        </p>
      </div>
    );
  }
}
