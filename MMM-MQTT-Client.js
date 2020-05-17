Module.register("MMM-MQTT-Client", {
    // Default module config
    defaults: {
    },

    start: function () {
        console.log(this.name + ' | Module started.');
				this.sendSocketNotification(this.name + '_CONFIG', this.config);
    },

		socketNotificationReceived: function (notification, payload) {
      if(notification === (this.name + "_MSG_RECEIVED")) {
        this.sendNotification(payload.subscription.notification, payload.message);
      }
		},

    getDom: function () {}
});
