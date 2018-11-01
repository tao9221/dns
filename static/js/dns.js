$(document).ready(function() {
    $("#ckdns").click(function() {
        var domain = $("#domain").val();
        var dnslist = $("#dnslist").val();
        var txt = "";
        // $("#ckdns").attr("disabled", true);
        // $("#ckdns").attr("class", "btn btn-danger");
        $.ajax({
          url : "/monitor/domain",
          type : "POST",
          dataType:"json",
          data : {domain:domain,dnslist:dnslist},
          beforeSend: function () {
               $('body').block({
                    message: '<h3><img src="/static/image/wait.gif">正在加载...</h3>',
                    css: {backgroundColor: "gray" }
                })
          },
          success:function(result) {
              for (var r in result['result']){
                  txt=txt+"<tr><td>"+result['result'][r]+"</td></tr>"
              };
              $("#dnstitle").text("域名解析结果:");
              document.getElementById("res").innerHTML = txt;
          },
          complete: function () {
              $.unblockUI();
          },
          error:function(result) {
            $("#res").text("no result.");
          }
        });
    });
});

$(document).ready(function () {
    $("#updates").click(function () {
        var txt = "";
        $.ajax({
            url:"/monitor/updates_zb_hosts",
            type:"POST",
            dataType:"json",
            data:{},
             beforeSend: function () {
                $('body').block({
                    message: '<h3><img src="/static/image/wait.gif">正在加载...</h3>',
                    css: {backgroundColor: "gray" }
                })
            },
            success:function (statues) {
                for (var k in statues){
                   txt=txt+"<tr><td>"+k+"</td><td>"+statues[k]['ip']+"</td></tr>"
                };
               document.getElementById("ipcontent").innerHTML = txt;
               $("#pri").text("最新监控主机列表");
            },
            complete: function () {
                 $.unblockUI();
            },
            error:function (statues) {
               $("#ipcontent").text("更新出现错误.");
            }
        });
    });
});

$( function() {
    var cache = {};
    $( "#cmds" ).autocomplete({
      minLength: 2,
      source: function( request, response ) {
        var term = request.term;
        if ( term in cache ) {
          response( cache[ term ] );
          return;
        }

        $.getJSON("/monitor/getCmdsAllData", request, function( data, status, xhr ) {
          cache[ term ] = data.record_data;
          response( data.record_data );
        });
      }
    });
  } );

$(document).ready(function () {
    $("#searchs").click(function () {
        var txt="";
        var term = $("#cmds").val();
        console.log(term);
        $.ajax({
            url:"/monitor/getCmdsAllData",
            type:"POST",
            dataType:"json",
            data:{'term':term},
            success:function (data) {
                for (var k in data){
                   txt=txt+"<tr><td>"+k+"</td><td>"+data[k][0]+"</td><td>"+data[k][1]+"</td><td>"+data[k][2]+"</td></tr>"
                };
                $("#footerpages").attr("class","hidden");
               document.getElementById("shows").innerHTML = txt;
               document.getElementById("hidden").display = "none";
            }
        });
    });
});