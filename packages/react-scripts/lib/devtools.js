'use strict';

const React = require('react');
const prefix = '__ueno__devtools';
const s = name => {
  return `${prefix}__${name}`;
};

class DevTools extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { grid: false };
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onGridRef = this.onGridRef.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);

    try {
      const tmpState = JSON.parse(localStorage.getItem(prefix));
      if (tmpState) {
        this.state.grid = tmpState.grid;
      }
      this.setState(this.state);
    } catch (err) {
      // Failed to read from localStorage
    }

    if (this.state.grid === true) {
      this.gridRef.classList.add(s('gridVisible'));
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate() {
    try {
      localStorage.setItem(prefix, JSON.stringify(this.state));
    } catch (err) {
      console.warn('Failed writing devtools settings to localStorage');
    }
  }

  onKeyDown(e) {
    if (e.ctrlKey && e.keyCode === 76) {
      this.setState({
        grid: !this.state.grid,
      });
    }
  }

  onGridRef(ref) {
    this.gridRef = ref;
  }

  render() {
    const { grid } = this.state;
    return React.createElement(
      'div',
      {
        className: prefix,
      },
      React.createElement(
        'div',
        { className: s('container') },
        React.createElement(
          'div',
          {
            ref: this.onGridRef,
            className: [s('grid'), grid ? s('gridVisible') : ''].join` `,
          },
          Array.from({ length: 24 }).map(function(_, i) {
            return React.createElement(
              'div',
              { key: 'grid_column_' + i, className: s('grid__column') },
              React.createElement('div', { className: s('grid__visualize') })
            );
          })
        )
      )
    );
  }
}

module.exports =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? DevTools
    : () => null;
