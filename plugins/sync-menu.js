const glob = require('glob');
const matter = require('gray-matter');
const fs = require('fs-extra');
const path = require('path');
const stringifyObject = require('stringify-object');
const chokidar = require('chokidar');

const srcPath = path.resolve(__dirname, '../src');

const sync = () => {
  const markdownFiles = glob.sync(path.resolve(srcPath, './content/**/{*.md,*.mdx}'));
  const menu = markdownFiles.map(v => {
    const relative = `@${path.relative(srcPath, v)}`.replace(/\\/g, '/');
    const url = relative.replace(/(^@content)|(\.[^.]+$)/g, '');
    const { data } = matter(fs.readFileSync(v, { encoding: 'utf8' }));
    return { title: data.title, exact: true, path: url, Component: `require('${relative}').default`};
  });
  const stringify = stringifyObject(menu, {
    transform: (obj, prop, originalResult) => {
      if (prop === 'Component') {
        return obj[prop];
      }
      return originalResult;
    },
  });
  fs.outputFileSync(path.resolve(srcPath, './.temp/temporary.js'), `module.exports = ${stringify};`);
};

module.exports = {
  sync,
  watch() {
    sync();
    chokidar.watch(path.resolve(srcPath, './content')).on('add', () => {
      sync();
    });
  },
};
