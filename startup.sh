#!/bin/bash

# Inicia o servidor Ollama em segundo plano
ollama serve &

# Aguarda o servidor subir
sleep 5

# Faz o pull dos modelos leves
ollama pull smol:135m

# Aguarda o processo do servidor
wait
