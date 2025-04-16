package tv.trakt.app

import android.app.AlertDialog
import android.content.Intent
import android.webkit.JavascriptInterface
import androidx.annotation.Keep
import androidx.core.net.toUri

// FIXME: theming/styling for anything that triggers a native element
class StreamOnInterface(private val activity: MainActivity) {

    @Keep
    @JavascriptInterface
    fun open(source:String, deepLink: String) {
        try {
            val intent = Intent(Intent.ACTION_VIEW, deepLink.toUri())
            activity.startActivity(intent)
        } catch (e: Exception) {
            activity.runOnUiThread {
                AlertDialog.Builder(activity)
                    .setTitle("Failed to open service")
                    .setMessage("Could not open $source. Please make sure it's installed.")
                    .setPositiveButton("OK") { dialog, _ ->
                        dialog.dismiss()
                    }
                    .setCancelable(true)
                    .show()
            }
        }
    }
}