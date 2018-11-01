from django.contrib import admin

from zabbix.models import Hosts,Domains,DomainLogs

@admin.register(Hosts)
class HostsAdmin(admin.ModelAdmin):
    list_display = ["hostname", "ip", "mstate", "last_time"]

@admin.register(Domains)
class DomainsAdmin(admin.ModelAdmin):
    list_display = ["domain", "domainId", "domainKey", "user", "last_time"]

@admin.register(DomainLogs)
class DomainLogsAdmin(admin.ModelAdmin):
    list_display = ["domain_cmds", "user", "last_time"]