$(function(){
    var i18n = jQuery.i18n.browserLang();
    var lang;
    if(i18n.indexOf("en") !== -1){
        lang = "en";
    }else{
        lang = "ja";
    }
    var main = new Moon.View({
        templates:["main"],
        data:{
            lang:lang
        }
    }).update();
});