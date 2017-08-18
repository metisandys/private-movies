var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var multipart = require('multipart')
var morgan = require('morgan');
var logger = morgan('dev');
var mongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000
var app = express()
var fs = require('fs')
var dbUrl = 'mongodb://localhost:27017/wuch'

mongoose.Promise = global.Promise;
mongoose.connect(dbUrl,{useMongoClient: true})

// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)

app.set('views', './app/views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use(cookieParser())
//app.use(multipart())
app.use(session({
  secret: 'mgot',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  }),
  resave: false,
  saveUninitialized: true
}))

//if ('development' === app.get('env')) {
//	app.set('showStackError', true)
//	app.use(logger('dev'))
//	app.locals.pretty = true
//	mongoose.set('debug', true)
//}




app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
app.listen(port)

require('./config/routes')(app)
console.log('node start on port' + port)

// update page
// app.get('/admin/update/:id', function(req, res) {
//     res.render('admin', {
//         title: '爱电影 后台录入页',
//         movie: {
//             title: '',
//             doctor: '',
//             country: '',
//             year: '',
//             poster: '',
//             flash: '',
//             summary: '',
//             language: ''
//         }
//     })
// })