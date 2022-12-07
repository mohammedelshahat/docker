FROM openjdk:11.0.5-slim-buster

RUN apt-get update

RUN apt-get install wget procps -y

WORKDIR /tmp

RUN wget http://dlcdn.apache.org/directory/apacheds/dist/2.0.0.AM26/apacheds-2.0.0.AM26-amd64.deb

RUN dpkg -i apacheds-2.0.0.AM26-amd64.deb

RUN apt-get -f install

RUN mv /etc/init.d/apacheds-2.0.0.AM26-default /etc/init.d/apacheds

RUN /etc/init.d/apacheds start &

EXPOSE 10389 10636
