var gulp = require('gulp');
var sass = require('gulp-sass');//CSSコンパイラ
var autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
var minifyCss = require('gulp-minify-css');//CSSファイルの圧縮ツール
var uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
var concat = require('gulp-concat');//ファイルの結合ツール
var plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
var rename = require("gulp-rename");//ファイル名の置き換えを行う
var twig = require("gulp-twig");//Twigテンプレートエンジン
var browserify = require("gulp-browserify");//NodeJSのコードをブラウザ向けコードに変換
var packageJson = require(__dirname+'/package.json');
var _tasks = [
	'broccoli-field-fabric.js'
];


// broccoli-field-fabric.js (frontend) を処理
gulp.task("broccoli-field-fabric.js", function() {
	gulp.src(["src/broccoli-field-fabric.js"])
		.pipe(plumber())
		.pipe(browserify({}))
		.pipe(concat('broccoli-field-fabric.js'))
		.pipe(gulp.dest( './clientside/' ))
		.pipe(concat('broccoli-field-fabric.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest( './clientside/' ))
	;
});


// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	gulp.watch(["src/**/*","libs/**/*","tests/testdata/htdocs/index_files/main.src.js"], _tasks);


	require('child_process').spawn('node',['tests/server/serverCtrl.js']);
	setTimeout(function(){
		require('child_process').spawn('open',['http://127.0.0.1:8080/']);
	}, 3000);

});

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
