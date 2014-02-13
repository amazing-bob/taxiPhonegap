
package com.plugin.gcm;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningTaskInfo;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Vibrator;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.google.android.gcm.GCMBaseIntentService;

@SuppressLint("NewApi")
public class GCMIntentService extends GCMBaseIntentService {
	

	public static final int NOTIFICATION_ID = 237;
	private static final String TAG = "GCMIntentService";

	public GCMIntentService() {
		super("GCMIntentService");
	}

	@Override
	public void onRegistered(Context context, String regId) {
		Log.v(TAG, "onRegistered: " + regId);
		JSONObject json;

		try {
			json = new JSONObject().put("event", "registered");
			json.put("regid", regId);

//			Log.v(TAG, "onRegistered: "   json.toString());

 			// Send this JSON data to the JavaScript application above EVENT should be set to the msg type
 			// In this case this is the registration ID
			PushPlugin.sendJavascript( json );

		} catch( JSONException e) {
// 			 No message to the user is sent, JSON failed
			Log.e(TAG, "onRegistered: JSON exception");
		}
	}

	@Override
	public void onUnregistered(Context context, String regId) {
		Log.d(TAG, "onUnregistered - regId: " +  regId);
	}

	@Override
	protected void onMessage(Context context, Intent intent) {
		Log.d(TAG, "onMessage - context: "  + context);

 		// Extract the payload from the message
		Bundle extras = intent.getExtras();
		
		if (extras != null) {
			Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
			Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
			Ringtone r = RingtoneManager.getRingtone(getApplicationContext(), notification);
			
			String className = extras.getString("className");
			boolean foreground = this.isInForeground();
			extras.putBoolean("foreground", foreground);
			
			if ("FeedRunnable".equals(className)) {
				
				try {
					
					extras.putString("message", extras.getString("feedContent"));
					
					if ( foreground && extras.getString("message").length() > 0 ){
						PushPlugin.sendExtras(extras);
						
					} else if ( !foreground && extras.getString("message").length() > 0) {
						if ( "addFeed".equals(extras.getString("feedAction")) ) {
							vibrator.vibrate(500);
					        r.play();
					        
							createNotification(context, extras);
						}
					}
					
				} catch (Exception e) {
					Log.e(TAG, "failed to execute FeedRunnable");
					
				}
 			
			} else if ("RoomRunnable".equals(className)) {
				
				try {
					
					String msg = "";
					
					if ( "joinRoom".equals(extras.getString("roomAction")) ) {
						msg = extras.getString("mbrName") + "님이 방에 들어왔습니다.";
						
					} else if ( "outRoom".equals(extras.getString("roomAction")) ) {
						msg = extras.getString("mbrName") + "님이 방을 나갔습니다.";
						
					}
					extras.putString("message", msg);
					
					if ( foreground && extras.getString("message").length() > 0 ) {
						PushPlugin.sendExtras(extras);
						
					} else if ( !foreground && extras.getString("message").length() > 0 ) {
						vibrator.vibrate(500);
				        r.play();
				        
						createNotification(context, extras);
					}
					
				} catch (Exception e) {
					Log.e(TAG, "failed to execute RoomRunnable");
					
				}
				
			} else if ("StartAlramRunnable".equals(className)) {
				
				try {
					String msg = "출발 " + extras.getString("differenceTime") + "분 전입니다.";
					extras.putString("message", msg);
					
					vibrator.vibrate(500);
			        r.play();
					createNotification(context, extras);
					
					PushPlugin.sendExtras(extras);
					
				} catch (Exception e) {
					Log.e(TAG, "failed to execute StartAlramRunnable");
					
				}
				
			}

			
		}
	}

	public void createNotification(Context context, Bundle extras) {
//		PowerManager pm = (PowerManager) context.getSystemService(
//				Context.POWER_SERVICE);
//
//		PowerManager.WakeLock wl = pm.newWakeLock(
//	                      PowerManager.PARTIAL_WAKE_LOCK
//	                      | PowerManager.ON_AFTER_RELEASE,
//	                      TAG);
//		wl.acquire();
		NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
		String appName = getAppName(this);

		Intent notificationIntent = new Intent(this, PushHandlerActivity.class);
		notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
		notificationIntent.putExtra("pushBundle", extras);

		PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);

		NotificationCompat.Builder mBuilder =
				new NotificationCompat.Builder(context)
		 								.setSmallIcon(context.getApplicationInfo().icon)
										.setWhen(System.currentTimeMillis())
										.setContentTitle(appName)
										.setTicker(appName)
										.setContentIntent(contentIntent);

		String message = extras.getString("message");
		if (message != null) {
			mBuilder.setContentText(message);
		} else {
			mBuilder.setContentText("<missing message content>");
		}

		String msgcnt = extras.getString("msgcnt");
		if (msgcnt != null) {
			mBuilder.setNumber(Integer.parseInt(msgcnt));
		}
		
		mNotificationManager.notify((String) appName, NOTIFICATION_ID, mBuilder.build());
//		Toast.makeText(getApplicationContext(), "토스트다!!!!!!!!!!!!!!!", Toast.LENGTH_LONG).show();
//		mToastHandler.showToast(message, Toast.LENGTH_SHORT);

	}


	public static void cancelNotification(Context context) {
		NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
		mNotificationManager.cancel((String)getAppName(context), NOTIFICATION_ID);
	}

	private static String getAppName(Context context) {
		CharSequence appName = context.getPackageManager()
				 						.getApplicationLabel(context.getApplicationInfo());

		return (String)appName;
	}

	public boolean isInForeground() {
		ActivityManager activityManager =
				(ActivityManager) getApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
		List<RunningTaskInfo> services = activityManager
				 								.getRunningTasks(Integer.MAX_VALUE);
		Log.v(TAG, "isInForeground?" +  services.get(0));

		if (services.get(0).topActivity.getPackageName()
				 						.toString()
			 							.equalsIgnoreCase(getApplicationContext()
			 														.getPackageName().toString())){
			return true;
		} else {
			return false;
		}
	}

	@Override
	public void onError(Context context, String errorId) {
		Log.e(TAG, "onError - errorId: " +  errorId);
	}

}

