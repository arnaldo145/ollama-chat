FROM ollama/ollama

ENV OLLAMA_ORIGINS=*
ENV OLLAMA_HOST=0.0.0.0

# Inicia o servidor Ollama em segundo plano, espera 5 segundos, faz o pull e encerra o servidor
RUN ollama serve & \
    sleep 5 && \
    ollama pull tinyllama && \
    pkill ollama

EXPOSE 11434

CMD ["ollama", "serve"]
