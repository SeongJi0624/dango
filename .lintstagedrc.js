export default {
  'package.json': 'sort-package-json',
  '*.{js,jsx,ts,tsx,json,css}': 'biome check --write --no-errors-on-unmatched',
};
