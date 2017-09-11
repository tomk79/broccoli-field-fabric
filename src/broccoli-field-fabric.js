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

	window.broccoliFieldFabric = function(broccoli){

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
					'width': 400,
					'height': 300
				};
			}

			var $rtn = $('<div>'),
				$iframe = $('<iframe>')
			;

			$rtn
				.append( $iframe
					.css({
						'width': '100%',
						'height': 400
					})
					.attr({
						'src': __dirname+'/editor.html?src='+encodeURIComponent(data.src)+'&width='+(data.width||400)+'&height='+(data.height||300)
					})
				)
			;

			$(elm).html($rtn);

			callback();
			return;
		}

		/**
		 * エディタUIで編集した内容を保存
		 */
		this.saveEditorContent = function( elm, data, mod, callback ){
			var $dom = $(elm);
			// console.log($dom.html());
			var iframeWindow = $dom.find('iframe').get(0).contentWindow;
			var image = iframeWindow.imageBoard.canvas.toDataURL();

			if(typeof(data) !== typeof({})){
				data = {};
			}
			data.src = image;

			data.width = iframeWindow.$('input[name=width]').val();
			data.height = iframeWindow.$('input[name=height]').val();

			callback(data);
			return;
		}

	}

})();
