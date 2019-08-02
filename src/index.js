import React from 'react';
import ReactDOM from 'react-dom';
import Orb from './Orb';
import styled from 'styled-components';

const root = document.querySelector('#root');

const App = () => {
  return (
    <Orchestrator/>
  );
};

const Info = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;

  display: flex;
  justify-content: space-between;
  
  color: white;
  
  animation: fade-in-name 20000ms;
  animation-fill-mode: backwards;
`;

const Title = styled.div`
  font-size: 24px;
  letter-spacing: 0.5em;


  font-weight: 200;

  text-transform: uppercase;
`;

const Orchestrator = () => {
  return (
    <div>
      <div className="orb-layer">
        <Orb/>
      </div>
      <Info>
        <Title>Orb</Title>
        <div className="name-layer">
          <a className="name" href="https://github.com/atomanyih" target="_blank">
            August Toman-Yih
          </a>
        </div>
      </Info>

    </div>
  );
};

ReactDOM.render(<App/>, root);
