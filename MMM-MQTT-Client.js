Module.register("MMM-MQTT-Client", {
    // Default module config
    defaults: {
    },

    notificationsToListenForPublish:[],

    start: function () {
        console.log(this.name + ' | Module started.');
				this.sendSocketNotification(this.name + '_CONFIG', this.config);
    },

		socketNotificationReceived: function (notification, payload) {
      if(notification === (this.name + "_MSG_RECEIVED")) {
        this.sendNotification(payload.subscription.notification, payload.message);
      }
      else if(notification === (this.name + '_STARTUP_DONE')) {
         this.notificationsToListenForPublish = payload.notifications;
         this.publishForNotificationIfBind(notification, payload);
      }
		},

    notificationReceived: function (notification, payload, sender) {
        this.publishForNotificationIfBind(notification, payload);
    },

    publishForNotificationIfBind(notification, payload) {
      if (this.notificationsToListenForPublish.includes(notification)) {
          this.sendSocketNotification(this.name + '_PUBLISH', {
              notification: notification,
              payload: payload
          });
      }
    },

    getDom: function () {}
});
