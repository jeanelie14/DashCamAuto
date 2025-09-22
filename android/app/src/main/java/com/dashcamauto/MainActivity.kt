package com.dashcamauto

import android.content.Context
import android.content.BroadcastReceiver
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Bundle
import androidx.annotation.Nullable
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "DashCamAuto"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * Override onCreate to configure VisionCamera
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Configuration pour VisionCamera
    // Les Frame Processors seront configurés via le JavaScript
  }

  /**
   * Android 14 compatibility fix for BroadcastReceivers
   * This is required to prevent crashes on Android 14 (API 34)
   */
  override fun registerReceiver(@Nullable receiver: BroadcastReceiver?, filter: IntentFilter?): Intent? {
    return if (Build.VERSION.SDK_INT >= 34 && applicationInfo.targetSdkVersion >= 34) {
      super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
    } else {
      super.registerReceiver(receiver, filter)
    }
  }

  /**
   * Override onWindowFocusChanged to prevent ReactNoCrashSoftException
   */
  override fun onWindowFocusChanged(hasFocus: Boolean) {
    try {
      super.onWindowFocusChanged(hasFocus)
    } catch (e: Exception) {
      // Ignore the exception to prevent crash
      // This happens when React context is not ready yet
    }
  }
}
