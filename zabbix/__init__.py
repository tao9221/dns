import time
import urllib
import base64
import hashlib
import hmac
import requests
import random
import json
import os
import sys
from zabbix_api import ZabbixAPI

path=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,path)
from cms import settings

class Zabbix:
    def __init__(self):
        self.zapi = ZabbixAPI(server=settings.ZABBIX_URL)
        self.zapi.login(settings.ZABBIX_USER,settings.ZABBIX_PASS)

    def get_hosts(self):
        ip_contain = ['172.21.12', '172.31.33', '10.100.75']
        ip_data = self.zapi.host.get({"output": ["host","status"], "selectInterfaces": ["ip"]})
        data = {}
        for ips in ip_data:
            if ".".join(ips['interfaces'][0]['ip'].split(".")[0:3]) in ip_contain:
                data[ips['host']] = {"ip":ips['interfaces'][0]['ip'],"status":ips['status']}
        return data

class DomainAdd:
    def __init__(self,domain,datas,SecretKey,SecretId,user):
        self.domain = domain
        self.datas = datas
        self.SecretKey = SecretKey
        self.SecretId = SecretId
        self.user = user

    def get_signa(self,url,data):
        sorted(data)
        src_str = "GET{}{}".format(url, '&'.join(k + "=" + str(data[k]) for k in sorted(data.keys())))
        sign = base64.encodestring(hmac.new(bytes(self.SecretKey,encoding="utf-8"), src_str.encode("utf-8"), digestmod=hashlib.sha256).digest()).strip()
        #sign = base64.encodestring(hmac.new(b'rZ8vb5PXTBmBNOTSGuMh1NaeYGxSltvp', src_str.encode("utf-8"),digestmod=hashlib.sha256).digest()).strip()
        return sign

    def go(self):
        data = {}
        url = "cns.api.qcloud.com/v2/index.php?"
        data["Action"] = "RecordCreate"
        data["SecretId"] = self.SecretId
        data["SignatureMethod"] = "HmacSHA256"
        data["domain"] = self.domain
        data["recordLine"] = "默认"
        results = []
        urls = "https://{}".format(url.replace('?', ''))
        for line in self.datas:
            if not line.startswith("#"):
                list_content = line.split('|')
            else:
                continue
            if len(list_content) == 3:
                data["Timestamp"] = int(time.time())
                data["Nonce"] = random.randint(10000, 90000)
                if self.domain in list_content[0].strip():
                    data["subDomain"] = list_content[0].strip().split('.')[0]
                else:
                    data["subDomain"] = list_content[0].strip()
                data["recordType"] = list_content[1].strip().upper()
                data["value"] = list_content[2].strip()
                sign = self.get_signa(url, data)
                time.sleep(1)
                data["Signature"] = sign
                datas = requests.get(urls, params=data)
                del data["Signature"]
                results.append("{}|{}".format(line,datas.json()["codeDesc"]))
        return results

