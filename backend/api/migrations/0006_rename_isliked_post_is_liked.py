# Generated by Django 5.2.1 on 2025-05-28 18:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_post_isliked'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='isliked',
            new_name='is_liked',
        ),
    ]
