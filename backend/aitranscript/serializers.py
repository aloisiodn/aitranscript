from rest_framework import serializers

from .models import User, UserPrompt, SystemPrompt, InputFile
from datetime import datetime

class UserSerializer(serializers.ModelSerializer):
    #prompts = UserPromptSerializer(many=True, read_only=True)
    #files = InputFileSerializer(many=True, read_only=True)
    print("UserSerializer")


    class Meta:
        model = User
        fields = ['id', 'login', 'name', 'is_admin', 'password']#, 'prompts', 'files']

class BasicUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'login', 'name']


class UserPromptSerializer(serializers.ModelSerializer):

    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = UserPrompt
        fields = ['name', 'prompt_type', 'prompt', 'user']

class SystemPromptSerializer(serializers.ModelSerializer):

    #user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = SystemPrompt
        fields = ['name', 'prompt_type', 'prompt']


class InputFileSerializer(serializers.ModelSerializer):

    user = BasicUserSerializer(many=False, read_only=False)
    status = serializers.CharField(source='get_status_display')

    print("InputFileSerializer user", user)
    print("InputFileSerializer status", status)

    class Meta:
        model = InputFile
        fields = ['id', 'name', 'description', 'file_name', 'user', 'status',  'transcript', 'summary',
                  'upload_dt', 'transcript_dt', 'summary_dt', 'file_key']

    def create(self, validated_data):
        from django.utils.timezone import make_aware
        user_data = validated_data.pop('user')
        status = validated_data.pop('get_status_display')
        # upload_dt = validated_data.pop('upload_dt')
        

        print("validated datA" , validated_data)
        print("user datA" , user_data)
  
        user = User.objects.get(login=user_data.pop('login'))
        print("user", user)
        inputFile = InputFile.objects.create(status=status, user=user, upload_dt=make_aware(datetime.now()), **validated_data)  

        return inputFile  

class CompleteUserSerializer(serializers.ModelSerializer):
    prompts = UserPromptSerializer(many=True, read_only=True)
    files = InputFileSerializer(many=True, read_only=True)

    print("CompleteUserSerializer prompts", prompts)
    print("CompleteUserSerializer files", files)

    class Meta:
        model = User
        fields = ['id', 'login', 'name', 'is_admin', 'prompts', 'files', 'password']


from rest_framework.serializers import Serializer, FileField

# Serializers define the API representation.
class UploadSerializer(Serializer):
    file_uploaded = FileField()
    class Meta:
        fields = ['file_uploaded']

class TranscriptSerializer(serializers.ModelSerializer):        

    class Meta:
        model = InputFile
        fields = ['id', 'name', 'file_name', 'status',  
                  'transcript', 'upload_dt', 'transcript_dt', 'summary_dt', 'file_key']
