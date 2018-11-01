$(function(){
	$(document).scroll(function(){
		var _h = $(this).scrollTop();
		SetCookie("a", _h);
	})
	$('.page a').click(function(){
		$(document).scrollTop = GetCookie("a");
	})
    function SetCookie(sName, sValue) {
        document.cookie = sName + "=" + escape(sValue) + "; ";
    }
	function GetCookie(sName) {

        var aCookie = document.cookie.split("; ");
        for (var i = 0; i < aCookie.length; i++) {
            var aCrumb = aCookie[i].split("=");
            if (sName == aCrumb[0])
                return unescape(aCrumb[1]);
        }

        return 0;
	}
})