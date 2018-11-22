function createSVGElement(tagName) {
  const svgNS = 'http://www.w3.org/2000/svg';
  return document.createElementNS(svgNS, tagName);
}

export default createSVGElement;