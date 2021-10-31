//persisting database connection between api calls

require("dotenv").config();

const Influx = require('influx');
let influx = null;

export default async function getConnection() {
    // Here is where we check if there is an active connection.
    if (influx!=null) return influx;
  
    try {
      // Here is where we create a new connection.
      influx = new Influx.InfluxDB({
        host: process.env.INFLUXDB_HOST,
        database: 'db0',
        schema: [
          {
            measurement: 'temprature',
            fields: {
              value: Influx.FieldType.FLOAT
            },
            tags: [
              'sensor_id',
              'face'
            ]
          }
        ]
       });
      console.log("Connected to database.");
      return influx;

    } catch (error) {
      console.log("DB error", error);
    }
};

export function influxGetAggregateReport(){
    return new Promise((resolve, reject) => {
      try {
        console.log(`in influxGetAggregateReport`);
        return resolve({});

        /*
        influx.queryRaw(`SELECT mean("value") FROM "temprature" where time<'2021-10-29T15:05:52.960826Z' group by time(1s),"face"`).then(results => {
  
            console.log(`in influxGetAggregateReport res`);
            let res = results.results[0].series.map((obj) => ({
              face: obj.tags.face,
              values: obj.values
            })
          )
          return resolve({});
        });
        */
  
      } catch (e) {
        return reject(`influx error`);
      }
    })
  }


