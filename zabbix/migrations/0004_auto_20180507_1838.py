# Generated by Django 2.0.4 on 2018-05-07 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('zabbix', '0003_hosts_last_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hosts',
            name='ip',
            field=models.GenericIPAddressField(),
        ),
    ]
