const http = require('http');
const fs = require('fs');
const requests = require('requests');


const homeFile = fs.readFileSync('home.html', 'utf-8');

const replaceVal = (tempval, orgval)=>{
    let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
    temperature = temperature.replace("{%templocation%}", orgval.name);
    temperature = temperature.replace("{%tempcountry%}", orgval.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgval.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res)=>{
if(req.url == '/weatherapp'){
requests("https://api.openweathermap.org/data/2.5/weather?q=vadodara&appid={apiKey}&units=metric")
.on('data',function (chunk){
    const objData = JSON.parse(chunk);
    const arrData = [objData];
    const realTimeData = arrData.map(val => replaceVal(homeFile,val)).join("");
   res.write(realTimeData);
   // console.log(realTimeData);
})
.on('end', function(err){
    if(err){console.log(`"the server has been stopped due to this error" ${err}`);}
    res.end();
})
}
});
server.listen(8000, '127.0.0.1');