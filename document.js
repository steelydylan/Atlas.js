$(function () {
    if (language && language == "English")
        $("#content2").load("./html2/content1.html", function () { prettyPrint(); });
    else
        $("#content").load("./html/content1.html", function () { prettyPrint(); });
        $(".sidemenu").click(function () {
            if (language == "English") {
                $(".sidemenu").each(function () {
                    $(this).parent("li").removeClass("active");
                });
                $(this).parent("li").addClass("active");
                var data = "./html2/";
                data += $(this).attr("href").slice(1);
                console.log(data);
                $("#content2").load(data, function () { prettyPrint(); });
            } else {
                $(".sidemenu").each(function () {
                    $(this).parent("li").removeClass("active");
                });
                $(this).parent("li").addClass("active");
                var data = "./html/";
                data += $(this).attr("href").slice(1);
                console.log(data);
                $("#content").load(data, function () { prettyPrint(); });
            }
        });

});