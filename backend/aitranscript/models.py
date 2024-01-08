from django.db import models

# Create your models here.

class User(models.Model):
    login = models.CharField(max_length=50)
    name = models.CharField(max_length=150)
    is_admin = models.BooleanField(default=False)
    password = models.CharField(max_length=50)

    def __str__(self):
        return "{}: {}{} {}".format(self.login, self.name, '(admin)' if self.is_admin else '', self.password)

class Prompt(models.Model):
    PROMPT_TYPES = [
        ("TR", "Transcrição"),
        ("RE", "Resumo"),
        ("CH", "Chat")
    ]
    name = models.CharField(max_length=150)
    prompt_type = models.CharField(max_length=2, choices=PROMPT_TYPES)
    prompt = models.TextField()

    class Meta:
        abstract = True


class UserPrompt(Prompt):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prompts')
    is_public = models.BooleanField(default=True)

    def __str__(self):
        return "{}({}): {}".format(self.name, self.prompt_type, self.user.login)
    
class SystemPrompt(Prompt):
    def __str__(self):
        return "{}({})".format(self.name, self._prompt_type)


class InputFile(models.Model):
    FILE_STATUS = [
        ("UP", "Uploaded"),
        ("PR", "Em processamento"),
        ("TR", "Transcrito"),
        ("RE", "Resumido"),
        ("FT", "Falha na transcrição"),
        ("FR", "Falha no resumo")
    ]
    name = models.CharField(max_length=150)
    description = models.TextField()
    file_name = models.CharField(max_length=150)
    file_key = models.CharField(max_length=8)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    status = models.CharField(max_length=2, choices=FILE_STATUS, default='UP')
    upload_dt = models.DateTimeField(null=True, blank=True)
    start_processing_dt = models.DateTimeField(null=True, blank=True)
    transcript_dt = models.DateTimeField(null=True, blank=True)
    summary_dt = models.DateTimeField(null=True, blank=True)
    transcript = models.TextField(default='Indispnível')
    summary = models.TextField(default='Indisponível')
    lock_key = models.IntegerField(null=True, blank=True)

    def save(self, *args, **kwargs):
        
        self.clean_fields()
        self.validate_constraints()
        super(InputFile,self).save(*args, **kwargs)

    def create(self, *args, **kwargs):
        self.upload_dt = datetime.now()
        super(InputFile,self).create(*args, **kwargs)

    def __str__(self):
        return "{}({}): {}[{}]".format(self.name, self.file_name, self.user.login, self.status)
