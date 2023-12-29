from rest_framework import viewsets

from .models import InputFile, UserPrompt, User, SystemPrompt
from .serializers import *

UPLOAD_PATH = '/data/webfiles/aitranscript/upload'

class InputFileViewSet(viewsets.ModelViewSet):
    queryset = InputFile.objects.all()
    serializer_class = InputFileSerializer
    print("InputFileViewSet")
 

class UserPromptViewSet(viewsets.ModelViewSet):
    queryset = UserPrompt.objects.all()
    serializer_class = UserPromptSerializer

class SystemPromptViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SystemPrompt.objects.all()
    serializer_class = SystemPromptSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer    
    lookup_field = 'login'
    print("UserViewSet")

# File upload view

from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from .serializers import UploadSerializer

# ViewSets define the view behavior.
class UploadViewSet(ViewSet):
    serializer_class = UploadSerializer

    def list(self, request):
        return Response("GET API")


    def create(self, request):

        from os import path    

        file_uploaded = request.FILES.get('file_uploaded')
        file_content = file_uploaded.read()
        print(file_uploaded.name)
        with open(path.join(UPLOAD_PATH,file_uploaded.name),'wb') as f:
            f.write(file_content)

        content_type = file_uploaded.content_type
        response = "POST API and you have uploaded a {} file".format(content_type)
        return Response(response)

class TranscriptViewSet(viewsets.ModelViewSet):

    serializer_class = TranscriptSerializer
    queryset = InputFile.objects.filter(status='UP').order_by('upload_dt')

    # inputFiles = InputFile.objects.filter(status='UP').order_by('upload_dt')

    def list(self, request):
        import os
        from django.forms.models import model_to_dict
        from django.core import serializers

        print(len(self.queryset))


        if len(self.queryset)==0:
            #not found
            return Response(data="Sem arquivos para processar", status=404)

        for inputFile in self.queryset:

            file_name =  "F{}_{}".format(inputFile.file_key, inputFile.file_name)
            file_path = os.path.join(UPLOAD_PATH,file_name)
            lock_path = os.path.join(UPLOAD_PATH,file_name+".lock")
            print(file_path)

            # Verifica se o arquivo existe  
            try:
                with open(file_path, mode='rb') as f:
                    file_content = f.read()
                    print("Arquivo existe")
            except Exception as ex:
                return Response(data="Erro inesperado: {}".format(ex), status=412)

            # tenta fazer o lock  
            try:
                with open(lock_path, mode='x') as f:
                    f.write("Lock para o arquivo {}".format(file_path))

            except FileExistsError as ex:
                print("Lock not ok", ex)
                continue

            try:
                print("Lock ok")

                serializer = self.get_serializer(inputFile, many=False) 
                return Response(data = serializer.data)

            except Exception as ex:
                print("Error on serialization: ", ex)
                return Response(data="Erro inesperado: {}".format(ex), status=412)
                     
        return Response( "Nada a fazer" ,status=404) 


