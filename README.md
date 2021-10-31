
-------------------
inluxdb:
v1.8.3:
docker run --name influxdb -d -p 8086:8086 \
      -e INFLUXDB_DB=db0 \
      -e INFLUXDB_ADMIN_USER=admin -e INFLUXDB_ADMIN_PASSWORD=supersecretpassword \
      -e INFLUXDB_USER=telegraf -e INFLUXDB_USER_PASSWORD=secretpassword \
      -v ${PWD}/influxdb_data:/var/lib/influxdb -v ${PWD}/influxdb.conf:/etc/influxdb/influxdb.conf influxdb:1.8.3 --config /etc/influxdb/influxdb.conf
cli:
docker exec -it influxdb influx
create database db0

to view data:
f:\Hezi\Online_Selling\development\Influxdb\
https://github.com/JorgeMaker/InfluxDBWorkBench


--------------------

1) node scripts/check_faulty.js --repeat_every 5
2) run the test using jmeter
3) npm run dev  

--------------------

