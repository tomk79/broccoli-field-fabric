var express = require('express'),
	app = express();
var server = require('http').Server(app);
var broccoliFieldFabric = require(__dirname+'/../../serverside/main.js');

app.use( require('body-parser')({"limit": "1024mb"}) );
app.use( '/path/to/jquery', express.static( __dirname+'/../../node_modules/jquery/dist/' ) );
app.use( '/path/to/broccoli-html-editor', express.static( __dirname+'/../../node_modules/broccoli-html-editor/client/dist/' ) );
app.use( '/path/to/broccoli-field-fabric', express.static( __dirname+'/../../clientside/' ) );
app.use( '/apis/broccoli', function(req, res, next){

	var Broccoli = require('broccoli-html-editor');
	var broccoli = new Broccoli();

	// 初期化を実行してください。
	broccoli.init(
		{
			'appMode': 'web', // 'web' or 'desktop'. default to 'web'
			'paths_module_template': {
				'_local': __dirname+'/modules/'
			} ,
			'documentRoot': __dirname+'/../htdocs/', // realpath
			'pathHtml': '/edit/index.html',
			'pathResourceDir': '/edit/index_files/resources/',
			'realpathDataDir': __dirname+'/../htdocs/edit/index_files/guieditor.ignore/',
			'customFields': {
				'fabric': broccoliFieldFabric
			} ,
			'bindTemplate': function(htmls, callback){
				var fin = '';
				fin += '<!DOCTYPE html>'+"\n";
				fin += '<html>'+"\n";
				fin += '    <head>'+"\n";
				fin += '        <title>sample page</title>'+"\n";
				fin += '    </head>'+"\n";
				fin += '    <body>'+"\n";
				fin += '        <div data-contents="main">'+"\n";
				fin += htmls['main']+"\n";
				fin += '        </div><!-- /main -->'+"\n";
				fin += '    </body>'+"\n";
				fin += '</html>'+"\n";
				fin += '<script data-broccoli-receive-message="yes">'+"\n";
				fin += 'window.addEventListener(\'message\',(function() {'+"\n";
				fin += 'return function f(event) {'+"\n";
				fin += 'if(event.origin!=\'http://127.0.0.1:8080\'){return;}// <- check your own server\'s origin.'+"\n";
				fin += 'var s=document.createElement(\'script\');'+"\n";
				fin += 'document.querySelector(\'body\').appendChild(s);s.src=event.data.scriptUrl;'+"\n";
				fin += 'window.removeEventListener(\'message\', f, false);'+"\n";
				fin += '}'+"\n";
				fin += '})(),false);'+"\n";
				fin += '</script>'+"\n";

				callback(fin);
				return;
			},
			'log': function(msg){
				// エラー発生時にコールされます。
				// msg を受け取り、適切なファイルへ出力するように実装してください。
				// fs.writeFileSync('/path/to/error.log', {}, msg);
			}
		},
		function(){
			// クライアントサイドに設定した GPI(General Purpose Interface) Bridge から送られてきたリクエストは、
			// `broccoli.gpi` に渡してください。
			// GPIは、処理が終わると、第3引数の関数をコールバックします。
			// コールバック関数の引数を、クライアント側へ返却してください。
			broccoli.gpi(
				JSON.parse(req.body.api),
				JSON.parse(req.body.options),
				function(value){
					res
						.status(200)
						.set('Content-Type', 'text/json')
						.send( JSON.stringify(value) )
						.end();
				}
			);
		}
	);
} );
app.use( express.static( __dirname+'/editor/' ) );
server.listen( 8080, function(){
	console.log('server-standby');
} );


var appPreview = express();
var serverPreview = require('http').Server(appPreview);
appPreview.use( express.static( __dirname+'/../htdocs/' ) );
serverPreview.listen( 8081, function(){
	console.log('preview-server-standby');
} );
