from django.db import models

# Create your models here.
class Hosts(models.Model):
    hostname = models.CharField(max_length=50)
    ip       = models.GenericIPAddressField(max_length=15, unique=False)
    mstate   = models.CharField(max_length=10, blank=True)
    last_time= models.CharField(max_length=12, blank=True)
    def __str__(self):
        return self.ip

class Domains(models.Model):
    domain     = models.CharField(max_length=40, blank=False)
    domainId   = models.CharField(max_length=36, blank=False)
    domainKey  = models.CharField(max_length=32, blank=False)
    user       = models.CharField(max_length=20, default="none")
    last_time  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.domain

class DomainLogs(models.Model):
    domain_cmds = models.CharField(max_length=100, blank=True)
    user        = models.CharField(max_length=20, default="none")
    last_time   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.domain_cmds