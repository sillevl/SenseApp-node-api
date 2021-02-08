import SenseAppApi from './lib/SenseAppApi'

console.log("** SenseApp API demo **");

const api = new SenseAppApi()

api.on('message', (message) => {
  console.log("*** Message ***")
  console.log(JSON.stringify(message, null, 2));
})

api.on("connect", () => {
  api.getSystemInfo()
  api.getSettings()

  api.updateWantedTemperature(40.0)
})

api.connect()
