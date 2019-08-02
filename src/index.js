import React from 'react';
import ReactDOM from 'react-dom';
import Orb from './Orb';

const root = document.querySelector('#root');

const App = () => {
  return (
    <Orchestrator/>
  )
};

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
