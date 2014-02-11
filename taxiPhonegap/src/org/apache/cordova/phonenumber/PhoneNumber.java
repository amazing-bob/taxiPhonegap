package org.apache.cordova.phonenumber;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.telephony.TelephonyManager;

public class PhoneNumber extends CordovaPlugin {

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    	JSONObject obj = new JSONObject();
    	
        if (action.equals("getPhoneNo")) {
            TelephonyManager telephonyManager =
                (TelephonyManager)this.cordova.getActivity().getSystemService(Context.TELEPHONY_SERVICE);
            String result = telephonyManager.getLine1Number();
            if (result != null) {
            	
            	obj.put("phoneNo", result);
                callbackContext.success(obj);
               return true;
            }
        }
        return false;
    }
	
}
