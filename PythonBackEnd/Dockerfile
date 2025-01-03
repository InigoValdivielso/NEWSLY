# Imagen base de Python
FROM python:3.11-slim

# Configuración del entorno
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Crear directorio de trabajo
WORKDIR /app

# Copiar requirements.txt y los archivos del proyecto
COPY Requirements.txt ./
COPY . /app/

# Instalar dependencias
RUN pip install --no-cache-dir -r Requirements.txt

# Exponer el puerto 
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
