
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


grafana:
docker run -d -p 3000:3000 --name grafana grafana/grafana:7.3.6 


## subtree
setup:
```
git subtree split -P dummy/app -b dummy_split
git push git@github.com:hershkoy:sensorData-dummy.git dummy_split:main --force
git rm -r dummy/app
git commit -m "remove the subtree folder"
git subtree add --prefix=dummy/app sensorData-dummy main
git push
```

usage:
```
git subtree split --prefix=dummy/app -b updates
git push sensorData-dummy updates:updates
git push sensorData-dummy HEAD:main   OR   pr and merge is github
```

## submodule
setup:
```
git subtree split -P whatever/mymodule -b new_branch_for_submodule
(create new empty repo in github )
git push git@github.com:hershkoy:sensorData_module.git new_branch_for_submodule:main --force
git rm -r whatever/mymodule
git commit -m "remove the submodule folder"
git submodule add git@github.com:hershkoy:sensorData_module.git whatever/mymodule
git commit -m "add new repository as a submodule"
git push origin main
``` 

usage:
done using VSCODE

