import React from 'react';
import ReactDOM from 'react-dom';

const root = document.querySelector('#root');

const withAnimation = Wrapped => class WithAnimation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      t: 0
    };
  }

  componentDidMount() {
    const update = t => this.setState({t});

    const loop = t => {
      update(t);
      this.rafHandle = requestAnimationFrame(loop);
    };

    loop()
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafHandle);
  }

  render() {
    return <Wrapped {...this.props} t={this.state.t}/>
  }
};

const r = 200;

const withPeriodicStuff = Wrapped => ({t}) => {
  const period = 16000;

  const viewAngle = Math.sin(t / (period * 4) * 2 * Math.PI) * 30;

  const bandMovementRange = r / 10;
  const bandThickness = r / 10 * 5;

  const yBasis = 0;

  const bandStartY = yBasis + Math.sin(t / period * 2 * Math.PI) * bandMovementRange;

  const bandEndY = yBasis + bandThickness + Math.sin((t + period / 8) / period * 2 * Math.PI) * bandMovementRange;

  return (
    <Wrapped {...{bandEndY, bandStartY, viewAngle}}/>
  )
}

const SliceOrb = ({viewAngle, bandStartY, bandEndY}) => {
  if (viewAngle < 0) {
    return (
      <svg viewBox="-201 -201 402 402" style={{width: 400, height: 400}}>
        <TopSphereSection {...{
          endY: bandStartY,
          r,
          viewAngle
        }}/>

        <SphereSlice {...{
          y: bandStartY,
          r,
          viewAngle
        }}/>

        <BottomSphereSection {...{
          endY: bandEndY,
          r,
          viewAngle
        }}/>
      </svg>
    )
  }

  return (
    <svg viewBox="-201 -201 402 402" style={{width: 400, height: 400}}>
      <BottomSphereSection {...{
        endY: bandEndY,
        r,
        viewAngle
      }}/>
      <SphereSlice {...{
        y: bandEndY,
        r,
        viewAngle
      }}/>
      <TopSphereSection {...{
        endY: bandStartY,
        r,
        viewAngle
      }}/>
    </svg>
  )
}

const TopSphereSection = ({endY, r, viewAngle}) => (
  <path {...{
    d: upperSphereSection(doCalc({yPrime: endY, r, viewAngle: degToRad(viewAngle)})),
    stroke: 'white',
    strokeWidth: 2,
    fill: '#141414'
  }}/>
);

const BottomSphereSection = ({endY, r, viewAngle}) => (
  <path {...{
    d: lowerSphereSection(doCalc({yPrime: endY, r, viewAngle: degToRad(viewAngle)})),
    stroke: 'white',
    strokeWidth: 2,
    fill: '#141414'
  }}/>
);

const SphereSlice = ({y, r, viewAngle}) => (
  <path {...{
    d: sphereSlice(doCalc({yPrime: y, r, viewAngle: degToRad(viewAngle)})),
    stroke: 'white',
    strokeWidth: 1,
    fill: 'none'
  }}/>
);

const Orb = withAnimation(withPeriodicStuff(SliceOrb));

ReactDOM.render(<Orb/>, root);


function doCalc({yPrime, r, viewAngle}) {
  const y = yPrime / Math.cos(viewAngle);
  const x = Math.sqrt(r ** 2 - y ** 2);
  const rx = Math.sqrt(r ** 2 - yPrime ** 2);
  const ry = rx * Math.sin(viewAngle);

  return {x, y, r, rx, ry}
}

function upperSphereSection({x, y, r, rx, ry}) {
  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

  if (y < 0) {
    const circlePath = `M ${-x} ${y} A ${r} ${r} 0 0 1 ${x} ${y}`;
    const ellipsePath = `A ${rx} ${ry} 0 1 1 ${-x} ${y}`;

    return [circlePath, ellipsePath].join(' ')
  }

  const circlePath = `M ${-x} ${y} A ${r} ${r} 0 1 1 ${x} ${y}`;
  const ellipsePath = `A ${rx} ${ry} 0 0 1 ${-x} ${y}`;

  return [circlePath, ellipsePath].join(' ')
}

function lowerSphereSection({x, y, r, rx, ry}) {

  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

  if (y < 0) {
    const circlePath = `M ${-x} ${y} A ${r} ${r} 0 1 0 ${x} ${y}`;
    const ellipsePath = `A ${rx} ${ry} 0 0 0 ${-x} ${y}`;

    return [circlePath, ellipsePath].join(' ')
  }

  const circlePath = `M ${-x} ${y} A ${r} ${r} 0 0 0 ${x} ${y}`;
  const ellipsePath = `A ${rx} ${ry} 0 1 0 ${-x} ${y}`;

  return [circlePath, ellipsePath].join(' ')
}

function sphereSlice({x, y, r, rx, ry}) {
  // this should just be an <ellipse>

  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

  if (y > 0) {
    // why is this still necessary?
    // why is the large arc flag reversed?
    // I think maybe bc I'm drawing now the top part of the ellipse first
    const start = `M ${-x} ${y}`;
    const ellipsePath = `A ${rx} ${ry} 0 0 0 ${x} ${y}`;
    const ellipsePathComplete = `A ${rx} ${ry} 0 1 0 ${-x} ${y}`;

    return [start, ellipsePath, ellipsePathComplete].join(' ')
  }
  const start = `M ${-x} ${y}`;
  const ellipsePath = `A ${rx} ${ry} 0 1 0 ${x} ${y}`;
  const ellipsePathComplete = `A ${rx} ${ry} 0 0 0 ${-x} ${y}`;

  return [start, ellipsePath, ellipsePathComplete].join(' ')
}

function degToRad(deg) {
  return deg / 180 * Math.PI
}