const express=require('express');
const DataStore=require('nedb');
const fetch=require('node-fetch')
require('dotenv').config()


const database=new DataStore('database.db')
const app=express();
database.loadDatabase()

app.use(express.static('public'));
app.use(express.json({limit:'1mb'}))


app.post('/api',(req,res)=>{
   const data=req.body;
    const timestamp=Date.now();
    data.timestamp=timestamp
    database.insert(data)
    res.json(data)
})

app.get('/api',(req,res)=>{
    database.find({},(error,data)=>{
         if(error){
             res.end()
             return
         }
         res.json(data)
    })
   
})
app.get('/weather/:latlon',async (request,response)=>{
    try{

    const latlon=request.params.latlon.split(',');
    console.log(latlon)
    const lat=latlon[0];
    const lon=latlon[1];
    const apikey=process.env.API_KEY
    const weather=`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`
    const weather_response=await fetch(weather)
    const weather_data=await weather_response.json();

    const airqual=`https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`
    const airqual_response=await fetch(airqual)
    const airqual_data=await airqual_response.json();
    
    const data={
        weather:weather_data,
        air_quality:airqual_data
    }

    response.json(data)
  



}
   
   
    catch(e){
        console.log(e)
    }
    
})


const PORT=process.env.PORT ||3000;

app.listen(PORT,()=>{
    console.log('server is up and running...')
})


