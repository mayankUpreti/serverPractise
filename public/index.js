function setup(){
//  noCanvas();
//    const video=createCapture(VIDEO);
//    video.size(320,240);
 let lat,lon;
        if('geolocation'in navigator){
           navigator.geolocation.getCurrentPosition(async (position)=>{
           lat=position.coords.latitude;
            lon=position.coords.longitude;  
            // video.loadPixels()
            // const image64=video.canvas.toDataURL();
            document.querySelector('#latitude').textContent=lat;
            document.querySelector('#longitude').textContent=lon;
           
            try{

                const data={lat,lon}; //,image64
               //from  external apis
                 const responseApi=await fetch(`/weather/${lat},${lon}`);
                 const json=await responseApi.json()
                 console.log(json)
                 data.weather=json.weather.weather[0].description;
                 data.air_quality=json.air_quality.results[0].measurements[1].value 
                 document.querySelector('#summary').textContent=json.weather.weather[0].description
                 document.querySelector('#temp').textContent=json.weather.main.temp
                 document.querySelector('#airqual').textContent=json.air_quality.results[0].measurements[1].value 
                
                 const options={
                    method:'POST',
                    headers: {
                    'Content-Type': 'application/json'
                     },
                    body:JSON.stringify(data)
               } ;
                //from own api
                 const response=await fetch('/api',options);
                 const resdata=await response.json()
                 console.log(resdata)

                }
                 catch(e){
                     console.log(e)
                 };
           })
         }
         else{
             console.log('not available')
         }


}
