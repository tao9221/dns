import django
import os

os.environ.update(DJANGO_SETTINGS_MODULE='cms.settings')
django.setup()
from decorators.login import login_required
from decorators.event import recordEvent
from decorators.permission import checkPermission
from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from myhosts.models import Hosts as my_hosts
from zabbix.models import Hosts as zb_hosts
from zabbix.models import Domains,DomainLogs
from zabbix import DomainAdd
from zabbix import zabbix_hosts

@login_required
@checkPermission
def my_vs_zb(request):
    username=request.session.get('username')
    disable_ip = [dip.ip for dip in zb_hosts.objects.filter(mstate='1')]
    my_hosts_list = [myip.ip for myip in my_hosts.objects.all()]
    zb_hosts_list = [zbip.ip for zbip in zb_hosts.objects.all()]
    dif_data = list(set(my_hosts_list).difference(set(zb_hosts_list)))
    dif_data.extend(disable_ip)
    dif_data.sort()
    if len(dif_data) == 0:
        dif_data = ["没有发现未监控主机"]
    return render(request, "dnsShow.html", {"ip_list": dif_data,"stats":3,"username": username})

@login_required
@checkPermission
def updates_zb_hosts(request):
    if request.method == "POST":
        updates_ip_list = zabbix_hosts.update_hosts()
    return JsonResponse(updates_ip_list)

@login_required
@checkPermission
def add_domains(request):
    username=request.session.get('username')
    if request.method == "GET":
        domains = Domains.objects.all()
        domain_all = [d.domain for d in domains]
        return render(request,"dnsShow.html",{"domains":domain_all,"stats":1, "username": username})
    elif request.method == "POST":
        domain = request.POST.get("domain","no")
        datas = request.POST.get("dnslist","nolist")
        dnslist = datas.split('\n')
        dsql = Domains.objects.get(domain=domain)
        ids = dsql.domainId
        keys = dsql.domainKey
        user = request.session.get('username')
        if isinstance(dnslist,list):
            runs = DomainAdd(domain,dnslist,keys,ids,user)
            r = runs.go()
        for cmd in r:
           DomainLogs.objects.create(domain_cmds=cmd,user=user)
        return JsonResponse({'result':r})

@login_required
@checkPermission
def record(request):
    username=request.session.get('username')
    page = request.GET.get("page",1)
    record_data = DomainLogs.objects.all()
    total_number = record_data.count()
    pages = total_number/20
    if isinstance(pages,float):
        page_number = [num for num in range(1,int(pages)+2)]
    else:
        page_number = [num for num in range(1,int(pages)+1)]
    page_number_last = page_number[-1]
    if int(page)+1 >= page_number_last:
        next_page = page_number_last
    else:
        next_page = int(page)+1
    start=(int(page)-1)*20
    end= int(page)*20
    data = record_data[start:end]
    return render(request,"dnsShow.html",{"total_number":total_number,"page":int(page),"page_number":page_number,"next_page":next_page,"page_number_last":page_number_last,"data":data,"stats":2,"username": username})

@login_required
@checkPermission
def getCmdsAllData(request):
    if request.method == "GET":
        search = request.GET.get('term')
        record_data = [ cmds.domain_cmds for cmds in DomainLogs.objects.all().filter(domain_cmds__contains=search)]
        return JsonResponse({'record_data':record_data})
    elif request.method == "POST":
        record_data ={}
        search = request.POST.get('term')
        for cmds in DomainLogs.objects.all().filter(domain_cmds__contains=search):
            record_data[cmds.id] = [cmds.domain_cmds, cmds.user, cmds.last_time]
        # record_data = [ record_data[cmds.id]=[cmds.domain_cmds, cmds.user, cmds.last_time] for cmds in DomainLogs.objects.all().filter(domain_cmds__contains=search)]
        return JsonResponse(record_data)


