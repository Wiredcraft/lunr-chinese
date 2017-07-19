const test = require('ava')
const fs = require('fs')
const path = require('path')
const lunr = require('../index')()
const lunrChinese = require('../lunr-chinese')
const lunrChineseMin = require('../lunr-chinese.min')

const generateIndexFile = './test/generated-index-cn.json'

const tempData = [
  {
    id: 1,
    url: '/url1',
    categories: [
      '分类1',
      '中文'
    ],
    title: 'ava',
    description: '虽然 JavaScript 是单线程，但在 Node.js 里由于其异步的特性使得 IO 可以并行。AVA 利用这个优点让你的测试可以并发执行，这对于 IO 繁重的测试特别有用。另外，测试文件可以在不同的进程里并行运行，让每一个测试文件可以获得更好的性能和独立的环境。在 Pageres 项目中从 Mocha 切换 到 AVA 让测试时间从 31 秒下降到 11 秒。测试并发执行强制你写原子测试，意味着测试不需要依赖全局状态或者其他测试的状态，这是一件非常好的事情。'
  },
  {
    id: 2,
    url: '/url2',
    categories: [
      '分类2',
      '中文'
    ],
    title: 'electron',
    description: 'Electron框架，让您可使用JavaScript, HTML 及 CSS 编写桌面程序。 它是基于Node.js和Chromium开发的， Atom editor以及很多其他的apps就是使用Electron编写的。\n 请关注Twitter @ElectronJS 以获得重要通告。\n 这个项目将坚持贡献者盟约 code of conduct. 我们希望贡献者能遵守贡献者盟约，如果发现有任何不能接受的行为，请报告至electron@github.com(PS:请用英语)'
  },
  {
    id: 3,
    url: '/url3',
    categories: [
      '分类3',
      '中文'
    ],
    title: 'mobx',
    description: 'MobX 是一个经过测试的库，它通过透明的函数响应式编程(transparently applying functional reactive programming - TFRP)使得状态管理变得简单和可扩展。MobX背后的哲学很简单:\n 任何源自应用状态的东西都应该自动地获得。\n 其中包括UI、数据序列化、服务器通讯，等等。'
  }
]

const segmentWords = ['抹茶星冰乐®', '抹茶拿铁（热/冷）', '抹茶红豆芝士蛋糕']

const idxConfig = lunr(function () {
  this.ref('id')

  this.field('title', { boost: 10 })
  this.field('categories')
  this.field('description')
})

const lunrData = tempData.map(data => {
  data['categories'] = data.categories.join('')
  return data
})

test('generate lunr index', t => {
  t.plan(11)

  const lunrCnIdx = lunr.init(idxConfig, lunrData)

  const testResult = lunrCnIdx.search('测试')
  const JavaScriptResult = lunrCnIdx.search('项目')
  const javascriptResult = lunrCnIdx.search('javascript')
  const frameworkResult = lunrCnIdx.search('框架')

  t.is(testResult.length, 2)
  t.is(testResult[0].ref, 1)
  t.is(testResult[1].ref, 3)
  t.is(JavaScriptResult.length, 2)
  t.is(JavaScriptResult[0].ref, 2)
  t.is(JavaScriptResult[1].ref, 1)
  t.is(javascriptResult.length, 2)
  t.is(javascriptResult[0].ref, 2)
  t.is(javascriptResult[1].ref, 1)
  t.is(frameworkResult.length, 1)
  t.is(frameworkResult[0].ref, 2)
})

test.serial('generate chinese tokinzer index', t => {
  t.plan(1)

  let err = null

  try {
    lunr.init(idxConfig, lunrData, generateIndexFile)
  } catch (e) {
    err = e
  }

  t.falsy(err)
})

test.serial.cb('read generated index file and use', t => {
  fs.readFile(generateIndexFile, (err, data) => {
    t.plan(11)

    if (err) throw err

    const tokenizedSearchIndex = JSON.parse(data)

    const lunrCnIdx = lunrChinese.Index.load(tokenizedSearchIndex)

    const testResult = lunrCnIdx.search('测试')
    const JavaScriptResult = lunrCnIdx.search('项目')
    const javascriptResult = lunrCnIdx.search('javascript')
    const frameworkResult = lunrCnIdx.search('框架')

    t.is(testResult.length, 2)
    t.is(testResult[0].ref, 1)
    t.is(testResult[1].ref, 3)
    t.is(JavaScriptResult.length, 2)
    t.is(JavaScriptResult[0].ref, 2)
    t.is(JavaScriptResult[1].ref, 1)
    t.is(javascriptResult.length, 2)
    t.is(javascriptResult[0].ref, 2)
    t.is(javascriptResult[1].ref, 1)
    t.is(frameworkResult.length, 1)
    t.is(frameworkResult[0].ref, 2)
    t.end()
  })
})

