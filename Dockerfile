FROM ollama/ollama

ENV OLLAMA_ORIGINS=*
ENV OLLAMA_HOST=0.0.0.0

RUN ollama pull tinyllama

EXPOSE 11434