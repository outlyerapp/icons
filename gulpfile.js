var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sketch = require('gulp-sketch');
var iconfont = require('gulp-iconfont');
var minifyCSS = require('gulp-minify-css');
var gulpFilter = require('gulp-filter');
var consolidate = require('gulp-consolidate');

var sketchFile = 'glyph-font-14px';
var fontName = 'DL-Icons';
var classPrefix = 'di';
var template = 'fontawesome-style';

gulp.task('build', function () {

    gulp.src('src/' + sketchFile + '.sketch')
        .pipe(sketch({
          export: 'artboards',
          formats: 'svg'
        }))
        .pipe(gulp.dest('dist/svg/'))
        .pipe(iconfont({
            fontName: fontName,
            fontHeight: 460,
            fontWidth: 460
        }))
        .on('codepoints', function (codepoints) {

            var options = {
                glyphs: codepoints,
                fontName: fontName,
                fontNameLower: fontName.toLowerCase(),
                fontPath: '../fonts/',
                className: classPrefix,
                pkg: require('./package.json')
            };

            gulp.src('src/templates/' + template + '/*.less')
                .pipe(consolidate('lodash', options))
                .pipe(rename(function (path) {
                    if (path.basename === 'font') path.basename = options.fontNameLower;
                }))
                .pipe(gulp.dest('dist/less/'))
                .pipe(gulpFilter(['*', '!' + options.fontNameLower + '.less']))
                .pipe(concat('all.less'))
                .pipe(less())
                .pipe(rename({
                    basename: options.fontNameLower
                }))
                .pipe(gulp.dest('dist/css/'))
                .pipe(minifyCSS({
                    keepSpecialComments: 1
                }))
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(gulp.dest('dist/css/'));

            gulp.src('src/templates/' + template + '/sample.html')
                .pipe(consolidate('lodash', options))
                .pipe(rename({
                    basename: 'index'
                }))
                .pipe(gulp.dest('dist/'));
            })
            .pipe(gulp.dest('dist/fonts/'));
        });

gulp.task('watch', function () {

    gulp.watch('src/' + sketchFile + '.sketch', {
        debounceDelay: 3000
    }, ['build']);
});

gulp.task('default', ['build']);
