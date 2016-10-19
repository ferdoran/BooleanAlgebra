/**
 * Created by Sergej on 04.09.2016.
 */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    wiredep = require('wiredep'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    mainBowerFiles = require('gulp-main-bower-files'),
    concat = require('gulp-concat'),
    fileSort = require('gulp-angular-filesort'),
    useref = require('gulp-useref'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    webserver = require('gulp-webserver'),
    opn = require('opn'),
    del = require('del');


gulp.task('webserver-dist', function(){
    gulp.src('./dist')
    .pipe(webserver({
        host: 'localhost',
        port: 8080,
        livereload: true,
        directoryListing: false
    }));
});

gulp.task('webserver-dev', function(){
    gulp.src('./app')
        .pipe(webserver({
            host: 'localhost',
            port: 8081,
            livereload: true,
            directoryListing: false
        }));
});

gulp.task('watch', function(){
    gulp.watch('app/scss/**/*.scss', ['styles']);
});

gulp.task('clean', function(){
    return del.sync('dist');
});

gulp.task('sass', ['styles'], function(){
    gulp.src('app/css/style.min.css')
        .pipe(gulp.dest('dist/css'));
});

gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify({mangle: false})))
        .pipe(gulpif('*.css', cssmin()))
        .pipe(gulp.dest('dist'));
});

gulp.task('directives', function(){
    gulp.src('app/directives/**/*.html')
        .pipe(gulp.dest('dist/directives'));
});

gulp.task('images', function(){
    gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('font-awesome', function(){
    gulp.src('app/bower_components/font-awesome/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('views', function(){
    gulp.src('app/view/*.html')
        .pipe(gulp.dest('dist/view'));
});

gulp.task('bower-files', function(){
    gulp.src('app/bower_components/**/*')
        .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('translations', function(){
    gulp.src('app/translations/*.json')
        .pipe(gulp.dest('dist/translations'));
});
gulp.task('build', ['clean', 'directives', 'font-awesome', 'images', 'translations', 'views', 'useref'], function(){
    console.log("Building files");
});

gulp.task('default', ['build','webserver-dist']);