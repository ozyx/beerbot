var gulp = require("gulp");
var sourcemaps = require('gulp-sourcemaps');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var clean = require('gulp-clean');
var gulp_tslint = require('gulp-tslint');

/**
 * TASK tslint
 * Lint all TypeScript files using tslint
 */
gulp.task('tslint', () => {
    return gulp.src(['**/*.ts', '!**/*.d.ts', '!node_modules/**', '!bot/tests/**'])
        .pipe(gulp_tslint())
        .pipe(gulp_tslint.report());
});

/**
 * TASK clean
 * Remove all transpiled code
 */
gulp.task('clean', () => {
    return gulp.src(['bot/**/*.js', 'bot/**/*.js.map'], {
            read: false
        })
        .pipe(clean());
});

/**
 * TASK sourcemap
 * Generate *.map files for debugging
 */
gulp.task('sourcemap', () => {
    var tsResult = gulp.src('bot/**/*.ts')
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write('.')) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('bot'));
});

/**
 * TASK build
 * Clean, run lint, build and generate map files
 */
gulp.task("build", gulp.series(['clean', 'tslint', 'sourcemap']));

/**
 * TASK default
 */
gulp.task("default", gulp.task('build'));