'use strict'
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    preFixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify-es'),
    //uglify = require('gulp-uglify-es'),
    rigger = require('gulp-rigger'),
    sourceMaps = require('gulp-sourcemaps'),
    //babel = require('gulp-babel'),
    cssMin = require('gulp-minify-css'),
    concat = require('gulp-concat');


var path = {
    build: {
        html: 'prod/',
        js: 'prod/js/',
        css: 'prod/css/'
    },
    src: {
        html: 'html/*.html',
        js: 'js/*.js',
        css: 'css/*.css'
    },
    watch: {
        html: 'html/*.html',
        js: 'js/*.js',
        css: 'css/*.css'
    }
};

gulp.task('js:build', function() {
    return gulp.src(path.src.js)
        //.pipe(rename("bundle.min.js"))
        //.pipe(uglify(/* options */))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.build.js));
});

gulp.task('css:build', function() {
    return gulp.src(path.src.css)
        //.pipe(rename("bundle.min.js"))
        //.pipe(uglify(/* options */))
        .pipe(concat('main.css'))
        .pipe(cssMin())
        .pipe(gulp.dest(path.build.css));
});