test.serial.cb('read generated index file with init', t => {
  fs.readFile(generateIndexFile, (err, data) => {
    t.plan(11)

    if (err) throw err

    const tokenizedSearchIndex = JSON.parse(data)

    const lunrInit = lunrChinese.init(tokenizedSearchIndex)

    const testResult = lunrInit.search('测试')
    const JavaScriptResult = lunrInit.search('项目')
    const javascriptResult = lunrInit.search('javascript')
    const frameworkResult = lunrInit.search('框架')

    t.is(testResult.length, 2)
    t.is(testResult[0].ref, 1)
    t.is(testResult[1].ref, 3)
    t.is(JavaScriptResult.length, 2)
    t.is(JavaScriptResult[0].ref, 2)
    t.is(JavaScriptResult[1].ref, 1)
    t.is(javascriptResult.length, 2)
    t.is(javascriptResult[0].ref, 2)
    t.is(javascriptResult[1].ref, 1)
    t.is(frameworkResult.length, 1)
    t.is(frameworkResult[0].ref, 2)
    t.end()
  })
})

test.serial.cb('read generated index file and use with min version', t => {
  fs.readFile(generateIndexFile, (err, data) => {
    t.plan(11)

    if (err) throw err

    const tokenizedSearchIndex = JSON.parse(data)

    const lunrCnIdx = lunrChineseMin.Index.load(tokenizedSearchIndex)

    const testResult = lunrCnIdx.search('测试')
    const JavaScriptResult = lunrCnIdx.search('项目')
    const javascriptResult = lunrCnIdx.search('javascript')
    const frameworkResult = lunrCnIdx.search('框架')

    t.is(testResult.length, 2)
    t.is(testResult[0].ref, 1)
    t.is(testResult[1].ref, 3)
    t.is(JavaScriptResult.length, 2)
    t.is(JavaScriptResult[0].ref, 2)
    t.is(JavaScriptResult[1].ref, 1)
    t.is(javascriptResult.length, 2)
    t.is(javascriptResult[0].ref, 2)
    t.is(javascriptResult[1].ref, 1)
    t.is(frameworkResult.length, 1)
    t.is(frameworkResult[0].ref, 2)
    t.end()
  })
})

test.serial.cb('read generated index file init with min version', t => {
  fs.readFile(generateIndexFile, (err, data) => {
    t.plan(11)

    if (err) throw err

    const tokenizedSearchIndex = JSON.parse(data)

    const lunrInit = lunrChineseMin.init(tokenizedSearchIndex)

    const testResult = lunrInit.search('测试')
    const JavaScriptResult = lunrInit.search('项目')
    const javascriptResult = lunrInit.search('javascript')
    const frameworkResult = lunrInit.search('框架')

    t.is(testResult.length, 2)
    t.is(testResult[0].ref, 1)
    t.is(testResult[1].ref, 3)
    t.is(JavaScriptResult.length, 2)
    t.is(JavaScriptResult[0].ref, 2)
    t.is(JavaScriptResult[1].ref, 1)
    t.is(javascriptResult.length, 2)
    t.is(javascriptResult[0].ref, 2)
    t.is(javascriptResult[1].ref, 1)
    t.is(frameworkResult.length, 1)
    t.is(frameworkResult[0].ref, 2)
    t.end()
  })
})

test('special segment word disable demo', t => {
  t.plan(7)

  const result = segmentWords.map(word => lunr.tokenizer(word))
  t.is(result[0][0], '抹')
  t.is(result[0][1], '茶星')
  t.is(result[0][2], '冰乐')
  t.is(result[1][0], '抹')
  t.is(result[1][1], '茶拿铁')
  t.is(result[2][0], '抹')
  t.is(result[2][1], '茶')
})

test('special segment word enable demo', t => {
  t.plan(8)
  const customLunr = require('../index')({
    userDict: path.join(__dirname, 'userdict.utf8')
  })

  const customResult = segmentWords.map(word => customLunr.tokenizer(word))
  t.is(customResult[0][0], '抹茶')
  t.is(customResult[0][1], '星冰乐')
  t.is(customResult[1][0], '抹茶')
  t.is(customResult[1][1], '拿铁')
  t.is(customResult[2][0], '抹茶')
  t.is(customResult[2][1], '红豆')
  t.is(customResult[2][2], '芝士')
  t.is(customResult[2][3], '蛋糕')
})
