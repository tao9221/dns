
    $("#appendDevice").click(function(){
        bc=$("#b-content")[0];
        fhtml = ''
            +'<form class="form-horizontal">'
            +'  <div class="form-group">'
            +'    <label for="" class="col-sm-2 control-label">设备名</label>'
            +'    <div class="col-sm-10">'
            +'<div class="input-group"><span class="input-group-addon">@</span>'
            +'      <input type="text" class="form-control" id="device" placeholder="device">'
            +'    </div></div>'
            +'  </div>'
            +'  <div class="form-group">'
            +'    <label for="" class="col-sm-2 control-label">IP</label>'
            +'    <div class="col-sm-10">'
            +'<div class="input-group"><span class="input-group-addon">IP</span>'
            +'      <input type="text" class="form-control" id="ipadd" placeholder="IP">'
            +'    </div></div>'
            +'  </div>'
            +'  <div class="form-group">'
            +'    <label for="" class="col-sm-2 control-label">CMD</label>'
            +'    <div class="col-sm-10">'
            +'<div class="input-group"><span class="input-group-addon">C </span>'
            +'      <input type="text" class="form-control" id="cmd" placeholder="命令">'
            +'    </div></div>'
            +'  </div>'
            +'  <div class="form-group">'
            +'    <label for="" class="col-sm-2 control-label">备份程序</label>'
            +'    <div class="col-sm-10">'
            +'<div class="input-group"><span class="input-group-addon">V </span>'
            +' <select class="form-control" id="back_func"><option value="V1">v1</option><option value="V2">v2</option></select>'
            +'    </div></div>'
            +'  </div>'
            +'  <div class="form-group">'
            +'    <label for="" class="col-sm-2 control-label">用户</label>'
            +'    <div class="col-sm-10">'
            +'<div class="input-group"><span class="input-group-addon">'
            +'<span class="glyphicon glyphicon-user" aria-hidden="true" style="color:blue"></span></span>'
            +'      <input type="text" class="form-control" id="buser" placeholder="用户">'
            +'    </div></div>'
            +'  </div>'
            +'  <div class="form-group">'
            +'    <label for="" class="col-sm-2 control-label">认证</label>'
            +'    <div class="col-sm-10">'
            +'<div class="input-group"><span class="input-group-addon">'
            +'<span class="glyphicon glyphicon-eye-close" aria-hidden="true" style="color:red"></span></span>'
            +'      <input type="password" class="form-control" id="bpass" placeholder="认证">'
            +'    </div></div>'
            +'  </div>'
            +'  <div class="form-group">'
            +'    <div class="col-sm-offset-2 col-sm-10">'
            +'      <button type="button" class="btn btn-default" id="append2">Append</button>'
            +'    </div>'
            +'  </div>'
            +'</form>'
        bc.innerHTML = fhtml;
        bc.hidden = false;
        $("#t-content")[0].hidden = true;
    })
    $("#other3").click(function(){
        alert("嘚儿，驾！！！");
    })
    $("#relation").click(function(){
        chtml=$("#b-content")[0];
        chtml.innerHTML = '<div id="echatRelation" style="width: 600px; height:300px"></div>';
        myChart= echarts.init(document.getElementById('echatRelation'));
        var categories = [{name:"Q"},{name: "S"},{name: "R"}];
        option = {
            title: {
                text: '网络关系图',
                subtext: 'Show relation',
                top: 'bottom',
                left: 'right'
            },
            tooltip: {},
            legend: [{
                data: categories.map(function (a) {
                    return a.name;
                })
            }],
            animation: false,
            series : [
                {
                    name: '网络关系图',
                    type: 'graph',
                    layout: 'force',
                    data: [{name:'S'}, {name: 'Q'}],
                    links: [{source: 'S', target: 'Q'}],
                    categories: categories,
                    roam: true,
                    label: {
                        normal: {
                            position: 'right'
                        }
                    },
                    force: {
                        repulsion: 100
                    }
                }
            ]
        };
        myChart.setOption(option);
        $("#b-content")[0].hidden = false;
        $("#t-content")[0].hidden = true;
    })
    $("#backupResult").click(function(){
        chtml=$("#b-content")[0];
        chtml.innerHTML = '<div class="row">'
                +'<div class="col-md-6">'
                +'<div id="main" style="width: 400px;height:300px;"></div>'
                +'<div id="bmsg">'
                +'</div></div>'
                +'<div class="col-md-6">'
                +'<div id="msg"></div></div>';
        var myChart = echarts.init(document.getElementById('main'), 'light');
        option = {
            title : {
                text: '网络设备备份',
                subtext: '显示当天备份信息',
                x: "center",
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: [],
            },
            series : [
                {
                    name: '备份结果',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    data: [],
                    label: {
                        formatter: '{b|{b}：}{c}',
                        rich: {
                            b: {
                                fontSize: 16,
                                lineHeight: 33
                            },
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
        $.get("/myhosts/netajax?opt=backinfo").done(function(data){
            cc='<ul class="list-group">';
            $(data.content).each(function(a, b){
                cc+='<li class="list-group-item">'+ b +'</li>'
            });
            msg=$("#msg")[0];
            document.getElementById("bmsg").innerText = data.msg;
            msg.innerHTML+=cc+"</ul>"
            myChart.setOption({
                legend: {data:data.legend},
                series: [{
                    data: data.data
                }]
            });
        }, "json");
        $("#b-content")[0].hidden = false;
        $("#t-content")[0].hidden = true;
    })
    $("#network").click(function(){ //网络设备累不
        $.ajax({
            url: "/myhosts/netajax?opt=networkList",
            success: function(msg){
                var tc = "<tr style='color:#005aff;background: #fffff9;text-align: center;'><td>设备名称</td><td style='width:150px'>IP</td><td style='width:80px'>执行</td><td style='width:80px'>程序</td><td>修改</td></tr>";
                $.each(msg["ret"],function(k,v){
                    tc += "<tr><td>" + v["hostname"] + "</td><td>" + v["ip"] + "</td><td><button type='button' class='btn btn-link btn-xs optbackup' name='" +v["ip"]+"'>备份</button></td><td>"+v["backFunc"]+"</td><td><button type='button' class='btn btn-primary btn-xs NetChange' value='"+v["id"]+"'>修改</button></td></tr>";
                    $("#t-content")[0].innerHTML = tc;
                    $("#t-content")[0].hidden = false;
                })
                $("#b-content")[0].hidden = true;
            }
        })
    })
    $("#backup").click(function(){  //  网络设备备份列表
        $("#waiting")[0].hidden=false;
        $.ajax({
            type: "POST",
            url: "/myhosts/netajax",
            dataType: "json",
            data: "opt=backupList",
            success: function(msg){
                var tc = "<tr style='color:#005aff;background: #fffff9;'><td>设备名称</td><td>IP</td><td>内容</td><td>备份时间</td><td>差异</td></tr>";
                $.each(msg["ret"],function(k,v){
                    //tc += "<tr><td>" + v["hostname"] + "</td><td>" + v["ip"] + "</td><td><pre>" + v["config"]+ "</pre></td><td>" + v["btime"] + "</td></tr>";
                    tc += "<tr><td>" + v["hostname"] + "</td><td>" + v["ip"] + "</td><td><button type='button' class='btn btn-link btn-xs configure' name='"+v["pid"]+"'> 显示内容 </button> </td><td>" + v["btime"] + "</td><td><button type='button' class='btn btn-link btn-xs cdiff' name='"+v["pid"]+"'>差异显示</button></td></tr>";
                    $("#t-content")[0].innerHTML = tc;
                    $("#t-content")[0].hidden = false;
                })
                $("#b-content")[0].hidden = true;
                $("#waiting")[0].hidden=true;
            }
        })
    })
    $("#search").click(function(){
        shtml='<h4 style="color: blue; text-align: center;">Welcome</h4>'
            + '<form class="form-inline"><select class="form-control" id="device-s" style="">'
        ehtml = '<input type="text" class="form-control" placeholder="日期格式2008-08-08" style="height:35px;" id="btime"><button type="button" class="btn btn-default" id="optsearch">搜索</button></form>'
        $("#t-content")[0].hidden = true;
        $.ajax({
            url: "/myhosts/netajax?opt=networkList",
            success: function(msg){
                tc = "<option value=''>选择一个设备</option>"
                $.each(msg["ret"],function(k,v){
                    tc += "<option value='"+v["ip"]+"'>" + v["hostname"] + " : " + v["ip"] + "</option>"
                })
                $("#b-content")[0].innerHTML = shtml+tc+ehtml
                $("#b-content")[0].hidden = false;
            }
        })
    })
    $(document).on("click", "#optsearch", function(data){
        device = $("select option:selected").val();
        btime = $("#btime").val();
        if(device===""){
            if(btime===""){
                alert("至少选择一个项目");
                return;
            }
        }
        $.ajax({
            type: "POST",
            url: "/myhosts/netajax",
            dataType: "json",
            data: "opt=search&ip="+device+"&btime="+btime,
            success: function(msg){
                if(msg["ret"].length==0){
                    $("#t-content")[0].innerHTML = '<div class="alert alert-warning" role="alert">未搜索到记录</div>'
                    $("#t-content")[0].hidden = false;
                    return;
                }
                tc = "";
                $.each(msg["ret"],function(k,v){
                    tc += "<tr><td>" + v["hostname"] + "</td><td>" + v["ip"] + "</td><td><button type='button' class='btn btn-link btn-xs configure' name='"+v["pid"]+"'> 显示内容 </button> </td><td>" + v["btime"] + "</td><td><button type='button' class='btn btn-link btn-xs cdiff' name='"+v["pid"]+"'>差异显示</button></td></tr>";
                })
                $("#t-content")[0].innerHTML = tc;
                $("#t-content")[0].hidden = false;
            }
        })
    })
    $(document).on("click", ".optbackup", function(data){
        //$("#m-content")[0].innerHTML = "<pre style='white-space: pre-wrap;word-wrap: break-word;text-align: center;'>正在备份，请勿操作</pre>";
        $("#m-content")[0].style="text-align: center";
        $("#m-content")[0].innerHTML = '<h4>正在备份，请勿操作</h4><div class="spinner spinnerTwo"><span></span></div>'
        $("#m-footer")[0].hidden=true;
        $("#myModal").modal("show");
        ipadd = this.name;
        $.ajax({
            type: "POST",
            url: "/myhosts/netajax",
            dataType: "json",
            data: "opt=backup&ipadd="+ipadd,
            success: function(msg){
            $("#m-content")[0].innerHTML = "<pre style='white-space: pre-wrap;word-wrap: break-word;text-align: center;'>" + msg["content"] + "</pre>";
            }
        })
    })
    $(document).on("click", ".configure", function(data){ //内儿女
        jid = this.name;
        tr = $("td", this.parentElement.parentElement);
        fn = tr[0].innerText+"_"+tr[3].innerText+".txt";
        console.log(fn);
        $.ajax({
            url: "/myhosts/netajax?opt=configure&jid="+jid,
            dataType: "json",
            success: function(msg){
                $("#m-content")[0].innerHTML = "<textarea class='form-control' style='height:500px' readonly>" + msg["ret"] + "</textarea>";
                $("#m-footer")[0].innerHTML='<button type="button" class="btn btn-primary downOneConf">下载</button>'
                $("#m-footer")[0].hidden=false;
                $("#myModal").modal("show");
            }
        })
    })
    $(document).on('click', ".downOneConf", function(data){
        ccp = document.getElementById("m-content").children[0].value;
        var eleLink = document.createElement('a');
        eleLink.download = fn;
        eleLink.style.display = 'none';
        var blob = new Blob([ccp.replace(/\n/g, "\r\n")]);
        eleLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    })
    $(document).on("click", "#append2", function(data){
        deviceName=$("#device")[0].value;
        ipadd=$("#ipadd")[0].value;
        cmd=$("#cmd")[0].value;
        buser=$("#buser")[0].value;
        bpass=$("#bpass")[0].value;
        ver=$("#back_func")[0].value;
        msg="";
        if(deviceName.length===0){msg+="请输入设备名；";}
        if(ipadd.length===0){msg+="请输入IP；";}
        if(cmd.length===0){msg+="请输入CMD；";}
        if(buser.length===0){msg+="请输入User；";}
        if(bpass.length===0){msg+="请输入PassWd；";}
        console.log($("#back_func")[0].value)
        if(msg==""){
            $.ajax({
                type: "POST",
                url: "/myhosts/netajax",
                dataType: "json",
                data: "opt=appendNetwork&deviceName="+deviceName+"&ip="+ipadd+"&buser="+buser+"&bpass="+bpass+"&cmd="+cmd+"&ver="+ver,
                success: function(data){
                    alert(data["msg"]);
                    $("#device")[0].value="";
                    $("#ipadd")[0].value="";
                    $("#buser")[0].value="";
                    $("#bpass")[0].value="";
                    console.log(data);
                }
            })
        }else{
            alert(msg);
        }
    })
    $(document).on('click', '.cdiff', function(){
        $.ajax({
            type: "GET",
            url: "/myhosts/netajax",
            dataType: "json",
            data: "opt=getdiff&cid="+$(this)[0].name,
            success: function(data){
                if(data.msg==="n"){
                    m = '<h3> 无差异</h3>'
                    $("#m-content")[0].style="text-align:center";
                }else{
                    m = "";
                    $(data.content).each(function(a,b){
                        m += '<li class="list-group-item">'+b+'</li>';
                    })
                }
                $("#m-content")[0].innerHTML=m;
                $("#m-footer")[0].hidden=true;
                $("#myModal").modal("show");
            }
        })
    })
    $(document).on('click', ".NetChange", function(){
        tr=$(this)[0].parentElement.parentElement;
        tds=$("td", tr);
        dv = $(this)[0].value;
        document.getElementById("appendDevice").click();
        document.getElementById("device").value=tds[0].innerText;
        document.getElementById("ipadd").value=tds[1].innerText;
        document.getElementById("back_func").value=tds[3].innerText;
        document.getElementById("append2").value=dv;
        document.getElementById("append2").innerText="修改";
        document.getElementById("append2").className="btn btn-danger";
        document.getElementById("append2").id="OptChange";
        s=document.getElementsByTagName("form")[0];
        c = document.createElement("div");
        c.innerHTML = '<a class="alert-link">不修改参数可留空，用户和认证必须成对出现！！！</a>';
        c.className="alert alert-warning";
        s.before(c);
    })
    $(document).on('click', "#OptChange", function(){
        deviceName=$("#device")[0].value;
        ipadd=$("#ipadd")[0].value;
        cmd=$("#cmd")[0].value;
        buser=$("#buser")[0].value;
        bpass=$("#bpass")[0].value;
        ver=$("#back_func")[0].value;
        content="opt=NetChange&dv="+document.getElementById("OptChange").value;
        console.info(buser, bpass)
        if(buser!==""&&bpass!==""){content+="&buser="+buser+"&bpass="+bpass}
        else if(buser===""&&bpass===""){}
        else{alert("认证信息错误"); return}
        if(deviceName!==""){content+="&deviceName="+deviceName}
        if(ipadd!==""){content+="&ip="+ipadd}
        if(cmd!==""){content+="&cmd="+cmd}
        console.info(content)
        $.ajax({
            type: "POST",
            url: "/myhosts/netajax",
            dataType: "json",
            data: content+"&ver="+ver,
            success: function(data){
                console.info(data);
                if(data.msg==="ok"){
                    alert("修改成功");
                }else{alert("修改失败")};
            }
        })
    })
