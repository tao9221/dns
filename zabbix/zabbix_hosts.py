import os
import sys
import django
import time

path=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,path)
os.environ.update(DJANGO_SETTINGS_MODULE='cms.settings')
django.setup()

from zabbix import Zabbix
from zabbix.models import Hosts

def update_hosts():
    zb = Zabbix()
    data = zb.get_hosts()
    for k,v in data.items():
        try:
            host_name = Hosts.objects.get(hostname=k)
            host_name.mstate = v["status"]
            host_name.ip = v["ip"]
            host_name.last_time = int(time.time())
            host_name.save()
        except:
            print(k,v["ip"],v["status"])
            host_name = Hosts.objects.create(hostname=k,ip=v["ip"])
            host_name.mstate = v["status"]
            host_name.last_time = int(time.time())
            host_name.save()
    return data

if __name__ == "__main__":
    update_hosts()



