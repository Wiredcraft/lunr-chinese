const lunr = require('lunr');
const segment = require('nodejieba');
const fs = require('fs');

const chineseRegx = /[\u4e00-\u9fa5]/;
let config;

const containChinese = (obj) => {
  if (!obj) return [];

  if (Array.isArray(obj)) {
    return obj.every((str) =>
      str
        .toString()
        .trim()
        .match(chineseRegx)
    );
  } else {
    return obj
      .toString()
      .trim()
      .match(chineseRegx);
  }
};

const tokenizChinses = (obj, method) => {
  if (Array.isArray(obj)) return obj.map((t) => lunr.utils.asString(t));

  const str = obj
    .toString()
    .trim()
    .toLowerCase();
  return segment[method](str, true);
};

lunr.trimmer = (token) => {
  return token.replace(/^\s+/, '').replace(/\s+$/, '');
};

lunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer');

lunr._tokenizer = lunr.tokenizer;

lunr.tokenizer = (obj, method) => {
  if (!arguments.length || !obj) return [];
  if (containChinese(obj)) {
    const availableMethods = [
      'cut',
      'cutAll',
      'cutHMM',
      'cutForSearch',
      'cutSmall'
    ];
    method =
      (availableMethods.indexOf(method) >= 0 && method) ||
      (config &&
        availableMethods.indexOf(config.method) >= 0 &&
        config.method) ||
      'cut';
    return tokenizChinses(obj, method);
  }

  return lunr._tokenizer(obj);
};

lunr.tokenizer.separator = lunr._tokenizer.separator;
lunr.tokenizer.load = lunr._tokenizer.load;
lunr.tokenizer.label = lunr._tokenizer.label;
lunr.tokenizer.registeredFunctions = lunr._tokenizer.registeredFunctions;

lunr.init = (idx, data, path) => {
  if (data) {
    if (!Array.isArray(data)) return idx;

    data.map((content) => idx.add(content));

    if (path) {
      fs.writeFile(path, JSON.stringify(idx), (err) => {
        if (err) throw err;

        console.log('>>> Generate Index complete!');
      });
    } else {
      return idx;
    }
  } else {
    return lunr.Index.load(idx);
  }
};

module.exports = (conf) => {
  config = conf;
  if (config) segment.load(config);
  return lunr;
};
