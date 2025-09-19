package com.dashcamauto

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
