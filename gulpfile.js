if (process.versions.node <= '0.12.0') {
    
    console.warn('iui-gulp: recommand node version 0.12.x or later ') ;
    require('es6-promise').polyfill() ;
}

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename') ;

var paths = {
    sass: 'src/*.scss' ,
    bower: 'bower_components' ,
    node: 'node_modules' ,
    dest: '.'
    //scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee']
};

gulp.task('sass', function() {
    // compile and minify all target sass files.
    // with sourcemaps all the way down
    sass( paths.sass, {sourcemap: true, style: 'expanded', loadPath: [ paths.bower]} ).on('error', sass.logError)
        .pipe( autoprefixer('last 5 Chrome versions',
                            'last 5 Firefox versions',
                            'last 2 Safari versions',
                            'ie >= 8',
                            'iOS >= 7',
                            'Android >= 4.2'))
        //.pipe( sourcemaps.write('.',{includeContent: false})) //@FIXME sourcemaps operation seems to provide issue here.
        .pipe( gulp.dest( paths.dest))
        .pipe( notify({ message: 'iui-sass: css generation\'s task complete!' }))
        .pipe( cssnano())
        .pipe( rename({suffix: '.min'}))
        .pipe( sourcemaps.write( paths.dest))
        .pipe( gulp.dest(paths.dest))
        .pipe( notify({ message: 'iui-sass: css minification\' task complete!' })) ;
});

// library's builder task
gulp.task('build', ['sass'] );

// Rerun the task when a file changes
gulp.task('watch', function() {
    
    gulp.watch( paths.sass, ['sass']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build']);