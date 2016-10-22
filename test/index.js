var test = require('tape').test
  , csv = require('../')
  , fs = require('fs')

test('adds csv to metadata', function (t) {
  var md = {}
    , files =  {
      'names.csv': {
        contents: fs.readFileSync(__dirname + '/names.csv')
      },
      'nested/gizmo.csv': {
        contents: fs.readFileSync(__dirname + '/nested/gizmo.csv')
      }
    }
    , ms = {
    metadata: function () {
      return md
    }
  }

  csv({ files: ['names.csv', 'nested/gizmo.csv']})(files, ms, function () {
    t.equal(md.names.length, 2, 'two items in names object')
    t.deepEqual(md.names[0], {name: 'Linus', age: '7'}, 'first row correct')
    t.deepEqual(md.names[1], {name: 'Decaf', age: '4'}, 'second row correct')
    t.equal(md.gizmo.length, 3, 'three gizmos')
    t.end()
  })
})

