# lunr-chinese
Lunr addon, do words segment with nodejieba locally.

## Description
Build based on [lunr v0.72](https://github.com/olivernn/lunr.js) and [nodejieba](https://github.com/yanyiwu/nodejieba), add chinese tokenize and search available to lunr.

> The lib not use the lunr v2+ is for the lunr v2+ changes the tokenize method mainly, and which is an improve of the performance for English only, not suitable for Chinese. 

new method
`lunr.init(idx, data, path)`

return lunr instance with generated lunr index `lunr.init(generatedIndex)`  
return lunr instance with `lunr.init(idx, data(array))`  
generate lunr index into file `lunr.init(idx, data(array), path)`  

search with
`lunrInstance.search('例子')`

## Install

```
npm i lunr-chinese --save-dev
```

For front-end use the build file `lunr-chinese`, `lunr-chinese.min.js` in the project, which will return the `lunr` instance for use.

## Usage
```JavaScript
const lunr = require('lunr-chinese')()

let idx = lunr(function() {
  this.ref('id')

  this.field('title', { boost: 10 })
  this.field('categories')
  this.field('body')
})

const postContents = contents.map(content => idx.add(content))

// get the Lunr instance(use locally)
const lunrCn = lunr.init(idx, postContents)
lunrCn.search('例子')

// generate the Lunr Index file
lunr.init(idx, postContents, 'path/lunrCnIndexs.json')
```

Load and work with generated index file.

```JavaScript
// load `lunr` from lunr-chinese.js

var lunrCnIndexs = JSON.parse(lunrCnIndexsString)
var chineseLunr = lunr.init(lunrCnIndexs)

chineseLunr.search('例子')
```

To use custom dictionary like this
```
const lunr = require('lunr-chinese')({
  dict: nodejieba.DEFAULT_DICT,
  hmmDict: nodejieba.DEFAULT_HMM_DICT,
  userDict: './test/testdata/userdict.utf8',
  idfDict: nodejieba.DEFAULT_IDF_DICT,
  stopWordDict: nodejieba.DEFAULT_STOP_WORD_DICT
})
```

an example of the custom doc file
```
抹茶 n
星冰乐 n
拿铁 n
```

for more details check [CppJieba字典](https://github.com/yanyiwu/cppjieba/tree/master/dict)
