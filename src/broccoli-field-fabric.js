/**
 * broccoli-field-fabric
 */
(function(){
	var __dirname = (function() {
		if (document.currentScript) {
			return document.currentScript.src;
		} else {
			var scripts = document.getElementsByTagName('script'),
			script = scripts[scripts.length-1];
			if (script.src) {
				return script.src;
			}
		}
		return '';
	})().replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');

	window.BroccoliFieldFabric = function(broccoli){

		/**
		 * データを正規化する
		 */
		this.normalizeData = function( fieldData, mode ){
			// 編集画面用にデータを初期化。
			var rtn = {};
			if( typeof(fieldData) === typeof({}) ){
				rtn = fieldData;
			}else if( typeof(fieldData) === typeof('') ){
				rtn.src = fieldData;
			}
			rtn.src = rtn.src||'';
			rtn.json = rtn.json||{};
			return rtn;
		}

		/**
		 * プレビュー用の簡易なHTMLを生成する
		 */
		this.mkPreviewHtml = function( fieldData, mod, callback ){
			var cheerio = require('cheerio');
			var rtn = {}
			if( typeof(fieldData) === typeof({}) ){
				rtn = fieldData;
			}

			var $ = cheerio.load('<img>', {decodeEntities: false});
			$('img')
				.attr({'src': rtn.src})
				.css({
					'max-width': '80px',
					'max-height': '80px'
				})
			;
			callback( $.html() );
			return;
		}// mkPreviewHtml()

		/**
		 * エディタUIを生成
		 */
		this.mkEditor = function( mod, data, elm, callback ){
			var _this = this;
			if(typeof(data) !== typeof({})){
				data = {
					'src':'',
					'json':{},
					'width': 400,
					'height': 300
				};
			}
			console.log(data);

			var $rtn = $('<div>'),
				$iframe = $('<iframe>')
			;

			$rtn
				.append( $iframe
					.css({
						'width': '100%',
						'height': 400,
						'border': 'none'
					})
					.attr({
						'src': __dirname+'/editor.html?json='+encodeURIComponent(JSON.stringify({}))+'&width='+(data.width||400)+'&height='+(data.height||300)
						// 'src': __dirname+'/editor.html?json='+encodeURIComponent(JSON.stringify(data.json))+'&width='+(data.width||400)+'&height='+(data.height||300)
					})
				)
			;


			// iframeのロード完了イベント
			$iframe.on('load', function(){
				// alert('loaded');
				// console.log(this.contentWindow);
				var fabricCanvas = this.contentWindow.fabricCanvas;
				fabricCanvas.loadFromJSON(JSON.stringify(data.json));
				fabricCanvas.isDrawingMode = true; // free drawing mode
				callback();
			})
			$(elm).html($rtn);
			return;
		}

		/**
		 * エディタUIで編集した内容を保存
		 */
		this.saveEditorContent = function( elm, data, mod, callback ){
			var $dom = $(elm);
			// console.log($dom.html());
			var iframeWindow = $dom.find('iframe').get(0).contentWindow;
			var json = iframeWindow.fabricCanvas.toJSON();
			var image = iframeWindow.fabricCanvas.toDataURL('png')

			if(typeof(data) !== typeof({})){
				data = {};
			}
			data.json = json;
			data.src = image;

			data.width = iframeWindow.$('input[name=width]').val();
			data.height = iframeWindow.$('input[name=height]').val();

			callback(data);
			return;
		}

	}

})();
