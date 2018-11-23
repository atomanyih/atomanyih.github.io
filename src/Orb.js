import React from 'react';
import compose from "./compose";
import withAnimation from "./withAnimation";
import withVelocity from "./withVelocity";
import {BottomSphereSection, SphereSlice, TopSphereSection} from "./SphereSections";

// const fill = '#BE2222';

const r = 200;

const mix = (a, b, mix) => a * mix + b * (1 - mix);

const withMouseControl = Wrapped => class WithMouseControl extends React.Component {
  constructor(props) {
    super(props);

    // not using state so animation loop can control rerendering
    this.mouseX = 0;
    this.mouseY = 0;

    this.handleMouseMove = (event) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    };

    this.handleMouseLeave = () => {
      this.mouseLeave = true;
    };

    this.handleMouseEnter = () => {
      this.mouseLeave = false;
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseleave', this.handleMouseLeave);
    document.addEventListener('mouseenter', this.handleMouseEnter);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseleave', this.handleMouseLeave);
    document.removeEventListener('mouseenter', this.handleMouseEnter);
  }

  render() {
    const {viewAngle} = this.props;
    const yFactor = 2 * (window.innerHeight / 2 - this.mouseY) / window.innerHeight;
    const xFactor = Math.abs(2 * (window.innerWidth / 2 - this.mouseX) / window.innerWidth);

    const mouseViewAngle = mix(viewAngle, -30 * yFactor, this.mouseLeave ? 1 : xFactor);

    return <Wrapped {...{
      ...this.props,
      viewAngle: mouseViewAngle,
      yFactor,
      xFactor
    }}/>
  }
};

const withPeriodicStuff = Wrapped => (props) => {
  const {t} = props;
  const period = 16000;

  const viewAngle = Math.sin(t / (period * 4) * 2 * Math.PI) * 15;

  const bandMovementRange = r / 10;
  const bandThickness = r / 10 * 4;

  const yBasis = bandMovementRange;

  const bandStartY = yBasis + Math.sin(t / period * 2 * Math.PI) * bandMovementRange;

  const bandEndY = yBasis + bandThickness + Math.sin(t / (period * 1.1) * 2 * Math.PI) * bandMovementRange;

  return (
    <Wrapped {...props} {...{bandEndY, bandStartY, viewAngle}}/>
  )
};

const SliceOrb = ({viewAngle, bandStartY, bandEndY}) => {
  return (
    <svg className="orb" viewBox="-201 -201 402 402" style={{width: 400, height: 400}}>
      {
        viewAngle < 0
          ? (
            <React.Fragment>
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
            </React.Fragment>
          )
          : (
            <React.Fragment>
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
            </React.Fragment>
          )
      }
    </svg>
  )
};


const Orb = compose(
  withAnimation,
  withPeriodicStuff,
  withMouseControl,
  withVelocity(['viewAngle']),
)(SliceOrb);

export default Orb;