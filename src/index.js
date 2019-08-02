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
  
  color: ${({textColor}) => textColor};
  
  animation: fade-in-name 20000ms;
  animation-fill-mode: backwards;
`;

const Title = styled.div`
  font-size: 24px;
  letter-spacing: 0.5em;


  font-weight: 200;

  text-transform: uppercase;
`;

const Display = styled.div`
  background-color: ${({backgroundColor}) => backgroundColor};

  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Page = ({title, backgroundColor, textColor, children}) => {
  return (
    <div>
      <Display backgroundColor={backgroundColor}>
        {children}
      </Display>
      <Info textColor={textColor}>
        <Title>{title}</Title>
        <div className="name-layer">
          <a className="name" href="https://github.com/atomanyih" target="_blank">
            August Toman-Yih
          </a>
        </div>
      </Info>

    </div>
  );
};

const Orchestrator = () => {
  return (
    <Page title={'Orb'} backgroundColor={'#FFF'} textColor={'#141414'}>
      <Orb/>
      {/*<iframe src="//atomanyih.github.io/lines" frameborder="0" width={500} height={500}></iframe>*/}
    </Page>
  );
};

ReactDOM.render(<App/>, root);
