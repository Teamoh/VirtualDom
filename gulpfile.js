const gulp = require('gulp');
const rename = require('gulp-rename');
const rollup = require('gulp-better-rollup');
const rollupTypescript = require('rollup-plugin-typescript2');
const uglify = require('gulp-uglify');

const fileName = 'virtualdom.js';
const fileNameMin = 'virtualdom.min.js';
const srcDirectory = 'src';
const distDirectory = 'dist';

function compile() {
    return gulp.src(`./${srcDirectory}/main.ts`)
        .pipe(
            rollup(
                {
                    plugins: [
                        rollupTypescript(),
                    ],
                },
                {
                    format: 'iife',
                },
            )
        );
}

function build(destDir) {
    return compile()
        .pipe(rename(fileName))
        .pipe(gulp.dest(`${destDir}/`));
}

function buildSrc() {
    return build(srcDirectory);
}

function buildDist() {
    return build(distDirectory);
}

function dist() {
    return buildDist()
        .pipe(rename(fileNameMin))
        .pipe(uglify()).on('error', function (err) {
            console.error(err);
            this.emit('end');
        })
        .pipe(gulp.dest(`${distDirectory}/`));
}

function watch() {
    gulp.watch(`./${srcDirectory}/**/*.ts`, {}, buildSrc);
}

exports.build = buildSrc;
exports.watch = gulp.series(buildSrc, watch);
exports.dist = dist;
exports.default = exports.watch;
