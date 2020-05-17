/* Magic Mirror
 * Node Helper for module: MMM-MQTT-Client
 * Repository URL: https://github.com/ro-beard/MMM-MQTT-Client
 *
 * By Robert Rosenberger
 * MIT Licensed.
 */
var NodeHelper = require('node_helper');
var mqtt = require('mqtt');
module.exports = NodeHelper.create({
  mqttClientStarted: false,
  config: {},
  mqttConnections: [],
  start: function() {
    console.log(this.name + ' | node_helper started.');
  },
  socketNotificationReceived: function(notification, payload) {
    console.log(this.name + ' | socket notificaton ' + notification + ' received.');
    if (notification === (this.name + '_CONFIG')) {
      console.log(this.name + ' | Initial configuration received.');
      this.config = payload;
      if (this.mqttClientStarted) {
        console.log(this.name + ' | Ignoring the configuration as the module has already been started.');
      } else {
        this.startMqttListener();
      }
    }
  },
  startMqttListener: function() {
    var self = this;
    console.log(this.name + ' | Start adding the configured connections.');
    if (this.config && this.config.mqttConnections && this.config.mqttConnections.length > 0) {
      for (i = 0; i < this.config.mqttConnections.length; i++) {
        var currentConnection = this.config.mqttConnections[i];
        self.addConnection(currentConnection);
      }
    } else {
      console.log(this.name + ' | No connections configured.');
    }
  },
  addConnection: function(connection) {
    console.log(this.name + ' | Adding current connection.', connection);
    var mqttConnection = {};
    mqttConnection.host = connection.host || 'localhost';
    mqttConnection.port = connection.port || 1883;
    mqttConnection.options = {};
    mqttConnection.topics = [];
    mqttConnection.subscriptions = [];
    mqttConnection.publications = [];
    if (connection.user) mqttConnection.options.username = connection.user;
    if (connection.password) mqttConnection.options.password = connection.password;
    if (connection.publications) {
      connection.publications.forEach(pub => {
        mqttConnection.publications.push(pub);
      });
    }
    if (connection.subscriptions) {
      connection.subscriptions.forEach(pub => {
        mqttConnection.subscriptions.push(pub);
      });
    }
    this.mqttConnections.push(mqttConnection);
    this.startMqttConnection(mqttConnection);
  },
  startMqttConnection: function(connection) {
    var self = this;
    var url = (connection.host.match(/^mqtts?:\/\//) ? '' : 'mqtt://') + connection.host;
    if (connection.port) {
      url = url + ':' + connection.port
    }
    console.log(self.name + ' | Connecting to MQTT-Server ' + url);
    connection.client = mqtt.connect(url, connection.options);
    connection.client.on('error', function(err) {
      console.log(self.name + ' | ' + url + ' An error occurred for current mqtt-connection: ' + err);
    });
    connection.client.on('connect', function() {
      console.log(self.name + ' | Successfully connected to MQTT-Server ' + url);
      for (i = 0; i < connection.subscriptions.length; i++) {
        if (connection.subscriptions[i].topic) {
          console.log(self.name + ' | Subscribing to topic ' + connection.subscriptions[i].topic);
          connection.client.subscribe(connection.subscriptions[i].topic);
        }
      }
    });
    connection.client.on('message', function(topic, message) {
      var scope = this;
      console.log(self.name + ' | MQTT-Message received for server ' + url + ' in topic ' + topic);
      connection.subscriptions.filter(subscription => subscription.topic === topic)
        .forEach(subscription => {
          let msg = self.mqttMessageToJsonOrString(message);
          self.sendSocketNotification(self.name + "_MSG_RECEIVED", {
            topic: topic,
            message: msg,
            subscription: subscription
          });
        });
    });
  },
  mqttMessageToJsonOrString: function(message) {
    try {
      return JSON.parse(message + "");
    } catch (e) {
      return message + "";
    }
  }
});
