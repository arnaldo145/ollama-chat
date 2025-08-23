FROM ollama/ollama

ENV OLLAMA_ORIGINS=*
ENV OLLAMA_HOST=0.0.0.0

# Inicia o servidor Ollama em segundo plano, espera 5 segundos, faz o pull dos modelos e encerra o servidor
RUN ollama serve & \
    sleep 5 && \
    ollama pull smol:135m && \
    ollama pull tinyllama && \
    ollama pull phi && \
    pkill ollama

EXPOSE 11434

# Usa o entrypoint padrão da imagem base (ollama) e passa "serve" como comando
CMD ["serve"]
