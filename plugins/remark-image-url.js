const visit = require('unist-util-visit');

module.exports = () => (tree, file) => {
  visit(tree, ['image'], node => {
    node.url = `{require('${node.url}')`;
  });
};
