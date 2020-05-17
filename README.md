# MQTT-Client

A module for [MagicMirror](https://github.com/MichMich/MagicMirror/) that is able to subscribe to MQTT-Topic and map the received message to a configured [Notification](https://github.com/MichMich/MagicMirror/wiki/notifications)

## Configuration

Put your configuration in the `MagicMirror/config/config.js` file.

Here is an example of using this module:

If there is an MQTT-Message on topic **example-topic/alert** the payload is directly shown as [Alert](https://docs.magicmirror.builders/modules/alert.html)

```javascript
{
    module: 'MMM-MQTT-Client',
    config: {
        mqttConnections: [
            {
                host: 'localhost',      // Optional: Hostname or IP address of your mqtt-server. Default will be localhost.
                port: '1883',           // Optional: Port number of your mqtt-server. Default will be 1883.
                user: 'user',           // Optional: Username for your secured mqtt-server.
                password: 'password',   // Optional: Password for your secured mqtt-server.
                subscriptions: [
                    {
                        topic: 'example-topic/alert', // Name of topic to subscribe for
                        notification: 'SHOW_ALERT', // When receiving a message the message payload will be mapped to the internal notification
                    }
                ]
            }
        ],
    }
}
```
