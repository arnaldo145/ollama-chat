FROM ollama/ollama

ENV OLLAMA_ORIGINS=*
ENV OLLAMA_HOST=0.0.0.0

COPY startup.sh /startup.sh
RUN chmod +x /startup.sh

EXPOSE 11434

CMD ["/startup.sh"]
