import React from 'react';
import ReactDOM from 'react-dom';
import Orb from './Orb';

const root = document.querySelector('#root');

const App = () => {
  return (
    <Orchestrator/>
  )
};

const Link = (props) => <a {...props}  className="link-to-thing"/>

class Orchestrator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showText: true
    }
  }

  render() {
    const {showText} = this.state;

    return (
      <div>
        <div className="orb-layer">
          <Orb/>
        </div>
        <div className="title-layer">
          {
            showText && <h1 className="title">
              THINGS
            </h1>
          }
          <div className="list-of-things">
            <Link href="https://atomanyih.github.io/pixel">Pixel</Link>
            <Link href="https://atomanyih.github.io/lines">Lines</Link>
            <Link href="https://atomanyih.github.io/lines#circle">Circle</Link>
            <Link href="https://atomanyih.github.io/electric-sweater">Electric Sweater</Link>
            <Link href="https://atomanyih.github.io/solar">Solar</Link>
            <Link href="https://www.instagram.com/ahyousmugtitan/">Instagram</Link>
          </div>
        </div>
        <div className="name-layer">
          {
            showText && <a className="name" href="https://github.com/atomanyih" target="_blank">
              August Toman-Yih
            </a>
          }
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, root);
