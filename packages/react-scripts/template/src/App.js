import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import Helmet from 'react-helmet';
import AppLayout, { Content } from './components/app-layout';
import Devtools from '@ueno/react-scripts/lib/devtools';
import Navigation from './components/navigation';
import Header from './components/header';
import Home from './routes/home';
import About from './routes/about';
import Planets from './routes/planets';
import NotFound from './routes/not-found';
import './App.scss';
import './config';

@hot(module)
export default class App extends Component {
  render() {
    return (
      <AppLayout>
        <Helmet htmlAttributes={{ lang: 'en ' }} titleTemplate="Ueno. - %s">
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=no"
          />
        </Helmet>
        <Header>
          <Navigation>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/planets">Planets</Link>
          </Navigation>
        </Header>
        <Content>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route path="/planets" component={Planets} />
            <Route component={NotFound} />
          </Switch>
        </Content>
        <Devtools />
      </AppLayout>
    );
  }
}
