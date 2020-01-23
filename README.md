# Visualize bruteforce SSH attacker's location in real time

## Prerequisites

- An InfluxDB instance
- A Grafana instance
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

Change environement variables inside `docker-compose.yml`

`docker-compose build`

`docker-compose up -d`
