import getConnection from '../../utils/db'

let influx=null;

function influxGetAggregateReport(){
  return new Promise((resolve, reject) => {
    try {
      influx.queryRaw(`SELECT mean("value") FROM "temprature" group by time(1s),"face"`).then(results => {

        let res_t = results.results[0].series.map((obj) => ({
            face: obj.tags.face,
            values: obj.values
          })
        )
        //console.log(res);

        const map = new Map();
        const result = [
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

        //console.log(result);
        
        return resolve(result);
      });

    } catch (e) {
      return reject(`influx error`);
    }
  })
}


export default async function handler(req, res) {
  influx = await getConnection();
  console.log(`in report_aggregate`);
  let res_data = await influxGetAggregateReport();
  res.status(200).json(res_data)
}
