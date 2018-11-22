import createSVGElement from "./createSvgElement";

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

const createElements = () => {
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

  return {diagramSvg, diagramTopSlice, diagramBottomSlice, group};
};

const update = ({group, diagramTopSlice, diagramBottomSlice}, {viewAngle, bandStartY, bandEndY, r}) => {
  group.setAttribute('transform', `rotate(${-viewAngle})`);
  diagramTopSlice.setAttribute('d', slice1(doOtherCalc({y: bandStartY, r})));
  diagramBottomSlice.setAttribute('d', slice2(doOtherCalc({y: bandEndY, r})));
};

export { createElements, update };