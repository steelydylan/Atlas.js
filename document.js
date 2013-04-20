$(document).ready(function () {
    $("#content").load("./html/content1.html", function () { prettyPrint(); });
    $(".sidemenu").click(function () {
        $(".sidemenu").each(function () {
            $(this).parent("li").removeClass("active");
        });
        $(this).parent("li").addClass("active");
        var data = "./html/";
        data += $(this).attr("href").slice(1);
        console.log(data);
        $("#content").load(data, function () { prettyPrint(); });
    });
});