# lunr-chinese
Lunr addon, do words segment with nodejieba locally.

## Description
Build based on [lunr v0.72](https://github.com/olivernn/lunr.js) and [nodejieba](https://github.com/yanyiwu/nodejieba), add chinese tokenize and search available to lunr.

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
const lunr = require('lunr-chinese')

let idx = lunr(function() {
  this.ref('id')

  this.field('title', { boost: 10 })
  this.field('categories')
  this.field('body')
})

contents.map(content => idx.add(content))

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
