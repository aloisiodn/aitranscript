# Generated by Django 4.1 on 2023-12-25 15:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aitranscript', '0002_alter_inputfile_summary_alter_inputfile_transcript'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='pasword',
            field=models.CharField(default='teste', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='inputfile',
            name='summary',
            field=models.TextField(default='Indisponível'),
        ),
        migrations.AlterField(
            model_name='inputfile',
            name='transcript',
            field=models.TextField(default='Indispnível'),
        ),
    ]
