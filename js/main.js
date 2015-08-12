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
            lang:lang,
            mode:"setup"
        },
        method:{
            changeMode:function(mode){
                this.data.mode = mode;
                this.saveData("Atlas");
                this.update();
                Prism.highlightAll();
            },
            update:function(){
                this.saveData("Atlas");
                this.update();
                Prism.highlightAll();
            }
        }
    }).loadData("Atlas").update();
    Prism.highlightAll();
});