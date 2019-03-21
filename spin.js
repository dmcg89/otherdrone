const arDrone = require(‘ar-drone‘);
const client  = arDrone.createClient();
client.takeoff();
client
  .after(5000,function(){
    this.clokcwise(0.5)
  })
  .after(3000,function(){
    this.stop();
    this.land();
  })
