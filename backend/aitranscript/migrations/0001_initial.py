# Generated by Django 4.1 on 2023-12-21 06:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SystemPrompt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('prompt_type', models.CharField(choices=[('TR', 'Transcrição'), ('RE', 'Resumo'), ('CH', 'Chat')], max_length=2)),
                ('prompt', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('login', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=150)),
                ('is_admin', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='UserPrompt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('prompt_type', models.CharField(choices=[('TR', 'Transcrição'), ('RE', 'Resumo'), ('CH', 'Chat')], max_length=2)),
                ('prompt', models.TextField()),
                ('is_public', models.BooleanField(default=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prompts', to='aitranscript.user')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='InputFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('description', models.TextField()),
                ('file_name', models.CharField(max_length=150)),
                ('status', models.CharField(choices=[('UP', 'Uploaded'), ('TR', 'Transcrito'), ('RE', 'Resumido'), ('FT', 'Falha na transcrição'), ('FR', 'Falha no resumo')], default='UP', max_length=2)),
                ('transcript', models.TextField()),
                ('summary', models.TextField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='files', to='aitranscript.user')),
            ],
        ),
    ]
