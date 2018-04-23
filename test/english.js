const test = require('ava');
const fs = require('fs');
const lunr = require('../index')();
const lunrChinese = require('../lunr-chinese');
const lunrChineseMin = require('../lunr-chinese.min');

const generateIndexFile = './test/generated-index-en.json';

const tempData = [
  {
    id: 1,
    url: '/url1',
    categories: ['category1', 'english'],
    title: 'ava',
    description:
      "Even though JavaScript is single-threaded, IO in Node.js can happen in parallel due to its async nature. AVA takes advantage of this and runs your tests concurrently, which is especially beneficial for IO heavy tests. In addition, test files are run in parallel as separate processes, giving you even better performance and an isolated environment for each test file. Switching from Mocha to AVA in Pageres brought the test time down from 31 to 11 seconds. Having tests run concurrently forces you to write atomic tests, meaning tests don't depend on global state or the state of other tests, which is a great thing!"
  },
  {
    id: 2,
    url: '/url2',
    categories: ['category2', 'english'],
    title: 'electron',
    description:
      'The Electron framework lets you write cross-platform desktop applications using JavaScript, HTML and CSS. It is based on Node.js and Chromium and is used by the Atom editor and many other apps. \n Follow @ElectronJS on Twitter for important announcements. \n This project adheres to the Contributor Covenant code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to electron@github.com.'
  },
  {
    id: 3,
    url: '/url3',
    categories: ['category3', 'english'],
    title: 'mobx',
    description:
      'MobX is a battle tested library that makes state management simple and scalable by transparently applying functional reactive programming (TFRP). The philosophy behind MobX is very simple:\n Anything that can be derived from the application state, should be derived. Automatically.\n which includes the UI, data serialization, server communication, etc.'
  }
];

const idxConfig = lunr(function() {
  this.ref('id');

  this.field('title', { boost: 10 });
  this.field('categories');
  this.field('description');
});

const lunrData = tempData.map((data) => {
  data['categories'] = data.categories.join('');
  return data;
});

test('generate lunr index', (t) => {
  t.plan(11);

  const lunrEnIdx = lunr.init(idxConfig, lunrData);

  const testResult = lunrEnIdx.search('test');
  const JavaScriptResult = lunrEnIdx.search('JavaScript');
  const javascriptResult = lunrEnIdx.search('javascript');
  const frameworkResult = lunrEnIdx.search('framework');

  t.is(testResult.length, 2);
  t.is(testResult[0].ref, 1);
  t.is(testResult[1].ref, 3);
  t.is(JavaScriptResult.length, 2);
  t.is(JavaScriptResult[0].ref, 2);
  t.is(JavaScriptResult[1].ref, 1);
  t.is(javascriptResult.length, 2);
  t.is(javascriptResult[0].ref, 2);
  t.is(javascriptResult[1].ref, 1);
  t.is(frameworkResult.length, 1);
  t.is(frameworkResult[0].ref, 2);
});

test.serial('generate chinese tokinzer index', (t) => {
  t.plan(1);

  let err = null;

  try {
    lunr.init(idxConfig, lunrData, generateIndexFile);
  } catch (e) {
    err = e;
  }

  t.falsy(err);
});

test.serial.cb('read generated index file and use', (t) => {
  fs.readFile(generateIndexFile, (err, data) => {
    t.plan(11);

    if (err) throw err;

    const tokenizedSearchIndex = JSON.parse(data);

    const lunrEnIdx = lunrChinese.Index.load(tokenizedSearchIndex);

    const testResult = lunrEnIdx.search('test');
    const JavaScriptResult = lunrEnIdx.search('JavaScript');
    const javascriptResult = lunrEnIdx.search('javascript');
    const frameworkResult = lunrEnIdx.search('framework');

    t.is(testResult.length, 2);
    t.is(testResult[0].ref, 1);
    t.is(testResult[1].ref, 3);
    t.is(JavaScriptResult.length, 2);
    t.is(JavaScriptResult[0].ref, 2);
    t.is(JavaScriptResult[1].ref, 1);
    t.is(javascriptResult.length, 2);
    t.is(javascriptResult[0].ref, 2);
    t.is(javascriptResult[1].ref, 1);
    t.is(frameworkResult.length, 1);
    t.is(frameworkResult[0].ref, 2);
    t.end();
  });
});

test.serial.cb('read generated index file with init', (t) => {
  fs.readFile(generateIndexFile, (err, data) => {
    t.plan(11);

    if (err) throw err;

    const tokenizedSearchIndex = JSON.parse(data);

    const lunrInit = lunrChinese.init(tokenizedSearchIndex);

    const testResult = lunrInit.search('test');
    const JavaScriptResult = lunrInit.search('JavaScript');
    const javascriptResult = lunrInit.search('javascript');
    const frameworkResult = lunrInit.search('framework');

    t.is(testResult.length, 2);
    t.is(testResult[0].ref, 1);
    t.is(testResult[1].ref, 3);
    t.is(JavaScriptResult.length, 2);
    t.is(JavaScriptResult[0].ref, 2);
    t.is(JavaScriptResult[1].ref, 1);
    t.is(javascriptResult.length, 2);
    t.is(javascriptResult[0].ref, 2);
    t.is(javascriptResult[1].ref, 1);
    t.is(frameworkResult.length, 1);
    t.is(frameworkResult[0].ref, 2);
    t.end();
  });
});

test.serial.cb('read generated index file and use with min version', (t) => {
  fs.readFile(generateIndexFile, (err, data) => {
    t.plan(11);

    if (err) throw err;

    const tokenizedSearchIndex = JSON.parse(data);

    const lunrEnIdx = lunrChineseMin.Index.load(tokenizedSearchIndex);

    const testResult = lunrEnIdx.search('test');
    const JavaScriptResult = lunrEnIdx.search('JavaScript');
    const javascriptResult = lunrEnIdx.search('javascript');
    const frameworkResult = lunrEnIdx.search('framework');

    t.is(testResult.length, 2);
    t.is(testResult[0].ref, 1);
    t.is(testResult[1].ref, 3);
    t.is(JavaScriptResult.length, 2);
    t.is(JavaScriptResult[0].ref, 2);
    t.is(JavaScriptResult[1].ref, 1);
    t.is(javascriptResult.length, 2);
    t.is(javascriptResult[0].ref, 2);
    t.is(javascriptResult[1].ref, 1);
    t.is(frameworkResult.length, 1);
    t.is(frameworkResult[0].ref, 2);
    t.end();
  });
});

test.serial.cb('read generated index file init with min version', (t) => {
  fs.readFile(generateIndexFile, (err, data) => {
    t.plan(11);

    if (err) throw err;

    const tokenizedSearchIndex = JSON.parse(data);

    const lunrInit = lunrChineseMin.init(tokenizedSearchIndex);

    const testResult = lunrInit.search('test');
    const JavaScriptResult = lunrInit.search('JavaScript');
    const javascriptResult = lunrInit.search('javascript');
    const frameworkResult = lunrInit.search('framework');

    t.is(testResult.length, 2);
    t.is(testResult[0].ref, 1);
    t.is(testResult[1].ref, 3);
    t.is(JavaScriptResult.length, 2);
    t.is(JavaScriptResult[0].ref, 2);
    t.is(JavaScriptResult[1].ref, 1);
    t.is(javascriptResult.length, 2);
    t.is(javascriptResult[0].ref, 2);
    t.is(javascriptResult[1].ref, 1);
    t.is(frameworkResult.length, 1);
    t.is(frameworkResult[0].ref, 2);
    t.end();
  });
});
