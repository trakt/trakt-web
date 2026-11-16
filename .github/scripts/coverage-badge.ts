const [summaryPath, outPath] = Bun.argv.slice(2);

const summary = await Bun.file(summaryPath).json();
const pct: number = summary.total.lines.pct;

const color =
  pct >= 80
    ? '#4c1'
    : pct >= 60
      ? '#dfb317'
      : pct >= 40
        ? '#fe7d37'
        : '#e05d44';

const label = 'coverage';
const value = `${pct.toFixed(1)}%`;
const charWidth = 7;
const labelWidth = label.length * charWidth + 10;
const valueWidth = value.length * charWidth + 10;
const width = labelWidth + valueWidth;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${label}: ${value}">
<title>${label}: ${value}</title>
<clipPath id="r"><rect width="${width}" height="20" rx="3" fill="#fff"/></clipPath>
<g clip-path="url(#r)">
<rect width="${labelWidth}" height="20" fill="#555"/>
<rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
</g>
<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
<text x="${labelWidth / 2}" y="14">${label}</text>
<text x="${labelWidth + valueWidth / 2}" y="14">${value}</text>
</g>
</svg>
`;

await Bun.write(outPath, svg);
