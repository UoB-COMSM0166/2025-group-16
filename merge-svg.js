import fs from 'fs';
import { JSDOM } from 'jsdom';
import prettier from 'prettier';

async function mergeSVG(inputFilePath, outputFilePath = inputFilePath) {
  let prevSVG = null;
  let iterations = 0;
  const svgContent = fs.readFileSync(inputFilePath, 'utf-8');
  const dom = new JSDOM(svgContent, { contentType: 'image/svg+xml' });
  const document = dom.window.document;
  const svg = document.querySelector('svg');

  if (!svg) {
    console.error('No <svg> element found in the file');
    return;
  }

  while (true) {
    mergeRects(svg);
    const result = dom.serialize();

    if (prevSVG === result) break; // Stop if no changes
    prevSVG = result;
    iterations++;

    if (iterations > 10) {
      console.warn('Exceeded 10 merge iterations, possible issue');
      break;
    }
  }

  const formattedSVG = await prettier.format(dom.serialize(), {
    parser: 'html',
  });
  fs.writeFileSync(outputFilePath, formattedSVG);
  console.log(`Merge complete: ${outputFilePath}`);
}

function mergeRects(svg) {
  const rects = Array.from(svg.querySelectorAll('rect'));
  rects.sort((a, b) => {
    const ay = parseFloat(a.getAttribute('y'));
    const ax = parseFloat(a.getAttribute('x'));
    const by = parseFloat(b.getAttribute('y'));
    const bx = parseFloat(b.getAttribute('x'));
    return ax === bx ? ay - by : ax - bx;
  });

  const colorMap = {};
  rects.forEach((rect) => {
    const key = `${rect.getAttribute('fill')}${rect.getAttribute('filter')}`;
    if (!colorMap[key]) colorMap[key] = [];
    colorMap[key].push(rect);
  });

  const mergedRects = Object.values(colorMap).flatMap(mergeAdjacentRects);
  rects.forEach((rect) => svg.removeChild(rect));
  mergedRects.forEach((rect) => svg.appendChild(rect));
}

function mergeAdjacentRects(rects) {
  if (rects.length === 0) return [];
  const merged = [];
  let current = rects[0];

  for (let i = 1; i < rects.length; i++) {
    const next = rects[i];
    const [cx, cy, cw, ch] = ['x', 'y', 'width', 'height'].map((attr) =>
      parseFloat(current.getAttribute(attr)),
    );
    const [nx, ny, nw, nh] = ['x', 'y', 'width', 'height'].map((attr) =>
      parseFloat(next.getAttribute(attr)),
    );

    if (cy === ny && cx + cw === nx && ch === nh) {
      current.setAttribute('width', cw + nw);
    } else if (cx === nx && cy + ch === ny && cw === nw) {
      current.setAttribute('height', ch + nh);
    } else {
      merged.push(current);
      current = next;
    }
  }

  merged.push(current);
  return merged;
}

const inputFilePath = process.argv[2];
const outputFilePath = process.argv[3] || inputFilePath;

if (!inputFilePath) {
  console.error('Please provide an input SVG file path');
  process.exit(1);
}

mergeSVG(inputFilePath, outputFilePath);
