var gulp        = require('gulp'),
    path        = require('path'),
    $           = require('gulp-load-plugins')(),
    gulpsync    = $.sync(gulp),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

// production mode (see build task)
var isProduction = false;
// styles sourcemaps
var useSourceMaps = false;

// MAIN PATHS
var paths = {
    app: '../app/',
    htmls: 'jade/',
    styles: 'sass/',
    scripts: 'js/'
};

// SOURCES CONFIG
var source = {
    scripts: [
        paths.scripts + '**/*.js'
    ],
    htmls: [
        paths.htmls + '**/*.*'
    ],
    templates: {
        index: [paths.markup + 'index.*'],
        views: [paths.markup + '**/*.*', '!' + paths.markup + 'index.*']
    },
    styles: {
        app: [paths.styles + '*.*'],
        watch: [paths.styles + '**/*']
    }
};

// VENDOR CONFIG
var vendor = {
    // vendor scripts required to start the app
    base: {
        source: require('./vendor.base.json'),
        js: 'base.js',
        css: 'base.css'
    },
    // vendor scripts to make the app work. Usually via lazy loading
    app: {
        source: '', //require('./vendor.json'),
        dest: '../vendor'
    }
};

// BUILD TARGET CONFIG
var build = {
    scripts: paths.app + 'js',
    styles: paths.app + 'css',
    htmls: paths.app,
    templates: {
        index: '../',
        cache: paths.app + 'js/' + 'templates.js'
    }
};

var prettifyOpts = {
    indent_char: ' ',
    indent_size: 3,
    unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u', 'pre', 'code']
};

var vendorUglifyOpts = {
    mangle: {
        except: ['$super'] // rickshaw requires this
    }
};

var compassOpts = {
    project: path.join(__dirname, '../'),
    css: 'app/css',
    sass: 'master/sass/',
    image: 'app/img'
};

var cssnanoOpts = {
    safe: true,
    discardUnused: false, // no remove @font-face
    reduceIdents: false // no change on @keyframes names
};

// VENDOR BUILD
gulp.task('vendor', gulpsync.sync(['vendor:base']));

// Build the base script to start the application from vendor assets
gulp.task('vendor:base', function() {
    log('Copying base vendor assets..');

    var jsFilter = $.filter('**/*.js', {
        restore: true
    });
    var cssFilter = $.filter('**/*.css', {
        restore: true
    });

    return gulp.src(vendor.base.source)
        .pipe($.expectFile(vendor.base.source))
        .pipe(jsFilter)
            .pipe($.concat(vendor.base.js))
            .pipe($.if(isProduction, $.uglify()))
            .pipe(gulp.dest(build.scripts))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
            .pipe($.concat(vendor.base.css))
            .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
            .pipe(gulp.dest(build.styles))
        .pipe(cssFilter.restore())
        ;
});

// copy file from bower folder into the app vendor folder
gulp.task('vendor:app', function() {
    log('Copying vendor assets..');

    var jsFilter = $.filter('**/*.js', {
        restore: true
    });
    var cssFilter = $.filter('**/*.css', {
        restore: true
    });

    return gulp.src(vendor.app.source, {
            base: 'bower_components'
        })
        .pipe($.expectFile(vendor.app.source))
        .pipe(jsFilter)
        .pipe($.if(isProduction, $.uglify(vendorUglifyOpts)))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
        .pipe(cssFilter.restore())
        .pipe(gulp.dest(vendor.app.dest));
});


// JS APP
gulp.task('scripts:app', function() {
    log('Building scripts..');
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(source.scripts)
        .pipe($.jsvalidate())
        .on('error', handleError)
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe($.concat('app.js'))
        .on('error', handleError)
        .pipe($.if(isProduction, $.uglify({
            preserveComments: 'some'
        })))
        .on('error', handleError)
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe(gulp.dest(build.scripts))
        .pipe(reload({
            stream: true
        }));
});

// APP SASS
gulp.task('styles:app', function() {
    log('Building application styles..');
    return gulp.src(source.styles.app)
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe($.sass())
        .on('error', handleError)
        .pipe($.if(isProduction, $.cssnano(cssnanoOpts)))
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe(gulp.dest(build.styles))
        .pipe(reload({
            stream: true
        }));
});

// JADE
gulp.task('htmls:app', function() {
    log('Copying htmls..');

    return gulp.src(source.htmls)    
        .pipe($.jade())
        .pipe(gulp.dest(build.htmls))
        ;
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    log('Watching source files..');
    gulp.watch(source.scripts, ['scripts:app']);
    gulp.watch(source.styles.watch, ['styles:app']);
    gulp.watch(source.htmls, ['htmls:app']);
});

// Serve files with auto reaload
gulp.task('browsersync', function() {
    log('Starting BrowserSync..');

    browserSync({
        notify: false,
        port: 4000,
        server: {
            baseDir: '../app',
            index: "index.html"
        }
    });

});

// Server for development
gulp.task('serve', gulpsync.sync([
    'default',
    'browsersync'
]), done);

// default (no minify)
gulp.task('default', gulpsync.sync([
    'vendor',
    'assets',
    'watch'
]));

gulp.task('assets', [
    'scripts:app',
    'styles:app',
    'htmls:app'
]);

/////////////////////

function done() {
    log('************');
    log('* All Done * You can start editing your code, BrowserSync will update your browser after any change..');
    log('************');
}

// Error handler
function handleError(err) {
    log(err.toString());
    this.emit('end');
}

// log to console using
function log(msg) {
    $.util.log($.util.colors.blue(msg));
}
