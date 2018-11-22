const root = document.querySelector('#root');

function createSVGElement(tagName) {
  const svgNS = 'http://www.w3.org/2000/svg';
  return document.createElementNS(svgNS, tagName);
}

const svg = createSVGElement('svg');
// wtf is this shit
// https://stackoverflow.com/questions/28734628/how-can-i-set-an-attribute-with-case-sensitive-name-in-a-javascript-generated-el

svg.setAttribute('viewBox', '-201 -201 402 402');
svg.setAttribute('style', 'width: 400px; height: 400px;');


const bottomSection = createSVGElement('path');

bottomSection.setAttribute('stroke', 'white');
bottomSection.setAttribute('stroke-width', '2');
bottomSection.setAttribute('fill', 'none');


const topSection = createSVGElement('path');

topSection.setAttribute('stroke', 'white');
topSection.setAttribute('stroke-width', '2');
topSection.setAttribute('fill', '#141414');

const disc = createSVGElement('path');

disc.setAttribute('stroke', 'white');
disc.setAttribute('fill', 'none');

svg.appendChild(bottomSection);
svg.appendChild(disc);
svg.appendChild(topSection);

// -----

const diagramSvg = createSVGElement('svg');
diagramSvg.setAttribute('viewBox', '-201 -201 402 402');
diagramSvg.setAttribute('style', 'width: 400px; height: 400px;');

const diagramTopSlice = createSVGElement('path');
diagramTopSlice.setAttribute('stroke', 'white');
diagramTopSlice.setAttribute('stroke-width', 2);
diagramTopSlice.setAttribute('fill', 'none');

const diagramBottomSlice = createSVGElement('path');
diagramBottomSlice.setAttribute('stroke', 'white');
diagramBottomSlice.setAttribute('stroke-width', 2);
diagramBottomSlice.setAttribute('fill', 'none');

const group = createSVGElement('g');

group.appendChild(diagramTopSlice);
group.appendChild(diagramBottomSlice);

diagramSvg.appendChild(group);


root.appendChild(svg);
// root.appendChild(diagramSvg);


requestAnimationFrame(animate);

function animate(t) {
  render(getPositions(t));
  requestAnimationFrame(animate);
}

function getPositions(t) {
  const r = 200;
  const period = 16000;

  const viewAngle = 15 + Math.sin(t / (period * 4) * 2 * Math.PI) * 10;

  const bandMovementRange = r / 10;
  const bandThickness = r / 10 * 5;

  const yBasis = 0;

  const bandStartY = yBasis + Math.sin(t / period * 2 * Math.PI) * bandMovementRange;

  const bandEndY = yBasis + bandThickness + Math.sin((t + period / 8) / period * 2 * Math.PI) * bandMovementRange;

  return {bandStartY, bandEndY, r, viewAngle};
}

function render({bandStartY, bandEndY, r, viewAngle}) {
  updateOrb({bandStartY, bandEndY, r, viewAngle});

  group.setAttribute('transform', `rotate(${-viewAngle})`);
  diagramTopSlice.setAttribute('d', slice1(doOtherCalc({y: bandStartY, r})));
  diagramBottomSlice.setAttribute('d', slice2(doOtherCalc({y: bandEndY, r})));
}

function updateOrb({bandStartY, bandEndY, r, viewAngle}) {
  const viewAngleRad = degToRad(viewAngle);

  bottomSection.setAttribute('d', lowerSphereSection(doCalc({yPrime: bandEndY, r, viewAngle: viewAngleRad})));
  topSection.setAttribute('d', upperSphereSection(doCalc({yPrime: bandStartY, r, viewAngle: viewAngleRad})));
  disc.setAttribute('d', sphereSlice(doCalc({yPrime: bandEndY, r, viewAngle: viewAngleRad})));
}

function slice1({r, sliceR, y}) {
  if (y < 0) {
    return `M ${-sliceR} ${y} L ${sliceR} ${y} A ${r} ${r} 0 0 0 ${-sliceR} ${y}`
  }

  return `M ${-sliceR} ${y} L ${sliceR} ${y} A ${r} ${r} 0 1 0 ${-sliceR} ${y}`
}

function slice2({r, sliceR, y}) {
  if (y < 0) {
    return `M ${-sliceR} ${y} L ${sliceR} ${y} A ${r} ${r} 0 1 1 ${-sliceR} ${y}`
  }

  return `M ${-sliceR} ${y} L ${sliceR} ${y} A ${r} ${r} 0 0 1 ${-sliceR} ${y}`
}


function doOtherCalc({y, r}) {
  const sliceR = Math.sqrt(r ** 2 - y ** 2);

  return {y, r, sliceR};
}

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