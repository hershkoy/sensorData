import getConnection from '../../utils/db'

let influx=null;

function influxSaveMeasurement(data){
    influx.writePoints([
        {
          measurement: 'temprature',
          tags: {
            'sensor_id' : data.id,
            'face': data.face,
        },
          fields: { value: data.temprature },
        }
        
      ]).catch(err => {
        console.error(`Error saving data to InfluxDB! ${JSON.stringify(err)}`)
      })
      console.log(`sense:${data.temprature}|${data.face}`);
}


export default async function handler(req, res) {
  influx = await getConnection();
  console.log(`in sensor`);
  influxSaveMeasurement(req.body);
  res.status(200).json('ok')
}
