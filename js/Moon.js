/**
* Moon.js v0.4.0 - Simple Template engine
* https://github.com/steelydylan/Moon.js
* MIT Licensed
* Copyright (C) 2015 steelydylan http://horicdesign.com
*/
(function(){
    var Moon = function(){
        for(var key in Moon){
            window[key] = Moon[key];
        }
    };
    Moon.createClass = function (superClass, obj) {
        var newClass = function () {
            this.initialize.apply(this, arguments);
        };
        if (typeof superClass == "function" && typeof obj == "object") {
            newClass.prototype = Object.create(superClass.prototype);
            newClass.prototype.inherit = function () {
                this.initialize = this.superClass.prototype.initialize;
                this.superClass = this.superClass.prototype.superClass;
                if(this.initialize)
                    this.initialize.apply(this, arguments);
            };
        } else if (typeof superClass == "object" && obj == void 0) {
            obj = superClass;
        }
        for (var key in obj) {
            newClass.prototype[key] = obj[key];
        }
        newClass.prototype.superClass = superClass;
        return newClass;
    };
    Moon.extendClass = function (targetclass,obj){
        for(var key in obj){
            targetclass.prototype[key] = obj[key];
        }
    };
    Moon.objs = [];
    Moon.getObjectById = function(id){
        var objs = this.objs;
        for(var i = 0,n = objs.length; i < n; i++){
            var obj = objs[i];
            var templates = obj.templates;
            for(var t = 0,m = templates.length; t < m; t++){
                if(templates[t] == id){
                    return objs[t];
                }
            }
        }
        return null;
    }
    $(document).on("input change click","[data-bind]",function(e){
        var data = $(this).data("bind");
        var val = $(this).val();
        var attr = $(this).attr("href");
        if(attr){
            val = attr.replace("#","");
        }
        var id = $(this).parents("[data-id]").data("id");
        if(id){
            var obj = Moon.getObjectById(id);
            if($(e.target).attr("type") == "checkbox" || $(e.target).attr("type") == "radio"){
                if($(this).is(":checked")){
                    obj.updateDataByString(data,val);
                }else{
                    obj.updateDataByString(data,'');
                }
            }else{
                obj.updateDataByString(data,val);
            }
        }
    });
    $(document).on("input click change","[data-action]",function(e){
        if(e.type == "click" && $(e.target).is("select")){
            return;
        }
        if(e.type == "input" && $(e.target).attr("type") == "button"){
            return;
        }
        var string = $(this).data("action");
        var action = string.replace(/\(.*?\);?/,"");
        var parameter = string.replace(/(.*?)\((.*?)\);?/,"$2");
        var pts = parameter.split(",");//引き数
        var id = $(this).parents("[data-id]").data("id");
        if(id){
            var obj = Moon.getObjectById(id);
            obj.e = e;
            if(obj.method[action]){
                obj.method[action].apply(obj,pts);
            }
        }
    });
    Moon.View = Moon.createClass({
        initialize:function(opt){
            Moon.objs.push(this);
            for(var i in opt){
                this[i] = opt[i];
            }
            this.setId();
        },
        getData:function(){
            return JSON.parse(JSON.stringify(this.data));
        },
        saveData:function(key){
            var data = JSON.stringify(this.data);
            localStorage.setItem(key,data);
            return this;
        },
        loadData:function(key){
            var data = JSON.parse(localStorage.getItem(key));
            if(data){
                this.data = data;
            }
            return this;
        },
        getRand: function (a, b) {
            return ~~(Math.random() * (b - a + 1)) + a;
        },
        getRandText : function(limit){
            var ret = "";
            var strings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var length = strings.length;
            for(var i = 0; i < limit; i++){
                ret += strings.charAt(Math.floor(this.getRand(0,length)));
            }
            return ret;
        },
        setId:function(){
            var text;
            var ids = Moon.ids;
            var flag = false;
            while(1){
                text = this.getRandText(10);
                for(var i = 0,n = Moon.ids; i < n; i++){
                    if(Moon.ids[i] === text){
                        flag = true;
                    }
                }
                if(flag === false){
                    break;
                }
            }
            this.data.moon_id = text;
        },
        getDataByString:function(s){
            var o = this.data;
            s = s.replace(/\[(\w+)\]/g, '.$1');  // convert indexes to properties
            s = s.replace(/^\./, ''); // strip leading dot
            var a = s.split('.');
            while (a.length) {
                var n = a.shift();
                if (n in o) {
                    o = o[n];
                } else {
                    return;
                }
            }
            return o;
        },
        updateDataByString:function(path,newValue){
            var object = this.data;
            var stack = path.split('.');
            while(stack.length>1){
                object = object[stack.shift()];
            }
            object[stack.shift()] = newValue;
        },
        removeDataByString:function(path){
            var object = this.data;
            var stack = path.split('.');
            while(stack.length>1){
                object = object[stack.shift()];
            }
            var shift = stack.shift();
            if(shift.match(/^\d+$/)){
                object.splice(Number(shift),1);
            }else{
                delete object[shift];
            }
        },
        resolveBlock:function(html,item,i){
            var that = this;
            var touchs = html.match(/<!-- BEGIN (\w+):touch#(\w+) -->/g);
            var touchnots = html.match(/<!-- BEGIN (\w+):touchnot#(\w+) -->/g);
            var exists = html.match(/<!-- BEGIN (\w+):exist -->/g);
            var empties = html.match(/<!-- BEGIN (\w+):empty -->/g);
            /*タッチブロック解決*/
            if(touchs){
                for(var k = 0,n = touchs.length; k < n; k++){
                    var start = touchs[k];
                    start = start.replace(/(\w+):touch#(\w+)/,"($1):touch#($2)");
                    var end = start.replace(/BEGIN/,"END");
                    var reg = new RegExp(start+"(([\\n\\r\\t]|.)*?)"+end,"g");
                    html = html.replace(reg,function(m,key2,val,next){
                        if(item[key2] == val){
                            return next;
                        }else{
                            return "";
                        }
                    })
                }
            }
            /*タッチノットブロック解決*/
            if(touchnots){
                for(var k = 0,n = touchnots.length; k < n; k++){
                    var start = touchnots[k];
                    start = start.replace(/(\w+):touchnot#(\w+)/,"($1):touchnot#($2)");
                    var end = start.replace(/BEGIN/,"END");
                    var reg = new RegExp(start+"(([\\n\\r\\t]|.)*?)"+end,"g");
                    html = html.replace(reg,function(m,key2,val,next){
                        if(item[key2] != val){
                            return next;
                        }else{
                            return "";
                        }
                    });
                }
            }
            /*existブロックを解決*/
            if(exists){
                for(var k = 0,n = exists.length; k < n; k++){
                    var start = exists[k];
                    start = start.replace(/(\w+):exist/,"($1):exist");
                    var end = start.replace(/BEGIN/,"END");
                    var reg = new RegExp(start+"(([\\n\\r\\t]|.)*?)"+end,"g");
                    html = html.replace(reg,function(m,key2,next){
                        if(item[key2]){
                            return next;
                        }else{
                            return "";
                        }
                    });
                }
            }
            /*emptyブロックを解決*/
            if(empties){
                for(var k = 0,n = empties.length; k < n; k++){
                    var start = empties[k];
                    start = start.replace(/(\w+):empty/,"($1):empty");
                    var end = start.replace(/BEGIN/,"END");
                    var empty = new RegExp(start+"(([\\n\\r\\t]|.)*?)"+end,"g");
                    html = html.replace(empty,function(m,key2,next){
                        if(!item[key2]){
                            return next;
                        }else{
                            return "";
                        }
                    });
                }
            }
            /*変数解決*/
            html = html.replace(/{(\w+)}(\[(\w+)\])*/g,function(n,key3,key4,converter){
                var data;
                if(key3 == "i"){
                    data = i;
                }else{
                    if(item[key3]){
                        data = item[key3];
                    }else{
                        return n;
                    }
                }
                if(converter && that.convert && that.convert && that.convert[converter]){
                    return that.convert[converter](data);
                }else{
                    return data;
                }
            });
            return html;
        },
        /*絶対パス形式の変数を解決*/
        resolveAbsBlock:function(html){
            var exists = html.match(/<!-- BEGIN (.*?):exist -->/g);
            var that = this;
            /*existブロックを解決*/
            if(exists){
                for(var k = 0,n = exists.length; k < n; k++){
                    var start = exists[k];
                    start = start.replace(/<!-- BEGIN (.*?):exist/,"<!-- BEGIN ($1):exist");
                    var end = start.replace(/BEGIN/,"END");
                    var reg = new RegExp(start+"(([\\n\\r\\t]|.)*?)"+end,"g");
                    html = html.replace(reg,function(m,key2,next){
                        var data = that.getDataByString(key2);
                        if(data){
                            return next;
                        }else{
                            return "";
                        }
                    });
                }
            }
            html = html.replace(/{(.*?)}/g,function(n,key3){
                var data = that.getDataByString(key3);
                if(data){
                    return data;
                }else{
                    return n;
                }
            });
            return html;
        },
        resolveInclude:function(html){
            var include = /<!-- #include id="(.*?)" -->/g;
            html = html.replace(include,function(m,key){
                return $("#"+key).html();
            });
            return html;
        },
        resolveWith:function(html){
            var width = /<!-- BEGIN (\w+):with -->(([\n\r\t]|.)*?)<!-- END (\w+):with -->/g;
            html = html.replace(width,function(m,key,val){
                m = m.replace(/data\-bind=['"](.*?)['"]/g,"data-bind='"+key+".$1'");
                return m;
            });
            return html;
        },
        resolveLoop:function(html){
            var loop = /<!-- BEGIN (.+?):loop -->(([\n\r\t]|.)*?)<!-- END (.+?):loop -->/g;
            var that = this;
            /*ループ文解決*/
            html = html.replace(loop,function(m,key,val){
                var keys = that.getDataByString(key);
                var ret = "";
                if(keys instanceof Array){
                    for(var i = 0,n = keys.length; i < n; i++){
                        ret += that.resolveBlock(val,keys[i],i);
                    }
                }
                /*エスケープ削除*/
                ret = ret.replace(/\\([^\\])/g,"$1");
                return ret;
            });
            return html;
        },
        removeData: function(arr){
            var data = this.data;
            for(var i in data){
                for(var t = 0,n = arr.length; t < n; t++){
                    if(i === arr[t]){
                        delete data[i];
                    }
                }
            }
        },
        hasLoop:function(txt){
            var loop = /<!-- BEGIN (.+?):loop -->(([\n\r\t]|.)*?)<!-- END (.+?):loop -->/g;
            if(txt.match(loop)){
                return true;
            }else{
                return false;
            }
        },
        getHtml:function(selector){
            var $template = $(selector);
            var html = $template.html();
            if(!html){
                return "";
            }
            var data = this.data;
            /*インクルード解決*/
            html = this.resolveInclude(html);
            /*with解決*/
            html = this.resolveWith(html);
            /*ループ解決*/
            while(this.hasLoop(html)){
                html = this.resolveLoop(html);
            }
            /*変数解決*/
            html = this.resolveBlock(html,data);
            /*エスケープ削除*/
            html = html.replace(/\\([^\\])/g,"$1");
            /*絶対パスで指定された変数を解決*/
            html = this.resolveAbsBlock(html);
            /*空行削除*/
            return html.replace(/^([\t ])*\n/gm,"");
        },
        update:function(txt){
            var html = this.getHtml();
            var templates = this.templates;
            for(var i = 0,n = templates.length; i < n; i++){
                var tem = templates[i];
                var selector = "#"+tem;
                var html = this.getHtml(selector);
                var $target = $("[data-id="+tem+"]");
                if($target.length == 0){
                    var $newitem = $("<div data-id='"+tem+"'></div>");
                    $newitem.html(html);
                    $(selector).after($newitem);
                }else{
                    $target.html(html);
                }
            }
            if(txt == "text"){
                $("[data-id='"+this.id+"']").text(html);
            }else{
                $("[data-id='"+this.id+"']").html(html);
            }
            this.updateBindingData();
            return this;
        },
        updateBindingData:function(){
            var that = this;
            var templates = that.templates;
            for(var i = 0,n = templates.length; i < n; i++){
                var temp = templates[i];
                var $template = $("[data-id="+temp+"]");
                $template.find("[data-bind]").each(function(){
                    var data = that.getDataByString($(this).data("bind"));
                    if($(this).attr("type") == "checkbox" || $(this).attr("type") == "radio"){
                        if(data == $(this).val()){
                            $(this).prop("checked",true);
                        }
                    }else{
                        $(this).val(data);
                    }
                });
            }
        },
        copyToClipBoard:function(){
            var copyArea = $("<textarea/>");
            $("body").append(copyArea);
            copyArea.text(this.getHtml());
            copyArea.select();
            document.execCommand("copy");
            copyArea.remove();
        },
        remove:function(path){
            var object = this.data;
            var stack = path.split('.');
            while(stack.length>1){
                object = object[stack.shift()];
            }
            var shift = stack.shift();
            if(shift.match(/^\d+$/)){
                object.splice(Number(shift),1);
            }else{
                delete object[shift];
            }
        }
    });
    //for browserify
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Moon;
    }else{
        window.Moon = Moon;
    }
})();