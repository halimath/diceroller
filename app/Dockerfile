FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
COPY pkg/*.js /usr/share/nginx/html/pkg/
COPY pkg/*.wasm /usr/share/nginx/html/pkg/

RUN echo -e "types {\napplication/wasm wasm;\n}\n" > /etc/nginx/conf.d/wasm.conf
