# Visualize bruteforce SSH attacker's location in real time

![Build, test and deploy](https://github.com/acouvreur/ssh-log-to-influx/workflows/Build,%20test%20and%20deploy/badge.svg)

Thanks to Schkn for its original post https://devconnected.com/geolocating-ssh-hackers-in-real-time/

## Preview

![Dashboard](./dashboard.png)

## Prerequisites

- An InfluxDB instance (or use docker-compose.standalone.yml)
- A Grafana instance (or use docker-compose.standalone.yml)
- Docker
- Rsyslog

## Rsyslog configuration

Add this under `/etc/rsyslog.conf` to forward ssh auth failures to local server :

```
template(name="OnlyMsg" type="string" string="%msg:::drop-last-lf%\n")
if $programname == 'sshd' then {
   if $msg startswith ' Failed' then {
      action(type="omfwd" target="127.0.0.1" port="7070" protocol="tcp" template="OnlyMsg") 
   }
}
```

## Start the TCP server

Change environment variables inside `docker-compose.yml`

`docker-compose build`

`docker-compose up -d`
