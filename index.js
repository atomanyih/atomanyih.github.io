const root = document.querySelector('#root');

const svgNS = 'http://www.w3.org/2000/svg';

const svg = document.createElementNS(svgNS, 'svg');
// wtf is this shit
// https://stackoverflow.com/questions/28734628/how-can-i-set-an-attribute-with-case-sensitive-name-in-a-javascript-generated-el

svg.setAttribute('viewBox', '-201 -201 402 402');
svg.setAttribute('style', 'width: 400px; height: 400px;');


const bottomSection = document.createElementNS(svgNS, 'path');

bottomSection.setAttribute('stroke', 'white');
bottomSection.setAttribute('stroke-width', '2');
bottomSection.setAttribute('fill', 'none');


const topSection = document.createElementNS(svgNS, 'path');

topSection.setAttribute('stroke', 'white');
topSection.setAttribute('stroke-width', '2');
topSection.setAttribute('fill', 'black');

const disc = document.createElementNS(svgNS, 'path');

disc.setAttribute('stroke', 'white');
disc.setAttribute('fill', 'none');

render(0);

svg.appendChild(bottomSection);
svg.appendChild(disc);
svg.appendChild(topSection);

root.appendChild(svg);



requestAnimationFrame(animate);

function animate(t) {
  render(t);
  requestAnimationFrame(animate);
}

function render(t) {
  const r = 200;
  const period = 8000;

  const viewAngle = degToRad(15 + Math.sin(t / (period * 4) * 2 * Math.PI) * 10);

  const bandMovementRange = r/10;
  const bandThickness = r/10 * 3;

  const yBasis = - bandThickness / 2;

  const bandStartY = yBasis + Math.sin(t / period * 2 * Math.PI) * bandMovementRange;

  const bandEndY = yBasis + bandThickness +  Math.sin((t + 500) / period * 2 * Math.PI) * bandMovementRange;


  bottomSection.setAttribute('d', lowerSphereSection(bandEndY, r, viewAngle));
  topSection.setAttribute('d', upperSphereSection(bandStartY, r, viewAngle));
  disc.setAttribute('d', sphereSlice(bandEndY, r, viewAngle));
}

function doCalc({y, r, viewAngle}) {
  const x = Math.sqrt(r**2 - y**2);

  const yPrime = y * Math.cos(viewAngle);
  const rx = Math.sqrt(r**2 - yPrime**2);
  const ry = rx * Math.sin(viewAngle);

  return {y, x, rx, ry}
}

function upperSphereSection(y, r, viewAngle) {
  const {x, rx, ry} = doCalc({y, r, viewAngle});

  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

  if(y < 0) {
    const circlePath = `M ${-x} ${y} A ${r} ${r} 0 0 1 ${x} ${y}`;
    const ellipsePath = `A ${rx} ${ry} 0 1 1 ${-x} ${y}`;

    return [circlePath, ellipsePath].join(' ')
  }

  const circlePath = `M ${-x} ${y} A ${r} ${r} 0 1 1 ${x} ${y}`;
  const ellipsePath = `A ${rx} ${ry} 0 0 1 ${-x} ${y}`;

  return [circlePath, ellipsePath].join(' ')
}

function lowerSphereSection(y, r, viewAngle) {
  const {x, rx, ry} = doCalc({y, r, viewAngle});

  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

  if(y < 0) {
    const circlePath = `M ${-x} ${y} A ${r} ${r} 0 1 0 ${x} ${y}`;
    const ellipsePath = `A ${rx} ${ry} 0 0 0 ${-x} ${y}`;

    return [circlePath, ellipsePath].join(' ')
  }

  const circlePath = `M ${-x} ${y} A ${r} ${r} 0 0 0 ${x} ${y}`;
  const ellipsePath = `A ${rx} ${ry} 0 1 0 ${-x} ${y}`;

  return [circlePath, ellipsePath].join(' ')
}

function sphereSlice(y, r, viewAngle) {
  // this should just be an <ellipse>

  const {x, rx, ry} = doCalc({y, r, viewAngle});

  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

  if(y > 0) {
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
  return deg/180 * Math.PI
}