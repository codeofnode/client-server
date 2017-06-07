const _ = require(process.cwd()+'/_internal/mockObject').client(),
  testApi = require(process.cwd()+'/_internal/testApi');

var testData = [
  [
    'not_found',
    [],
    [
      [['_'],'ROUTE_NOT_FOUND']
    ]
  ]
];

testData.forEach(testApi.bind(null,exports,_));
