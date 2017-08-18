var mongoose = require('mongoose')
var Movie = mongoose.model('Movie')
var Comment = mongoose.model('Comment')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')


// admin update movie
exports.update = function(req, res) {
    var id = req.params.id

    if(id) {
        Movie.findById(id, function(err, movie) {
            if(err) {
                console.log(err)
            }
            res.render('admin', {
                title: 'MXY 后台更新页',
                movie: movie
            })
        })
    }
}

//admin movie
exports.new = function(req, res) {
    res.render('admin', {
        title:'MXY 后台录入页面',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            summary: '',
            flash: '',
            language: ''
        }
    })
}

//admin post movie
exports.save = function(req, res) {
	console.log(req.body);
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie

    if (id) {
        Movie.findById(id, function(err, movie) {
            if(err) {
                console.log(err)
            }

            _movie = _.extend(movie, movieObj)
            _movie.save(function(err, movie) {
                if(err) {
                    console.log(err)
                }
                res.redirect('/movie/' + movie._id)
            })
        })
    }
    else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })

        _movie.save(function(err, movie) {
            if(err) {
                console.log(err)
            }
            res.redirect('/movie/' + movie._id)
        })
    }
}

// list page
exports.list = function(req, res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err)
        }
        res.render('list', {
            title: 'MXY 列表页',
            movies: movies
        })
    })
}

// detail page
exports.detail = function(req, res) {
    var id = req.params.id

    Movie.findById(id, function(err, movie){
    	Comment
	      .find({movie: id})
	      .populate('from', 'name')
	      .populate('reply.from reply.to', 'name')
	      .exec(function(err, comments) {
	        res.render('detail', {
	          title: 'MXY 详情页',
	          movie: movie,
	          comments: comments
	        })
      })
    })
}

//list delete movie
exports.del = function(req, res) {
    var id = req.query.id

    if(id) {
        Movie.remove({_id: id}, function(err, movie) {
            if(err) {
                console.log(err)
            }
            else {
                res.json({success: 1})
            }
        })
    }
}