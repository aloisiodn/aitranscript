from rest_framework import viewsets
from django.http import FileResponse
from .models import InputFile, UserPrompt, User, SystemPrompt
from .serializers import *
import os
from django.forms.models import model_to_dict
from django.core import serializers
import magic
from rest_framework.decorators import action
import shutil
import random
from datetime import datetime
from django.utils.timezone import make_aware



UPLOAD_PATH = '/data/webfiles/aitranscript/upload'
TRANSC_PATH = '/data/webfiles/aitranscript/transcripting'

PATH_BY_STATUS = {'UP': UPLOAD_PATH,
                  'PR': TRANSC_PATH}



def get_file_paths(inputFile):
    file_name =  "F{}_{}".format(inputFile.file_key, inputFile.file_name)
    file_path = os.path.join(UPLOAD_PATH,file_name)
    transc_path = os.path.join(TRANSC_PATH,file_name)
    lock_path = os.path.join(UPLOAD_PATH,file_name+".lock")
    return file_name, file_path, transc_path, lock_path

def verify_request(request, pk):

    lock_key = request.query_params.get('lock_key')
    lock_key = None if lock_key is None else int(lock_key) 

    print("retrieve transcript", pk, "lock_key", lock_key)

    inputFiles = InputFile.objects.filter(id=pk)
    
    if len(inputFiles)==0:
        return None, "invalid id!"

    inputFile = inputFiles[0]

    if (lock_key is None):
        return None, "lock_key not provided!"


    if not(lock_key == inputFile.lock_key):
        return None, "Invalid lock_key! {} != {}".format(lock_key, inputFile.lock_key)

    _, _, _, lock_path =   get_file_paths(inputFile)      

    if not os.path.exists(lock_path):
        return None, "Lock file not found"

    return inputFile, "OK!"



class InputFileViewSet(viewsets.ModelViewSet):
    queryset = InputFile.objects.all()
    serializer_class = InputFileSerializer
    print("InputFileViewSet")

    @action(detail=True, methods=['put','get'])       
    def download(self, request, pk):

        print("download", pk)

        inputFiles = InputFile.objects.filter(id=pk)
    
        if len(inputFiles)==0:
            return Response("Id not found", 404)

        inputFile = inputFiles[0]

        file_name =  "F{}_{}".format(inputFile.file_key, inputFile.file_name)
        file_path = os.path.join(PATH_BY_STATUS[inputFile.status],file_name)

        mimeType = magic.Magic(mime=True).from_file(file_path)

        print(file_path, mimeType)
        
        with open(file_path, 'rb') as f:

            return FileResponse(open(file_path, 'rb'),content_type=mimeType,status=200)

    @action(detail=False, methods=['put','get'])       
    def lock(self, request):

        queryset = InputFile.objects.filter(status='UP').order_by('upload_dt')

        print("LOCK   len" , len(queryset))


        if len(queryset)==0:
            #not found
            return Response(data="Sem arquivos para processar", status=404)

        for inputFile in queryset:

            file_name, file_path, transc_path, lock_path = get_file_paths(inputFile=inputFile)
 
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

                inputFile.lock_key = random.randint(0, 99999999)
                inputFile.save()

                serializer = self.get_serializer(inputFile, many=False) 

                return Response(data = serializer.data)

            except Exception as ex:
                print("Error on serialization: ", ex)
                return Response(data="Erro inesperado: {}".format(ex), status=412)

       
        return Response( "Nada a fazer" ,status=404) 

    @action(detail=True, methods=['put','get'])       
    def pull(self, request, pk):
        
        print("pull transcript", pk)

        inputFile, msg = verify_request(request, pk)

        if inputFile is None:
           return Response(msg, 404)

        file_name, file_path, transc_path, lock_path = get_file_paths(inputFile=inputFile)

        mimeType = magic.Magic(mime=True).from_file(file_path)

        print(file_path, mimeType)
        
        with open(file_path, 'rb') as f:

            return FileResponse(open(file_path, 'rb'),content_type=mimeType,status=200)


    @action(detail=True, methods=['put','get'])       
    def unlock(self, request, pk):

        print("unlock transcript", pk)

        inputFile, msg = verify_request(request, pk)

        if inputFile is None:
           return Response(msg, 404)

        file_name, file_path, transc_path, lock_path = get_file_paths(inputFile=inputFile)

        inputFile.lock_key = None
        inputFile.status = 'PR'
        inputFile.start_processing_dt = make_aware(datetime.now())
        inputFile.save()

        os.rename(file_path, transc_path)
        os.remove(lock_path)

        return Response("UNLOCK OK {}".format(inputFile.start_processing_dt.strftime("%d/%m/%Y, %H:%M:%S")), 200)

    @action(detail=True, methods=['put','get'])       
    def transcript(self, request, pk):

        print("transcript registration", pk)

        inputFiles = InputFile.objects.filter(id=pk)
    
        if len(inputFiles)==0:
            return Response("transcript registration Id {} not found".format(pk), 404)

        inputFile = inputFiles[0]

        inputFile.transcript = request.query_params.get('transcript')
        inputFile.transcript_dt = make_aware(datetime.now())
        inputFile.status = 'TR'
        inputFile.save()

        return Response("TRANSCRIPT OK {}".format(inputFile.transcript_dt.strftime("%d/%m/%Y, %H:%M:%S")), 200)




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

            

