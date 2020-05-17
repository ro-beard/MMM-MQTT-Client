# MQTT-Client

A module for [MagicMirror](https://github.com/MichMich/MagicMirror/) that is able to subscribe to MQTT-Topic and map the received message to a configured [Notification](https://github.com/MichMich/MagicMirror/wiki/notifications).

## Configuration

Put your configuration in the `MagicMirror/config/config.js` file.

Here is an example of using this module:

If there is an MQTT-Message on topic **example-topic/alert** the payload is directly shown as [Alert](https://docs.magicmirror.builders/modules/alert.html)

```javascript
{
    module: "MMM-MQTT-Client",
    config: {
        mqttConnections: [
            {
                host: "localhost",      // Optional: Hostname or IP address of your mqtt-server. Default will be localhost.
                port: "1883",           // Optional: Port number of your mqtt-server. Default will be 1883.
                user: "user",           // Optional: Username for your secured mqtt-server.
                password: "password",   // Optional: Password for your secured mqtt-server.
                subscriptions: [
                    {
                        topic: "example-topic/alert", // Name of topic to subscribe for
                        notification: "SHOW_ALERT", // When receiving a message the message payload will be mapped to the internal notification
                    }
                ],
                publications: [
                    {
                        topic: "mirror/startup",  // The payload of the received Notification will be published to topic mirror/startup
                        notification: "MMM-MQTT-Client_STARTUP_DONE" // Socket-Notification that is throw by module itself.
                    },
                    {
                      topic: "mirror/clock-minute"  // The payload of the received Notification will be published to topic mirror/clock-minute
                      notification: "CLOCK_MINUTE"  // Notification received from the Clock module
                    }
                ]
            }
        ],
    }
}
```

### Configuration options

These settings are available to configure your module.

| Option             | Description
| ------------------ | -----------
| `mqttConnections`  | An array of connections you want to add to your module.

### MQTT Connection-Settings

For being able to connect successfully to your MQTT server you need to configure these properties:

| Option             | Description
| ------------------ | -----------
| `host`             | IPv4-Address or hostname of your MQTT server. <br> **Default:** `localhost`
| `port`             | The port of your MQTT server. <br> **Default:** `1883`
| `user`             | Username that is able to access your MQTT server. <br> *Optional, if unauthorized access available*
| `password`         | Password for the user that is able to access your MQTT server <br> *Optional, if unauthorized access available*
| `subscriptions`    | A list of subscription including topics you want to listen and map to a notifications.
| `publications`     | A list of publications including notifications you want to listen and publish the content to the specified topic.

### Subscriptions

As this module allows you to subscribe to any topics of your MQTT server and map it to an internal [Notification](https://github.com/MichMich/MagicMirror/wiki/notifications) for notify other modules.

| Option             | Description
| ------------------ | -----------
| `topic`            | Name of the MQTT-Topic you want to subscribe to.
| `notification`     | Name of the notification the payload should be mapped to.

### Publications

This module also allows you to publish to any topics of your MQTT server if an internal [Notification](https://github.com/MichMich/MagicMirror/wiki/notifications) happens and send the payload to the topic.

| Option             | Description
| ------------------ | -----------
| `topic`            | Name of the MQTT-Topic you want to publish to.
| `notification`     | Name of the notification the module should listen to. The whole payload will be published to the topic.
