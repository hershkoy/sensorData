import getConnection from '../../utils/db'

let influx=null;
let known_faulty_sensors_ids = [];

function influxGetAggregateReport(){
  return new Promise((resolve, reject) => {

    let filter_faulty = "";
    if (known_faulty_sensors_ids.length>0){
      filter_faulty = `sensor_id !~ /${known_faulty_sensors_ids.join("|")}/ AND `
    }

    try {
      influx.queryRaw(`SELECT mean("value") FROM "temprature" where ${filter_faulty} time>now()-15m group by time(1s),"face"`).then(results => {

        if (!results.results[0].series) {
          return resolve([]);
        }

        let res_t = results.results[0].series.map((obj) => ({
            face: obj.tags.face,
            values: obj.values
          })
        )
        //console.log(res);

        const map = new Map();
        let result = [
          ...res_t.reduce((acc, { face, values }) => {
              values.forEach((item) => {
                let time = item[0];
                let value = item[1];
                if (!acc.has(time))
                  acc.set(time, { time, n: null, e: null, s: null, w: null });
                acc.get(time)[face] = value;
              });
              return acc;
            }, map)
            .values(),
        ];

        result = result.filter(r => !(r.n==null && r.e==null && r.s==null && r.w==null ))

        //console.log(result);
        
        return resolve(result);
      });

    } catch (e) {
      return reject(`influx error`);
    }
  })
}

function getKnownFaulty(){
  return new Promise((resolve, reject) => {
      try {
        influx.queryRaw(` SELECT distinct(value) FROM "faulty"`).then(results => {
            //console.log(results.results[0].series);
            if (!results.results[0].series) {
              return resolve([]);
            }            
            return resolve(results.results[0].series[0].values.map((o)=>o[1]));
        });
  
      } catch (e) {
        return reject(`influx error`);
      }
    })
}


export default async function handler(req, res) {
  influx = await getConnection();
  console.log(`in report_aggregate`);
  known_faulty_sensors_ids = await getKnownFaulty();
  let res_data = await influxGetAggregateReport();
  res.status(200).json(res_data)
}
