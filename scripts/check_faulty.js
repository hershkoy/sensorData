const Influx = require('influx');
const { Command } = require('commander');

require("dotenv").config();
const log = require("../utils/logger");

const program = new Command();

program
  .option('--repeat_every <number>', 'repeat every X seconds',0)
  .parse();

const repeat_every = program.opts().repeat_every;

let influx = null;
let known_faulty_sensors_ids = [];
let faces = ['n','e','s','w'];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

try{
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
        },
        {
        measurement: 'faulty',
        fields: {
            value: Influx.FieldType.INTEGER
        },
        tags: []
        }
    ]
    });
    console.log("Connected to database."); 
} catch (error) {
    console.log("DB error", error);
} 

function saveFault(sensor_id){
    influx.writePoints([
        {
          measurement: 'faulty',
          tags: { },
          fields: { value: sensor_id },
        }
        
      ]).catch(err => {
        console.error(`Error saving data to InfluxDB! ${JSON.stringify(err)}`)
      })
      //console.log(`sense:${data.temprature}|${data.face}`);
}

function getKnownFaulty(){
    return new Promise((resolve, reject) => {
        try {
          influx.queryRaw(` SELECT distinct(value) FROM "faulty"`).then(results => {
              //console.log(results.results[0].series);
              return resolve(results.results[0].series[0].values.map((o)=>o[1]));
          });
    
        } catch (e) {
          return reject(`influx error`);
        }
      })
}

function getFaceTemparatures(face){
    return new Promise((resolve, reject) => {
      try {
        influx.queryRaw(`SELECT mean("value") FROM "temprature" where face='${face}' group by time(1s),sensor_id fill(previous)`).then(results => {
            //console.log(results.results[0].series);
            return resolve(results.results[0].series);
        });
  
      } catch (e) {
        return reject(`influx error`);
      }
    })
}

async function checkFault(face){

    let threshold = parseFloat(process.env.FAULT_THRESHOLD);

    let data = await getFaceTemparatures(face);
    let results = {};
    data.forEach(sensor_data =>{
        let avg = sensor_data.values.reduce((a, b) => (a + b[1]),0) / sensor_data.values.length;
        //console.log(face,sensor_data.tags.sensor_id,avg);
        results[sensor_data.tags.sensor_id]=avg;
    })
    let face_values = Object.values(results);
    let face_avg = face_values.reduce((a,b) => a + b, 0) / face_values.length;
    //console.log(face,results,face_avg);

    Object.entries(results).forEach(([sensor_id, sensor_avg]) => {
        let ratio = sensor_avg/face_avg;
        //console.log(sensor_id,ratio);
        if ((ratio>1+threshold)||(ratio<1-threshold)){
            if (known_faulty_sensors_ids.includes(parseInt(sensor_id))) {
                console.log(`found:${sensor_id}, already in db, skip`);
                return;
            }
            log.info(`fault detected.face:${face},sensor_id:${sensor_id},sensor_avg:${sensor_avg},sensor_avg:${sensor_avg}. ratio:${ratio}`);

            saveFault(sensor_id);
        }
    });
}

(async () =>{

    known_faulty_sensors_ids = await getKnownFaulty();
    console.log(known_faulty_sensors_ids);

    while (true){

        faces.forEach((face)=>{
            checkFault(face);
        });

        if (repeat_every==0) break;
        await sleep(1000*repeat_every);
    }

})();
    
