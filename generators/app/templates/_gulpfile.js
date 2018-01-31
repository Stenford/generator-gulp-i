'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    htmlValidator = require('gulp-html'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    stylus = require('gulp-stylus'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    imageminSvgo = require('imagemin-svgo'),
    imageminGifsicle = require('imagemin-gifsicle'),
    imageminPngquant = require('imagemin-pngquant'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    browserSync = require("browser-sync"),
    rigger = require('gulp-rigger'),
    notify = require("gulp-notify"),
    notifier = require('node-notifier'),
    reload = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'app/html/*.html',
        js: 'app/js/*.js',
        style: 'app/styl/main.styl',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'app/html/**/*.html',
        js: 'app/js/**/*.js',
        style: 'app/styl/**/*.styl',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    host: 'localhost',
    port: 9000
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(htmlValidator())
        .on("error", notify.onError(function (error) {
            return "HTML: " + error.message;
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .on("error", notify.onError(function (error) {
            return "JS: " + error.message;
        }))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .on("error", notify.onError(function (error) {
            return "Stylus=>CSS: " + error.message;
        }))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin([
            imageminSvgo({plugins: [{removeViewBox: false}]}),
            imageminGifsicle({interlaced: true}),
            imageminJpegRecompress({
                progressive: true,
                max: 80,
                min: 70
            }),
            imageminPngquant({quality: '80'})
        ]))
        .on("error", notify.onError(function (error) {
            return "IMG: " + error.message;
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
        notifier.notify({ title: 'Html Build', message: 'Done' });
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
        notifier.notify({ title: 'Style Build', message: 'Done' });
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
        notifier.notify({ title: 'JS Build', message: 'Done' });
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);