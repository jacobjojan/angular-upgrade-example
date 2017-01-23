var gulp = require("gulp"),
		gutil = require("gulp-util"),
		browserify = require("browserify"),
		babelify = require("babelify"),
		source = require("vinyl-source-stream"),
		buffer = require("vinyl-buffer"),
		glob = require("glob"),
		uglify = require("gulp-uglify"),
		sass = require("gulp-ruby-sass");
		connect = require("gulp-connect");

gulp.task("connect", function() {
	connect.server({
		root: "app/build",
		port: 8888,
		livereload: true
	});
});

gulp.task("html", function() {
	gulp.src( "app/build/*.html" )
			.pipe( connect.reload() );
});

gulp.task("move-third-party", function() {
	gulp.src( "node_modules/angular/angular.js" )
			.on( "error", gutil.log )
			.pipe( gulp.dest( "app/build/" ) );
});

gulp.task("move-html", function() {
	gulp.src( "app/src/**/*.html" )
			.on( "error", gutil.log )
			.pipe( gulp.dest( "app/build/" ) )
			.pipe( connect.reload() );
});

gulp.task("sass", function() {
	return sass( "app/src/scss/*.scss" )
					.on( "error", sass.logError )
					.pipe( gulp.dest( "app/build/css" ) )
					.pipe( connect.reload() );
});

gulp.task("es6", function() {
	var files = glob.sync( "app/src/**/**.js" ),
			bundler = browserify({
				entries: files,
				debug: true
			}).transform( babelify );

	return bundler.bundle()
								.on( "error", gutil.log )
								.pipe( source( "app.js" ) )
								.pipe( gulp.dest( "app/build" ) )
								.pipe( connect.reload() );
});

gulp.task("uglify", function() {
	return gulp.src( "app/build/app.js" )
						 .pipe( uglify() )
						 .on( "error", gutil.log )
						 .pipe( gulp.dest( "app/build" ) );
});

gulp.task("watch", function() {
	gulp.watch( [ "app/src/**/**.html" ], [ "move-html" ] );
	gulp.watch( [ "app/src/**/**.js" ], [ "es6" ] );
	gulp.watch( [ "app/src/scss/*.scss" ], [ "sass" ] );
});

gulp.task( "default", [ "connect", "move-third-party", "watch"] );

gulp.task( "build", [ "uglify" ], function() {
	return gulp.src( "app/build/**" )
						 .pipe( gulp.dest( "app/dist/" ) );
});
