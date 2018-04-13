import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import PlanetsList from './list';
import PlanetsDetail from './details';

export default class PlanetsRoutes extends PureComponent {

  static propTypes = {
    match: PropTypes.object,
  }

  render() {
    const { match } = this.props;

    return (
      <div>
        <Switch>
          <Route exact path={`${match.url}/detail/:id`} component={PlanetsDetail} />
          <Route exact path={`${match.url}/page/:page`} component={PlanetsList} />
          <Redirect to={`${match.url}/page/1`} />
        </Switch>
      </div>
    )
  }
}
