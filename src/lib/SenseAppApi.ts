import XRegExp from 'xregexp'
import net from 'net'
import { EventEmitter } from 'events'

export default class SenseAppApi extends EventEmitter {

  client: null | net.Socket = null

  constructor() {
    super()
  }

  connect(file = '/tmp/senseapp.sock') {
    this.emit("message", { foo: 'bar'})
    this.client = net.createConnection(file, () => {
      console.log('connected to server!')
      this.emit("connect", this.client)
    });
    this.client!.addListener('data', this.onData.bind(this))
  }

  getSettings = () => {
    this.send({"get": ["settings"]})
  }
  
  getSystemInfo() {
    this.send({"get": ["system_info"]})
  }
  
  updateWantedTemperature(temperature: number) {
    const data = {
      post: {
        settings: {
          wanted_temperature: temperature,
        }
      }
    }
    this.send(data)
  }
  
  updateWantedTemperatureRange(range: number) {
    const data = {
      post: {
        settings: {
          wanted_temperature_range: range,
        }
      }
    }
    this.send(data)
  }

  private send(data: object) {
    if(this.client) {
      this.client.write(JSON.stringify(data))
    }
  }

  private onData(data: any){
    data = data.toString()
    try {
      const groups = XRegExp.matchRecursive(data, '{', '}', 'gy').map((match) => `{${match}}`)
      groups.forEach((result) => {
        this.emit('message', JSON.parse(result))
      })
    } finally {}
  }
}