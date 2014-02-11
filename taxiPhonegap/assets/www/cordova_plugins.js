cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
      {
          "file": "plugins/org.apache.cordova.device/www/device.js",
          "id": "org.apache.cordova.device.device",
          "clobbers": [
              "device"
          ]
      },
      {
          "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
          "id": "org.apache.cordova.dialogs.notification",
          "merges": [
              "notification"
          ]
      },
      {
          "file": "plugins/org.apache.cordova.dialogs/www/android/notification.js",
          "id": "org.apache.cordova.dialogs.notification_android",
          "merges": [
              "notification"
          ]
      },
      {
          "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
          "id": "org.apache.cordova.vibration.notification",
          "merges": [
              "notification"
          ]
      },                  
    {
        "file": "plugins/org.apache.cordova.media/www/MediaError.js",
        "id": "org.apache.cordova.media.MediaError",
        "clobbers": [
            "window.MediaError"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.media/www/Media.js",
        "id": "org.apache.cordova.media.Media",
        "clobbers": [
            "window.Media"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.PushPlugin/www/PushNotification.js",
        "id": "com.phonegap.plugins.PushPlugin.PushNotification",
        "clobbers": [
            "PushNotification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/contacts.js",
        "id": "org.apache.cordova.contacts.contacts",
        "clobbers": [
            "navigator.contacts"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/Contact.js",
        "id": "org.apache.cordova.contacts.Contact",
        "clobbers": [
            "Contact"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactAddress.js",
        "id": "org.apache.cordova.contacts.ContactAddress",
        "clobbers": [
            "ContactAddress"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactError.js",
        "id": "org.apache.cordova.contacts.ContactError",
        "clobbers": [
            "ContactError"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactField.js",
        "id": "org.apache.cordova.contacts.ContactField",
        "clobbers": [
            "ContactField"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactFindOptions.js",
        "id": "org.apache.cordova.contacts.ContactFindOptions",
        "clobbers": [
            "ContactFindOptions"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactName.js",
        "id": "org.apache.cordova.contacts.ContactName",
        "clobbers": [
            "ContactName"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactOrganization.js",
        "id": "org.apache.cordova.contacts.ContactOrganization",
        "clobbers": [
            "ContactOrganization"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.toast/www/toast.js",
        "id": "org.apache.cordova.toast",
        "clobbers": [
            "Toast"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.phonenumber/www/phonenumber.js",
        "id": "org.apache.cordova.phonenumber",
        "clobbers": [
            "PhoneNumber"
        ]
    },
    {
        "file": "plugins/com.teamnemitoff.phonedialer/www/dialer.js",
        "id": "com.teamnemitoff.phonedialer.phonedialer",
        "merges": [
            "Phonedialer"
        ]
    }
    
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.media": "0.2.6",
    "com.phonegap.plugins.facebookconnect": "0.4.0",
    "com.phonegap.plugins.PushPlugin": "2.1.1",
    "org.apache.cordova.splashscreen": "0.2.5",
    "com.simonmacdonald.telephonenumber": "1.0.0",
    "org.apache.cordova.contacts": "0.2.6",
    "org.apache.cordova.console": "0.2.5"
}
// BOTTOM OF METADATA
});