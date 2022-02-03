import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import squoosh from 'gulp-libsquoosh';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import del from 'del';

// Clean

const clean = () => {
  return del('build');
};

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML
export const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'))
}

// Images
export const images = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicon.svg'])
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
}

// fonts
const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

//SVG
const svg = () =>
gulp.src('source/img/*.svg')
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));

  const sprite = () => {
    return gulp.src('source/img/*.svg')
    .pipe(svgo())
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
  }

// Server

function server(done) {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
  gulp.watch('source/*.html', gulp.series(html));
}


export default gulp.series(
  clean, copy, svg, sprite, html, styles, images, server, watcher
);
