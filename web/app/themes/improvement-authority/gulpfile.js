require('dotenv').config({ silent: true });

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const sass = require('gulp-sass');
const { rollup } = require('rollup');
const rollupConfig = require('./rollup.config');

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'js', 'copy:assets'], function() {
  browserSync.init({
    proxy: process.env.WP_URL || 'http://localhost'
  });

  gulp.watch('src/assets/**/*.*', ['copy:assets']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/**/*.js', ['js']);
  gulp.watch('src/**/*.js').on('change', browserSync.reload);
  gulp.watch('src/**/*.scss').on('change', browserSync.reload);
  gulp.watch('templates/**/*.twig').on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function(done) {
  return gulp
    .src([
      'node_modules/normalize.css/normalize.css',
      'src/scss/**/*.scss'
    ])
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ios_saf 8', 'IE > 9'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
  browserSync.reload();
  done();
});

gulp.task('js', async function () {
  const { output, ...input } = rollupConfig;
  const bundle = await rollup(input)
  return bundle.write(output);
});

gulp.task('clean', function() {
  return del.sync([
    './dist/*'
  ], {
    force: true
  });
});

gulp.task('copy:assets', function() {
  return gulp.src('src/assets/**/*.*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('dist', ['sass', 'js', 'copy:assets']);

gulp.task('default', ['serve']);
