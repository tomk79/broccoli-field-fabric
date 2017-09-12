# broccoli-field-fabric

fabric.js plugin for broccoli-html-editor.

## Install

Add below to your `composer.json`, and do `$ composer update`.

```
{
    "repositories": [
        {
            "type": "git",
            "url": "https://github.com/tomk79/broccoli-field-fabric.git"
        }
    ],
    "require": {
        "tomk79/broccoli-field-fabric": "dev-develop"
    }
}
```

## Usage

### Client Side Option

```html
<script src="/path/to/broccoli-field-fabric/clientside/broccoli-field-fabric.js"></script>
<script>
var broccoli = new Broccoli();
broccoli.init(
	{
		/* 中略 */
		'customFields': {
			'fabric': window.BroccoliFieldFabric
		},
		/* 中略 */
	} ,
	function(){
		/* 中略 */
	}
);
</script>
```

### Server Side Option

```js
var Broccoli = require('broccoli-html-editor');
var broccoli = new Broccoli();
var BroccoliFieldFabric = require('broccoli-field-fabric');

// 初期化を実行してください。
broccoli.init(
	{
		/* 中略 */
		'customFields': {
			'fabric': BroccoliFieldFabric
		} ,
		/* 中略 */
	},
	function(){
		/* 中略 */
	}
);
```

### Usage on "Pickles 2" and Desktop Tool

If you want to use on "Pickles 2" and Desktop Tool, update your `config.php` of Pickles 2.

```
<?php

	@$conf->plugins->px2dt->guieditor->custom_fields = array(
		'fabric'=>array(
			'backend'=>array(
				'require' => './vendor/tomk79/broccoli-field-fabric/serverside/broccoli-field-fabric.js'
			),
			'frontend'=>array(
				'file' => './vendor/tomk79/broccoli-field-fabric/clientside/broccoli-field-fabric.js',
				'function' => 'window.BroccoliFieldFabric'
			),
		),
	);

```

### Module Template Sample

```
<img src="{&{"input":{"type":"fabric","name":"main"}}&}" alt="" />
```

## 更新履歴 - Change log

### broccoli-field-fabric@0.1.0-beta.1 (2016年??月??日)

- initial release.

## ライセンス - License

MIT License


## 作者 - Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <http://www.pxt.jp/>
- Twitter: @tomk79 <http://twitter.com/tomk79/>
