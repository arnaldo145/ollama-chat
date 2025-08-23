#!/bin/bash

# Inicia o servidor Ollama em segundo plano
ollama serve &

# Aguarda o servidor subir
sleep 5

# Faz o pull dos modelos leves
ollama pull smollm2:360m

# Aguarda o processo do servidor
wait
