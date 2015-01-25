Ext.data.JsonP.Atlas_Scene({"tagname":"class","name":"Atlas.Scene","autodetected":{},"files":[{"filename":"Atlas.js","href":"Atlas.html#Atlas-Scene"}],"extends":"Atlas.Group","members":[{"name":"and","tagname":"method","owner":"Atlas.Util","id":"method-and","meta":{"chainable":true}},{"name":"delay","tagname":"method","owner":"Atlas.Util","id":"method-delay","meta":{"chainable":true}},{"name":"getRand","tagname":"method","owner":"Atlas.Util","id":"method-getRand","meta":{}},{"name":"getRandText","tagname":"method","owner":"Atlas.Util","id":"method-getRandText","meta":{}},{"name":"getSound","tagname":"method","owner":"Atlas.Util","id":"method-getSound","meta":{}},{"name":"getTouchPosition","tagname":"method","owner":"Atlas.Util","id":"method-getTouchPosition","meta":{}},{"name":"hexToRgb","tagname":"method","owner":"Atlas.Util","id":"method-hexToRgb","meta":{}},{"name":"hitTest","tagname":"method","owner":"Atlas.Thing","id":"method-hitTest","meta":{}},{"name":"hsbToHex","tagname":"method","owner":"Atlas.Util","id":"method-hsbToHex","meta":{}},{"name":"intersect","tagname":"method","owner":"Atlas.Thing","id":"method-intersect","meta":{}},{"name":"isQueEmpty","tagname":"method","owner":"Atlas.Util","id":"method-isQueEmpty","meta":{}},{"name":"leave","tagname":"method","owner":"Atlas.Util","id":"method-leave","meta":{}},{"name":"loop","tagname":"method","owner":"Atlas.Util","id":"method-loop","meta":{"chainable":true}},{"name":"moveTo","tagname":"method","owner":"Atlas.Util","id":"method-moveTo","meta":{}},{"name":"remove","tagname":"method","owner":"Atlas.Util","id":"method-remove","meta":{}},{"name":"rgbToHex","tagname":"method","owner":"Atlas.Util","id":"method-rgbToHex","meta":{}},{"name":"rotateBy","tagname":"method","owner":"Atlas.Util","id":"method-rotateBy","meta":{"chainable":true}},{"name":"scale","tagname":"method","owner":"Atlas.Thing","id":"method-scale","meta":{"chainable":true}},{"name":"scaleBy","tagname":"method","owner":"Atlas.Util","id":"method-scaleBy","meta":{"chainable":true}},{"name":"setPosition","tagname":"method","owner":"Atlas.Util","id":"method-setPosition","meta":{"chainable":true}},{"name":"setSize","tagname":"method","owner":"Atlas.Thing","id":"method-setSize","meta":{}},{"name":"soundClonePlay","tagname":"method","owner":"Atlas.Util","id":"method-soundClonePlay","meta":{}},{"name":"soundGetAlltime","tagname":"method","owner":"Atlas.Util","id":"method-soundGetAlltime","meta":{}},{"name":"soundGetCount","tagname":"method","owner":"Atlas.Util","id":"method-soundGetCount","meta":{}},{"name":"soundGetVolume","tagname":"method","owner":"Atlas.Util","id":"method-soundGetVolume","meta":{}},{"name":"soundIsPlaying","tagname":"method","owner":"Atlas.Util","id":"method-soundIsPlaying","meta":{}},{"name":"soundLoopPlay","tagname":"method","owner":"Atlas.Util","id":"method-soundLoopPlay","meta":{}},{"name":"soundPause","tagname":"method","owner":"Atlas.Util","id":"method-soundPause","meta":{}},{"name":"soundPlay","tagname":"method","owner":"Atlas.Util","id":"method-soundPlay","meta":{}},{"name":"soundReplay","tagname":"method","owner":"Atlas.Util","id":"method-soundReplay","meta":{}},{"name":"soundSetCount","tagname":"method","owner":"Atlas.Util","id":"method-soundSetCount","meta":{}},{"name":"soundSetVolume","tagname":"method","owner":"Atlas.Util","id":"method-soundSetVolume","meta":{}},{"name":"soundStop","tagname":"method","owner":"Atlas.Util","id":"method-soundStop","meta":{}},{"name":"stop","tagname":"method","owner":"Atlas.Util","id":"method-stop","meta":{"chainable":true}},{"name":"then","tagname":"method","owner":"Atlas.Util","id":"method-then","meta":{"chainable":true}},{"name":"within","tagname":"method","owner":"Atlas.Thing","id":"method-within","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-Atlas.Scene","component":false,"superclasses":["Atlas.Util","Atlas.Thing","Atlas.Group"],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='docClass'>Atlas.Util</a><div class='subclass '><a href='#!/api/Atlas.Thing' rel='Atlas.Thing' class='docClass'>Atlas.Thing</a><div class='subclass '><a href='#!/api/Atlas.Group' rel='Atlas.Group' class='docClass'>Atlas.Group</a><div class='subclass '><strong>Atlas.Scene</strong></div></div></div></div><h4>Files</h4><div class='dependency'><a href='source/Atlas.html#Atlas-Scene' target='_blank'>Atlas.js</a></div></pre><div class='doc-contents'>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-and' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-and' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-and' class='name expandable'>and</a>( <span class='pre'></span> ) : <a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>アニメーションを二つ定義する\n@example\nsprite.moveBy(100,100,30).and().rotateBy(Math.PI,30); ...</div><div class='long'><p>アニメーションを二つ定義する\n@example\nsprite.moveBy(100,100,30).and().rotateBy(Math.PI,30);</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-delay' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-delay' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-delay' class='name expandable'>delay</a>( <span class='pre'>frame</span> ) : <a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>アニメーションをframeフレーム待つ ...</div><div class='long'><p>アニメーションをframeフレーム待つ</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>frame</span> : Object<div class='sub-desc'><p>{Number}</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-getRand' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-getRand' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-getRand' class='name expandable'>getRand</a>( <span class='pre'>a, b</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>a</span> : Object<div class='sub-desc'><p>Number</p>\n</div></li><li><span class='pre'>b</span> : Object<div class='sub-desc'><p>Number\na ~ bの間のランダムな数字を取得</p>\n</div></li></ul></div></div></div><div id='method-getRandText' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-getRandText' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-getRandText' class='name expandable'>getRandText</a>( <span class='pre'>limit</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>limit</span> : Object<div class='sub-desc'><p>Number\nlimitまでの文字数で文字列を取得</p>\n</div></li></ul></div></div></div><div id='method-getSound' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-getSound' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-getSound' class='name expandable'>getSound</a>( <span class='pre'>name</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : Object<div class='sub-desc'><p>String\nAppインスタンスにロードされた音楽を取得する</p>\n</div></li></ul></div></div></div><div id='method-getTouchPosition' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-getTouchPosition' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-getTouchPosition' class='name expandable'>getTouchPosition</a>( <span class='pre'>e, num</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : Object<div class='sub-desc'><p>eventオブジェクト</p>\n</div></li><li><span class='pre'>num</span> : Object<div class='sub-desc'><p>Number\neventオブジェクトからキャンバスの押された位置座標を取得</p>\n</div></li></ul></div></div></div><div id='method-hexToRgb' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-hexToRgb' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-hexToRgb' class='name expandable'>hexToRgb</a>( <span class='pre'>color, opacity</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>color</span> : Object<div class='sub-desc'><p>String</p>\n</div></li><li><span class='pre'>opacity</span> : Object<div class='sub-desc'><p>Number\n16進からRGBを取得する</p>\n</div></li></ul></div></div></div><div id='method-hitTest' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Thing' rel='Atlas.Thing' class='defined-in docClass'>Atlas.Thing</a><br/><a href='source/Atlas.html#Atlas-Thing-method-hitTest' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Thing-method-hitTest' class='name expandable'>hitTest</a>( <span class='pre'>target</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>target</span> : Object<div class='sub-desc'><p>Thingオブジェクト\n自分がターゲットと接触しているかを判定する</p>\n</div></li></ul></div></div></div><div id='method-hsbToHex' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-hsbToHex' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-hsbToHex' class='name expandable'>hsbToHex</a>( <span class='pre'>h, s, v</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>h</span> : Object<div class='sub-desc'><p>Number</p>\n</div></li><li><span class='pre'>s</span> : Object<div class='sub-desc'><p>Number</p>\n</div></li><li><span class='pre'>v</span> : Object<div class='sub-desc'><p>Number\nhsvから16進に変換する</p>\n</div></li></ul></div></div></div><div id='method-intersect' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Thing' rel='Atlas.Thing' class='defined-in docClass'>Atlas.Thing</a><br/><a href='source/Atlas.html#Atlas-Thing-method-intersect' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Thing-method-intersect' class='name expandable'>intersect</a>( <span class='pre'>ex, ey</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>ex</span> : Object<div class='sub-desc'><p>Number</p>\n</div></li><li><span class='pre'>ey</span> : Object<div class='sub-desc'><p>Number\n座標(ex,ey)にオブジェクトが衝突しているかを判定する</p>\n</div></li></ul></div></div></div><div id='method-isQueEmpty' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-isQueEmpty' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-isQueEmpty' class='name expandable'>isQueEmpty</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>アニメーション用のキューが空かどうかを判定する ...</div><div class='long'><p>アニメーション用のキューが空かどうかを判定する</p>\n</div></div></div><div id='method-leave' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-leave' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-leave' class='name expandable'>leave</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>オブジェクトをAppインスタンスやLayerインスタンスから引き離す ...</div><div class='long'><p>オブジェクトをAppインスタンスやLayerインスタンスから引き離す</p>\n</div></div></div><div id='method-loop' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-loop' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-loop' class='name expandable'>loop</a>( <span class='pre'></span> ) : <a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>アニメーションをループする\n@example loop\nsprite.moveBy(100,100,30).and().rotateBy(Math.PI,30).loop(); ...</div><div class='long'><p>アニメーションをループする\n@example loop\nsprite.moveBy(100,100,30).and().rotateBy(Math.PI,30).loop();</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-moveTo' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-moveTo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-moveTo' class='name expandable'>moveTo</a>( <span class='pre'>x, y, frame</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>現在の座標位置からframeフレームで(x,y)移動させる ...</div><div class='long'><p>現在の座標位置からframeフレームで(x,y)移動させる</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>x</span> : Object<div class='sub-desc'><p>{Number}</p>\n</div></li><li><span class='pre'>y</span> : Object<div class='sub-desc'><p>{Number}</p>\n</div></li><li><span class='pre'>frame</span> : Object<div class='sub-desc'><p>{Number}</p>\n</div></li></ul></div></div></div><div id='method-remove' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-remove' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-remove' class='name expandable'>remove</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>オブジェクトをゲームから除外 ...</div><div class='long'><p>オブジェクトをゲームから除外</p>\n</div></div></div><div id='method-rgbToHex' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-rgbToHex' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-rgbToHex' class='name expandable'>rgbToHex</a>( <span class='pre'>r, g, b</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>r</span> : Object<div class='sub-desc'><p>Number</p>\n</div></li><li><span class='pre'>g</span> : Object<div class='sub-desc'><p>Number</p>\n</div></li><li><span class='pre'>b</span> : Object<div class='sub-desc'><p>Number\nRGB形式から16進を取得する</p>\n</div></li></ul></div></div></div><div id='method-rotateBy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-rotateBy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-rotateBy' class='name expandable'>rotateBy</a>( <span class='pre'>angle, frame</span> ) : <a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>angle</span> : Object<div class='sub-desc'><p>{Number}</p>\n</div></li><li><span class='pre'>frame</span> : Object<div class='sub-desc'><p>{Number}\nframeフレームでangle（ラジアン）回転させる</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-scale' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Thing' rel='Atlas.Thing' class='defined-in docClass'>Atlas.Thing</a><br/><a href='source/Atlas.html#Atlas-Thing-method-scale' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Thing-method-scale' class='name expandable'>scale</a>( <span class='pre'>sx, sy</span> ) : <a href=\"#!/api/Atlas.Thing\" rel=\"Atlas.Thing\" class=\"docClass\">Atlas.Thing</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>sx</span> : Object<div class='sub-desc'><p>Number</p>\n</div></li><li><span class='pre'>sy</span> : Object<div class='sub-desc'><p>Number\nオブジェクトを(sx,sy)倍する</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Atlas.Thing\" rel=\"Atlas.Thing\" class=\"docClass\">Atlas.Thing</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-scaleBy' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-scaleBy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-scaleBy' class='name expandable'>scaleBy</a>( <span class='pre'>x, y, frame</span> ) : <a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>x</span> : Object<div class='sub-desc'><p>Number</p>\n</div></li><li><span class='pre'>y</span> : Object<div class='sub-desc'><p>Number</p>\n</div></li><li><span class='pre'>frame</span> : Object<div class='sub-desc'><p>Number\nframeフレームで横にx倍、縦にy倍拡大する</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setPosition' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-setPosition' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-setPosition' class='name expandable'>setPosition</a>( <span class='pre'>x, y</span> ) : <a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>x</span> : Object<div class='sub-desc'><p>Number</p>\n</div></li><li><span class='pre'>y</span> : Object<div class='sub-desc'><p>Number\nオフジェクトを座標(x,y)に移動</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-setSize' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Thing' rel='Atlas.Thing' class='defined-in docClass'>Atlas.Thing</a><br/><a href='source/Atlas.html#Atlas-Thing-method-setSize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Thing-method-setSize' class='name expandable'>setSize</a>( <span class='pre'>w, h</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>w</span> : Object<div class='sub-desc'><p>Number</p>\n</div></li><li><span class='pre'>h</span> : Object<div class='sub-desc'><p>Number\nオブジェクトを幅w、高さhに設定する</p>\n</div></li></ul></div></div></div><div id='method-soundClonePlay' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-soundClonePlay' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-soundClonePlay' class='name expandable'>soundClonePlay</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>セットされた音楽を複製して再生する ...</div><div class='long'><p>セットされた音楽を複製して再生する</p>\n</div></div></div><div id='method-soundGetAlltime' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-soundGetAlltime' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-soundGetAlltime' class='name expandable'>soundGetAlltime</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>全再生時間を取得する ...</div><div class='long'><p>全再生時間を取得する</p>\n</div></div></div><div id='method-soundGetCount' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-soundGetCount' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-soundGetCount' class='name expandable'>soundGetCount</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>再生中の音楽の再生位置を取得する ...</div><div class='long'><p>再生中の音楽の再生位置を取得する</p>\n</div></div></div><div id='method-soundGetVolume' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-soundGetVolume' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-soundGetVolume' class='name expandable'>soundGetVolume</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>セットされた音楽のボリュームを取得する ...</div><div class='long'><p>セットされた音楽のボリュームを取得する</p>\n</div></div></div><div id='method-soundIsPlaying' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-soundIsPlaying' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-soundIsPlaying' class='name expandable'>soundIsPlaying</a>( <span class='pre'></span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>音楽が再生中かを調べる ...</div><div class='long'><p>音楽が再生中かを調べる</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Boolean</p>\n</div></li></ul></div></div></div><div id='method-soundLoopPlay' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-soundLoopPlay' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-soundLoopPlay' class='name expandable'>soundLoopPlay</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>セットされた音楽をループ再生する ...</div><div class='long'><p>セットされた音楽をループ再生する</p>\n</div></div></div><div id='method-soundPause' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-soundPause' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-soundPause' class='name expandable'>soundPause</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>再生中の音楽を一時停止する ...</div><div class='long'><p>再生中の音楽を一時停止する</p>\n</div></div></div><div id='method-soundPlay' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-soundPlay' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-soundPlay' class='name expandable'>soundPlay</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>セットされた音楽を再生する ...</div><div class='long'><p>セットされた音楽を再生する</p>\n</div></div></div><div id='method-soundReplay' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-soundReplay' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-soundReplay' class='name expandable'>soundReplay</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>再生中の音楽をはじめから再生する ...</div><div class='long'><p>再生中の音楽をはじめから再生する</p>\n</div></div></div><div id='method-soundSetCount' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-soundSetCount' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-soundSetCount' class='name expandable'>soundSetCount</a>( <span class='pre'>time</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>time</span> : Object<div class='sub-desc'><p>Number\n指定された位置に再生位置を設定する</p>\n</div></li></ul></div></div></div><div id='method-soundSetVolume' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-soundSetVolume' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-soundSetVolume' class='name expandable'>soundSetVolume</a>( <span class='pre'>volume</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>volume</span> : Object<div class='sub-desc'><p>Number\nセットされた音楽のボリュームを設定する</p>\n</div></li></ul></div></div></div><div id='method-soundStop' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-soundStop' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-soundStop' class='name expandable'>soundStop</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>再生中の音楽を停止する ...</div><div class='long'><p>再生中の音楽を停止する</p>\n</div></div></div><div id='method-stop' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-stop' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-stop' class='name expandable'>stop</a>( <span class='pre'></span> ) : <a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>アニメーションを中止する ...</div><div class='long'><p>アニメーションを中止する</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-then' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Util' rel='Atlas.Util' class='defined-in docClass'>Atlas.Util</a><br/><a href='source/Atlas.html#Atlas-Util-method-then' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Util-method-then' class='name expandable'>then</a>( <span class='pre'>fn, frame</span> ) : <a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a><span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>アニメーションの途中に関数を実行する ...</div><div class='long'><p>アニメーションの途中に関数を実行する</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fn</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>frame</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Atlas.Util\" rel=\"Atlas.Util\" class=\"docClass\">Atlas.Util</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-within' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/Atlas.Thing' rel='Atlas.Thing' class='defined-in docClass'>Atlas.Thing</a><br/><a href='source/Atlas.html#Atlas-Thing-method-within' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Atlas.Thing-method-within' class='name expandable'>within</a>( <span class='pre'>target, range</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>target</span> : Object<div class='sub-desc'><p>Thingクラス</p>\n</div></li><li><span class='pre'>range</span> : Object<div class='sub-desc'><p>Number\n自分がターゲットから半径range以内にいるかどうかを判定する</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});