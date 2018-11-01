from django.urls import path
from . import views

urlpatterns = [
        path('updates_zb_hosts',views.updates_zb_hosts),
        path('dif_hosts',views.my_vs_zb,name="dif_hosts"),
        path('record',views.record,name="record"),
        path('domain',views.add_domains,name="domain"),
        path('getCmdsAllData',views.getCmdsAllData)
        ]