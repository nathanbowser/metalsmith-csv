var path = require('path')
  , stream = require('stream')
  , es = require('event-stream')
  , csv = require('csv-streamify')

module.exports = function (opts) {
  opts = opts || {}
  opts.files = opts.files || []
  opts.parserOpts = opts.parserOpts || {
    objectMode: true,
    columns: true
  }

  return function (files, metalsmith, next) {
    var metadata = metalsmith.metadata()
      , calls = opts.files.length
      , done = function () {
        if (--calls === 0) {
          next()
        }
      }

    opts.files.forEach(function (f) {
      if (!files[f]) {
        return done()
      }

      (function (_f) {
        var name = path.basename(_f, '.csv')
          , bs = new stream.PassThrough

        metadata[name] = []

        bs.end(files[_f].contents)

        bs.pipe(csv(opts.parserOpts))
          .on('data', function (d) {
            metadata[name].push(d)
          })
          .on('end', done)
      })(f)
    })
  }
}
