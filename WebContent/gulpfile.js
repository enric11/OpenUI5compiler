//****************************************************************
//--------------------------gulpfile.js---------------------------

var gulp = require('gulp');
var del = require('del');
var ui5preload = require('gulp-ui5-preload');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
rm = require('gulp-rimraf');

var gulps = require("gulp-series");
var prettify = require('gulp-prettify');

var your_project = 'Your_project';
 
gulp.task(
    'ui5preload',
    function() {
        return gulp.src(
                [
                    './**/**.+(js|xml)',
                    '!Component-preload.js',
                    '!gulpfile.js',
                    '!WEB-INF/web.xml',
                    '!model/metadata.xml',
                    '!node_modules/**',
                    '!resources/**'
                ]
            )
            .pipe(gulpif('./**/*.js', uglify())) //only pass .js files to uglify
            //.pipe(gulpif('**/*.xml', prettydata({type: 'minify'}))) // only pass .xml to prettydata
            .pipe(ui5preload({
                base: './',
                namespace: your_project,
                fileName: 'Component-preload.js'
            
            }))
            .pipe(gulp.dest('.'));
    }
);

gulp.task('1compres', function() {
	return gulp.src(
              [
                  './**/**.+(js|xml)',
                  '!Component-preload.js',
                  '!gulpfile.js',
                  '!distTmp/',
                  '!WEB-INF/web.xml',
                  '!model/metadata.xml',
                  '!node_modules/**',
                  '!resources/**'
              ]	  
	  )
	    .pipe(minify({
	        ext:{
	            src:'.dbg.js',
	            min:'.js'
	        },
	        exclude: ['tasks'],
	        ignoreFiles: ['-min.js']
	    }))
	    .pipe(gulp.dest('./distTmp'));
});

gulp.task(
	    '2ui5preloadCompresed', gulp.series('1compres'),
	     function() {
	    	return gulp.src(
	                [
	                    'distTmp/**/**.+(js|xml)',
	                    '!distTmp/**/**.dbg.+(js|xml)',
	                    '!Component-preload.js',
	                    '!gulpfile.js',
	                    '!WEB-INF/web.xml',
	                    '!model/metadata.xml',
	                    '!node_modules/**',
	                    '!resources/**'
	                ]
	            )
	            .pipe(gulpif('./**/*.js', uglify())) //only pass .js files to uglify
	            //.pipe(gulpif('**/*.xml', prettydata({type: 'minify'}))) // only pass .xml to prettydata
	            .pipe(ui5preload({
	                base: './',
	                namespace: your_project,
	                fileName: 'Component-preload.js'
	            
	            }))
	            .pipe(gulp.dest('./'));
	    }
	);

gulp.task('3prepareComponentPreload', gulp.series('2ui5preloadCompresed'), function(){
	return gulp.src(['Component-preload.js'])
	    .pipe(replace('/distTmp/', '/'))
	    .pipe(gulp.dest('.'));
	  
	});

gulp.task('4deleteCleanDist', gulp.series('3prepareComponentPreload'), function(){
	return del('./distTmp', {force:true});
});


gulp.task('default', gulp.series('1compres','2ui5preloadCompresed','3prepareComponentPreload','4deleteCleanDist'));
