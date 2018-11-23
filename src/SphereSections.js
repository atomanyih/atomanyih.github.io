import React from "react";
const fill = '#141414';

const TopSphereSection = ({endY, r, viewAngle}) => (
  <path {...{
    d: upperSphereSection(doCalc({yPrime: endY, r, viewAngle: degToRad(viewAngle)})),
    stroke: 'white',
    strokeWidth: 3,
    fill
  }}/>
);

const BottomSphereSection = ({endY, r, viewAngle}) => (
  <path {...{
    d: lowerSphereSection(doCalc({yPrime: endY, r, viewAngle: degToRad(viewAngle)})),
    stroke: 'white',
    strokeWidth: 3,
    fill
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

const SpherePatty = ({y0, y1, r, viewAngle}) => (
  <path {...{
    d: spherePatty(
      doCalc({yPrime: y0, r, viewAngle: degToRad(viewAngle)}),
      doCalc({yPrime: y1, r, viewAngle: degToRad(viewAngle)}),
    ),
    stroke: 'white',
    strokeWidth: 3,
    fill
  }}/>
);

function doCalc({yPrime, r, viewAngle}) {
  const y = yPrime / Math.cos(viewAngle);
  const x = Math.sqrt(r ** 2 - y ** 2);
  const rx = Math.sqrt(r ** 2 - yPrime ** 2);
  const ry = rx * Math.sin(viewAngle);

  return {x, y, r, rx, ry}
}

function spherePatty(calc0, calc1) {
  const {
    x: x0, y: y0, r, rx: rx0, ry: ry0
  } = calc0;

  const {
    x: x1, y: y1, rx: rx1, ry: ry1
  } = calc1;

  return [
    `M ${-x0} ${y0}`, // startPath
    `A ${rx0} ${ry0} 0 ${y0 < 0 ? 0 : 1} 1 ${x0} ${y0}`, // topSlicePath
    `A ${r} ${r} 0 0 1 ${x1} ${y1}`, // rightCirclePath
    `A ${rx1} ${ry1} 0 ${y0 < 0 ? 1 : 0} 1 ${-x1} ${y1}`, // bottomSlicePath
    `A ${r} ${r} 0 0 1 ${-x0} ${y0}`, // leftCirclePath
    'Z',
  ].join(' ')
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

export {TopSphereSection, BottomSphereSection, SphereSlice, SpherePatty}