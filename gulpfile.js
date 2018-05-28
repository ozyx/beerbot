var gulp = require("gulp");
var sourcemaps = require('gulp-sourcemaps');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src(['bot/**/*.js', 'bot/**/*.js.map'], {
            read: false
        })
        .pipe(clean());
});

gulp.task("build", gulp.series(['clean'], function () {
    var tsResult = gulp.src('bot/**/*.ts')
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write('.')) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('bot'));
}));