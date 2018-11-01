    $("#task").click(function(){
        bhtml=''
            +'<div class="row">'
            +'    <div class="col-xs-3">'
            +'    <select class="form-control" id="select_group">'
            +'    </select>'
            +'    </div>'
            +'    <div class="col-xs-9">'
            +'       <div class="panel panel-default" style="opacity: 0.9; height:35px">'
            +'       <div class="panel-body" style="color:#867e08" id="groupMember">'
            +'                   <p>选择一个组，查看组成员</p>'
            +'           </div>'
            +'       </div>'
            +'        </div>'
            +'    </div>'
            +'                <div class="row" id="opt">'
            +'                <form >'
            +'                    <div id="notice" class="col-xs-12"></div>'
            +'                    <div class="col-xs-3">'
            +'                      <select class="form-control" id="select_opt" name="GROUP">'
            +'                        </select>'
            +'                    </div>'
            +'                    <div class="col-xs-6" id="modHtml">'
            +'                            <input type="text" class="form-control" id="check_input" placeholder="请选择操作模块" style="height:35px" readonly>'
            +'                    </div>'
            +'                    <div class="col-xs-3">'
            +'                        <button type="button" class="btn btn-info" id="execute">异步执行</button>'
            +'                       </div>'
            +'                </form>'
            +'                </div>'
            +'            <br>'
            +'        </div>'            
        $("#b-content")[0].innerHTML = bhtml    
        $("#b-content")[0].hidden = false;
        $("#t-content")[0].hidden = true;
        $.ajax({
            url: "/myhosts/init/ansible",
            dataType: "json",
            success: function(msg){
                sl = '<option value="">选择一个组</option>'
                $.each(msg["ret"]["products"], function(k,v){
                    sl += '<option value="'+v["strname"]+'">'+v['name']+'</oprion>'
                })
                $("#select_group")[0].innerHTML = sl + "";
                sc = '<select class="form-control"><option value="">选择一个模块</option>'
                $.each(msg["ret"]["modules"], function(k,v){
                    sc += '<option value="'+v["modStr"]+'">'+ v["modName"]+'</option>'
                })
                $("#select_opt")[0].innerHTML = sc+ '</select>';
            }
        })
    })
    $(document).on('change', "#select_group", function () {    // 选中主机组，展示主机列表
            console.info("select_group");
            g = $("#select_group option:selected").val();
            $.ajax({
                //url: "/myhosts/member/product?p="+g,
                url: "/myhosts/member/env?p="+g,
                dataType: "json",
                success: function(msg){
                    s = "";
                    $.each(msg["ret"], function(k,v){
                        s += v["ip"] + "、"
                    })
                    $("#groupMember")[0].innerText = s;
                }
            })
        })
    $(document).on('change', "#select_opt", function(data){ //选择模块后，修改对于参数html
        $.ajax({
            url: "/myhosts/html/ansible?m="+this.value,
            dataType: "json",
            success: function(msg){
                $("#modHtml")[0].innerHTML = msg["ret"];
                showTree();
            }
        })
    })
    $(document).on('click', "#execute", function(){  //点击执行按钮
        $("#t-content")[0].innerHTML = "";
        $("#t-content")[0].hidden = true;
        //group = $("#select_group option:selected").text();
        group = $("#select_group option:selected").val();
        if(group===""){
            alert("必须选择一个服务器组！！！");
            return
        }
        mod = $("#select_opt option:selected").val();
        if(mod===""){
            alert("必须选择操作模块");  return
        }
    w = $("#opt")[0];
    //opt = $("select option:selected", w)[0].value;
    check_id = $("#modHtml")[0].children[0].id;
    if(check_id=="check_file"){
        v1 = $("#mod_val")[0].value;
        v2 = $("#mod_v2")[0].value;
        if(v1=="" || v2==""){
            $("#notice")[0].innerHTML='<div class="alert alert-danger alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert">' +
                '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>' +
                '</button>该模块缺少参数</div>';
            return
        };
        //val = "源文件：" + v1 + "  <br>目标地址：" + v2;
        val = "src=" + v1 + " dest=" + v2;
    }else if(check_id=="check_input"){
        val = $("input", w)[0].value;
        if(val==""){
            $("#notice")[0].innerHTML='<div class="alert alert-danger alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert">' +
                '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>' +
                '</button>该模块缺少参数</div>';
            return
        }
    }
    console.log("host="+group+"&am="+mod+"&args="+ encodeURIComponent(val));
    $.ajax({
        type: "POST",
        url: "/myhosts/ansible/task",
        dataType: "json",
        data: "host="+group+"&am="+mod+"&args="+ encodeURIComponent(val),
        success: function(msg){
            //alert("任务已发, ID: "+ msg["msg"]);
            //$("#m-content")[0].innerHTML = "任务已发, ID:" + msg["msg"] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='/myhosts/task?opt=getCelery&tid="+msg["msg"]+"' target='view_window'>点击</a>";
            $("#m-content")[0].innerHTML = "任务已发, ID:" + msg["msg"] + "&nbsp;&nbsp;&nbsp;&nbsp;<button class='btn btn-link btn-xs taskResult' type='button' name='"+msg["msg"]+"'>点击</button> ";
            $("#myModal").modal("show");
        }
    })
    })
    $("#resultList").click(function(){
        $("#t-content")[0].hidden = false;
        $("#b-content")[0].hidden = true;
        $.ajax({
            url: "/myhosts/list/task",
            dataType: "json",
            success: function(msg){
                var tc = "<tr style='color:#005aff;background: #fffff9;'><td>ID</td><td>JID</td><td>TASK</td><td>参数</td><td>时间</td><td>查看结果</td></tr>";
                $.each(msg["ret"], function(k,v){
                    tc += "<tr><td>" + v["id"]+ "</td><td>" + v["jid"] + "</td><td>" + v["taskName"] +"</td><td>"+v["vars"]+"</td><td>"+v["addTime"]+"</td><td><button type='button' class='btn btn-link btn-xs taskResult' name='"+v["jid"]+"'>点击</button></td></tr>";
                })
                $("#t-content")[0].innerHTML = tc;
            }
        })
    })
    $("#taskEdit").click(function(){
        $.ajax({
            url: "/myhosts/list/ansibleyaml",
            dataType: "json",
            success: function(msg){
                console.log(msg)
                sc = '<div class="row"><div class="col-md-4"><ul class="list-group">';
                $.each(msg["ret"], function(k,v){
                    sc += '<li class="list-group-item">'+v["yname"]+'</li>'
                })
                $("#b-content")[0].innerHTML = sc + '</ul></div><div class="col-md-8"><textarea class="form-control" rows=""></textarea></div>';
                $("#b-content")[0].hidden = false;
                $("#t-content")[0].hidden = true;
            }
        })
    })
    $("#mycompose").click(function(){
        sc = '<div class="row"><div class="col-md-8"><textarea class="form-control" style="height:450px">'
            +'</textarea></div>'
            +'<div class="col-md-4" style="padding-left: 0px;"><p>搜索Group或者主机</p><input class="form-control" id="gsearch">'
            +'<ul class="dropdown-menu" id="slist" style="padding-left: 12px;"></ul></div></div>';
        //document.getElementById("slist").dropdown('toggle');
        $("#b-content")[0].innerHTML = sc;
        $("#b-content")[0].hidden = false;
        $("#t-content")[0].hidden = true;
    })
    $(document).on("input", "#gsearch", function(data){
        if(this.value!=""){
            //$.ajax({
            //    url: "/myhosts/list/search",
            //    dataType: "json",
            //    success: 
            //})
            document.getElementById("slist").innerHTML="<li>"+this.value+"</li>";
            $('.dropdown-menu').dropdown('toggle');
        }
    })
    $(document).on("click", ".taskResult", function(data){
        jid = this.name;
        console.log(jid);
        $.ajax({
            type: "POST",
            url: "/dotask",
            dataType: "json",
            data: "id="+jid,
            success: function(msg){
                mc = "";
                $.each(msg["rst"], function(k,v){
                    mc += "<tr><td>"+v[1]+"</td><td>"+v[2]+"</td><td><pre>"+v[3]+"</pre</td></tr>"
                    //mc += "<tr><td>"+v[1]+"</td><td>"+v[2]+"</td><td><textarea class='form-control'>"+v[3]+"</textarea</td></tr>"
                })
                if (msg["rst"].length == 0){
                    mc = '<p class="bg-warning" style="text-align: center;">未查询到结果</p>'
                }
                $("#t-content")[0].innerHTML = mc;
                $("#t-content")[0].hidden = false;
                $("#myModal").modal("hide");
            }
        })
    })

            function showTree() {   //文件树展示
                var setting = {
                    view: {
                        fontCss: setFontCss
                    },
                    async: {
                        enable: true,
                        url:"/myhosts/ajax",
                        autoParam:["id", "name", "level=lv", "pid=fn"],
                        type: "post",
                        otherParam:{},
                        dataType: "json",
                    },
                    callback: {
                        onClick: zTreeOnClick
                    }
                };
                $(document).ready(function(){
                    $.fn.zTree.init($("#treeDemo"), setting);
                });
            }
            function setFontCss(treeId, treeNode){  //设置颜色
                return {"color": treeNode.color}
            }
            function filter(treeId, parentNode, childNodes) {
                if (!childNodes) return null;
                for (var i=0, l=childNodes.length; i<l; i++) {
                    childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
                }
                return childNodes;
            }
            function zTreeOnClick(event, treeId, treeNode){
                    $("#mod_val")[0].value=treeNode.pid;
                    console.log(treeNode.pid)
                    if($("#mod_val")[0].type=="text"){
                        $.ajax({
                            url: "/myhosts/confcontent?fn="+treeNode.pid,
                            dataType: "json",
                            success: function(msg){
                                document.getElementById("showCont").innerText=msg["ret"];
                            }
                        })
                    }
                    else{console.log("B")}
            }

    $("#envdeploy").click(function(){
        $("#task")[0].click();
        button=document.getElementById("execute");
        button.innerText="添加";
        button.id="tasklist";
    })

    $(document).on('click', '#tasklist', function(){
        $("#t-content")[0].innerHTML="";
        
    })
    $("#groupInfo").click(function(){
        $.ajax({
            url: "/myhosts/envlist",
            dataType: "json",
            success: function(msg){
                s = "<tr style='text-align: center; background-color: #4fe5e924;'><td>组名</td><td>描述</td><td>主机列表</td></td>";
                $.each(msg["ret"], function(k,v){
                    s += "<tr><td>"+v["name"]+'</td><td>'+v["remark"]+'</td><td>'+v["hosts"]+'</td></tr>';
                })
                s = s.replace(/生产环境/g, "<font color='red'>生产</font>环境");
                s = s.replace(/生产和/g, "<font color='red'>生产</font>和");
                s = s.replace(/灰度/g, "<font color='blue'>灰度</font>");
                s = s.replace(/生产测试/g, "<font color='green'>生产测试</font>");
                $("#b-content")[0].hidden = true;
                $("#t-content")[0].innerHTML=s;
                $("#t-content")[0].hidden = false;
            }
        })
    })
    $("#confContent").click(function(){
        $("#b-content")[0].innerHTML = '<div class="row"><div class="col-sm-4"><nav class="navbar navbar-default active zTreeDemoBackground" role="navigation" style="height:460px;overflow:auto">'
            +'<ul id="treeDemo" class="ztree"></ul></nav></div>'
            +'<div class="col-sm-8">'
            +'<input class="form-control" id=mod_val readonly value="请在左侧选择文件">'
            +'<textarea class="form-control" id="showCont" style="height:427px" readonly></textarea></div></div>'
        $("#b-content")[0].hidden = false;
        $("#t-content")[0].hidden = true;
        showTree();
    })
