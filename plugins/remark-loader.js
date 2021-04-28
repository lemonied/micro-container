const matter = require('gray-matter');
const stringifyObject = require('stringify-object');
const unified = require('unified');
const markdown = require('remark-parse');
const toHast = require('mdast-util-to-hast');
const toHtml = require('hast-util-to-html');

module.exports = async function (src) {
  const callback = this.async();
  const { content, data } = matter(src);
  const tree = await unified()
    .use(markdown)
    .parse(content);

  // const hast = toHast(ret);
  const code = `export const frontMatter = ${stringifyObject(data)};\n\n export default ${stringifyObject(tree)}`;
  console.log(code);
  return callback(null, code);
};
