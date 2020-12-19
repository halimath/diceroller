FROM nginx:alpine

COPY public/index.html /usr/share/nginx/html/
COPY public/*.js /usr/share/nginx/html/
COPY public/manifest.json /usr/share/nginx/html/
COPY public/img/*.png /usr/share/nginx/html/img/
COPY dist/*.js /usr/share/nginx/html
