'use strict';
const gulp = require('gulp');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const del = require('del');

const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');

const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const stripDebug = require('gulp-strip-debug');

const htmlmin = require('gulp-htmlmin');
const removeHtmlComments = require('gulp-remove-html-comments');

const config = {
  src: {
    css: 'src/scss/*.scss',
    img: 'src/img/*',
    js: [
      'src/js/ui/*.js',
      'src/js/appSources.js',
      'src/js/appConfig.js',
      'src/js/appRouter.js',
      'src/js/appDrct.js',
      'src/js/appFilters.js',
      'src/js/services/*.js',
      'src/js/appSvc.js',
      'src/js/controllers/*.js',
      'src/js/appCtrl.js',
      'src/js/app.js'
    ],
    html: {
      main_page:'./index_uncompressed.html',
      partials:'src/partials/*.html'
    }
  },
  build: {
    css: 'build/css',
    img: 'build/img',
    js: 'build/js',
    html: {
      main_page:'./',
      partials:'build/partials'
    }
  }
}

function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('build-css', () => {
  gulp.src(config.src.css)
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest(config.build.css))
    .pipe(notify({message: 'Build CSS task complete'}));
})

gulp.task('build-img', () => {
  gulp.src(config.src.img)
    .pipe(cache(imagemin({optimizationLevel: 5, progressive: true, interlaced: true})))
    .pipe(gulp.dest(config.build.img))
    .pipe(notify({message: 'Build Images task complete'}));
});

gulp.task('build-js', () => {
  return gulp.src(config.src.js)
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(stripDebug())
    .pipe(gulp.dest(config.build.js))
    .pipe(notify({message: 'Build JS task complete'}))
    .on('error', swallowError);
});

gulp.task('build-html-main-page', () => {
  return gulp.src(config.src.html.main_page)
    .pipe(removeHtmlComments())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(config.build.html.main_page))
    .pipe(notify({message: 'Build HTML Main Page task complete'}));
});

gulp.task('build-html-partials', () => {
  return gulp.src(config.src.html.partials)
    .pipe(removeHtmlComments())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(config.build.html.partials))
    .pipe(notify({message: 'Build HTML Partials task complete'}));
});

gulp.task('clean', () => {
  return del(['build/css', 'build/js', 'build/img', 'index.html']);
});

gulp.task('watch-css', () => {
  gulp.watch(config.src.css, ['build-css'])
})
gulp.task('watch-js', () => {
  gulp.watch(config.src.js, ['build-js'])
})
gulp.task('watch-img', () => {
  gulp.watch(config.src.img, ['build-img'])
})
gulp.task('watch-html', () => {
  gulp.watch(config.src.html, ['build-html'])
})
gulp.task('watch-html-main-page', () => {
  gulp.watch(config.src.html.main_page, ['build-html-main-page'])
})
gulp.task('watch-html-partials', () => {
  gulp.watch(config.src.html.partials, ['build-html-partials'])
})

gulp.task('w', ['watch-css', 'watch-img', 'watch-html-main-page', 'watch-html-partials', 'watch-js'])
gulp.task('b', ['build-css', 'build-img', 'build-html-main-page', 'build-html-partials', 'build-js'])

gulp.task('default', ['w2015'])