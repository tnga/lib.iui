if (process.versions.node <= '0.12.0') {
    
    console.warn('iui-gulp: recommand node version 0.12.x or later ') ;
    require('es6-promise').polyfill() ;
}

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-minify-css'), //@TODO this seems to be deprecated, so have to migrate to cssnano. 
    //cssnano = require('gulp-cssnano'), //@FIXME make cssnano not try to minify sourcemaps.
    sourcemaps = require('gulp-sourcemaps'),
    ignore = require('gulp-ignore'),
    rename = require('gulp-rename') ,
    
    notifier = require('node-notifier') ;

var paths = {
    sassAll: 'src/**/*.scss' ,
    sassMain: 'src/iui.scss' ,
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
        .pipe( sourcemaps.write( paths.dest, {includeContent: false}))
        .pipe( gulp.dest( paths.dest))
        .pipe( ignore.exclude('*.map'))
        .pipe( rename({suffix: '.min'}))
        .pipe( cssnano())
        .pipe( sourcemaps.write( paths.dest))
        .pipe( gulp.dest(paths.dest)) ;
    
    notifier.notify({ title: 'iui-sass:', message: 'css generation\'s task complete!' }) ;

});

// library's builder task
gulp.task('build', ['sass'] );

// Return the task when a file changes
gulp.task('watch', function() {
    
    gulp.watch( paths.sassAll, ['sass']) ;
    
    notifier.notify({ title: 'iui-watcher:', message: 'source files are being watched!' }) ;
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch'], function() {
    
    console.log('.....\n iui-dev: available task:') ;
    console.log('watch [default] - (watch source files and automate building)') ;
    console.log('sass - (generate and minify css from sass\'s files)') ;
    console.log('build - (build the project)') ;
    console.log('.....') ;
});