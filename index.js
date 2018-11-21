const root = document.querySelector('#root');

const svgNS = 'http://www.w3.org/2000/svg';

const svg = document.createElementNS(svgNS, 'svg');
// wtf is this shit
// https://stackoverflow.com/questions/28734628/how-can-i-set-an-attribute-with-case-sensitive-name-in-a-javascript-generated-el

svg.setAttribute('viewBox', '-101 -101 202 202');
svg.setAttribute('style', 'width: 300px; height: 300px;');


const bottomSection = document.createElementNS(svgNS, 'path');

bottomSection.setAttribute('stroke', 'white');
bottomSection.setAttribute('fill', 'none');

svg.appendChild(bottomSection);

const topSection = document.createElementNS(svgNS, 'path');

topSection.setAttribute('stroke', 'white');
topSection.setAttribute('fill', 'black');

render();


svg.appendChild(topSection);

root.appendChild(svg);



requestAnimationFrame(animate);

function animate(t) {
  render(t);
  requestAnimationFrame(animate);
}

function render(t) {
  const bandMovementRange = 10;

  const yBasis = -15;
  const period = 8000;

  const bandStartY = yBasis + Math.sin(t / period * 2 * Math.PI) * bandMovementRange;

  const bandThickness = 30;
  const bandEndY = yBasis + bandThickness +  Math.sin((t + 500) / period * 2 * Math.PI) * bandMovementRange;

  bottomSection.setAttribute('d', otherPathStuff(bandEndY, 100, degToRad(10)));
  topSection.setAttribute('d', pathStuff(bandStartY, 100, degToRad(10)));
}

function pathStuff(y, r, viewAngle) {
  const x = Math.sqrt(r**2 - y**2);

  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

  const yPrime = y * Math.cos(viewAngle);
  const rx = Math.sqrt(r**2 - yPrime**2);
  const ry = rx * Math.sin(viewAngle);

  if(y < 0) {
    const circlePath = `M ${-x} ${y} A ${r} ${r} 0 0 1 ${x} ${y}`;
    const ellipsePath = `A ${rx} ${ry} 0 1 1 ${-x} ${y}`;

    return [circlePath, ellipsePath].join(' ')
  }

  const circlePath = `M ${-x} ${y} A ${r} ${r} 0 1 1 ${x} ${y}`;
  const ellipsePath = `A ${rx} ${ry} 0 0 1 ${-x} ${y}`;
  const ellipsePathComplete = `A ${rx} ${ry} 0 1 1 ${x} ${y}`;

  return [circlePath, ellipsePath].join(' ')
}

function otherPathStuff(y, r, viewAngle) {
  const x = Math.sqrt(r**2 - y**2);

  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

  const yPrime = y * Math.cos(viewAngle);
  const rx = Math.sqrt(r**2 - yPrime**2);
  const ry = rx * Math.sin(viewAngle);

  if(y < 0) {
    const circlePath = `M ${-x} ${y} A ${r} ${r} 0 1 0 ${x} ${y}`;
    const ellipsePath = `A ${rx} ${ry} 0 0 0 ${-x} ${y}`;
    const ellipsePathComplete = `A ${rx} ${ry} 0 1 0 ${x} ${y}`;

    return [circlePath, ellipsePath, ellipsePathComplete].join(' ')
  }

  const circlePath = `M ${-x} ${y} A ${r} ${r} 0 0 0 ${x} ${y}`;
  const ellipsePath = `A ${rx} ${ry} 0 1 0 ${-x} ${y}`;
  const ellipsePathComplete = `A ${rx} ${ry} 0 0 0 ${x} ${y}`;

  return [circlePath, ellipsePath, ellipsePathComplete].join(' ')
}

function degToRad(deg) {
  return deg/180 * Math.PI
}