$(document).ready(function() {
      $(".submit").click(function(e) {
        e.preventDefault();
        var obj = $(this);
        var host = $(".host").val();
        var cmd = $(".cmd").val();
        $.ajax({
          url : "/task",
          type : "POST",
          data : {host:host,cmd:cmd},
          dataType : "json",
          success : function(result) {
              var jid=result.jid;
              $(".submit").text("执行中");
              var i=setInterval(_fetchRst(jid),2000);
          },                            
          error:function(msg) {
            $(".result").text("ajax error");
          }
        })
      })
});
function fetchRst(jid) {   
                $.ajax({  
                    type: "POST",  
                    url: "/dotask",
                    data:{id:jid},
                    dataType: "json",
                    success: function(data) {
                     $(".result").text( data.rst);
                    }
                });
}

function _fetchRst(jid){
      return function(){
      fetchRst(jid);
      }
}
