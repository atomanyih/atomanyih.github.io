import React from 'react';
import ReactDOM from 'react-dom';
import Orb from './src/Orb';

const root = document.querySelector('#root');

const App = () => {
  return (
    <div>
      <div className="orb-layer">
        <Orb/>
      </div>
      <div className="title-layer">
        <h1 className="title">
          THINGS
        </h1>
      </div>
      <div className="name-layer">
        <a className="name" href="https://github.com/atomanyih" target="_blank">
          August Toman-Yih
        </a>
      </div>
    </div>
  )
}

ReactDOM.render(<App/>, root);
