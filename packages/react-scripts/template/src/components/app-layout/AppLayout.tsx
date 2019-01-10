import React from 'react';
import Helmet from 'react-helmet';
import { Header } from 'components/header/Header';
import { Devtools } from 'components/devtools/Devtools';
import s from './AppLayout.scss';

export class AppLayout extends React.PureComponent {
  public render = () => {
    return (
      <>
        <Helmet
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        >
          <html lang="en" />
        </Helmet>

        <Header />

        <div className={s.layout}>
          {this.props.children}
        </div>

        <Devtools />
      </>
    );
  }
}
