import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';

import Segment from 'components/segment';
import Button from 'components/button';

import Intro from './components/intro';

export default class About extends PureComponent {

  state = {
    toggleGsap: false,
  }

  componentDidMount() {
    this.setState({ toggleGsap: true });
  }

  handleClick = () => {
    this.setState({
      toggleGsap: !this.state.toggleGsap,
    });
  }

  render() {
    const { toggleGsap } = this.state;

    return (
      <div>
        <Helmet title="About" />

        <Intro
          heading="About route"
          subheading="Discover about us"
          copy="This is a copy for the about route. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Nulla malesuada interdum nibh. In hendrerit
          tellus nec enim convallis fringilla nec ut erat. Proin egestas
          erat vel scelerisque finibus."
          toggle={toggleGsap}
        />

        <Segment>
          <Button onClick={this.handleClick}>Toggle text</Button>
        </Segment>
      </div>
    );
  }
}
