package tv.trakt.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView
    private var isAppInBackground = false

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            useWideViewPort = true
            loadWithOverviewMode = true
            layoutAlgorithm = WebSettings.LayoutAlgorithm.NORMAL
            cacheMode = WebSettings.LOAD_NO_CACHE
        }
        webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null)

        webView.webViewClient = WebViewClient()
        webView.addJavascriptInterface(StreamOnInterface(this), "StreamOnAndroid")

        webView.loadUrl(getBaseUrl())

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        }

        enableWebViewBackNavigation(webView)
        setContentView(webView)
    }

    private fun getBaseUrl(): String {
        val baseUrl = applicationContext
            .packageManager
            .getApplicationInfo(packageName, android.content.pm.PackageManager.GET_META_DATA)
            .metaData
            .getString("BASE_URL")

        return baseUrl ?: throw IllegalStateException("BASE_URL not defined in manifest")
    }

    private fun enableWebViewBackNavigation(webView: WebView) {
        val callback = object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                    return
                }

                remove()
                onBackPressedDispatcher.onBackPressed()
            }
        }

        onBackPressedDispatcher.addCallback(this, callback)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onResume() {
        super.onResume()

        if (isAppInBackground) {
            webView.reload()
            isAppInBackground = false
        }
    }

    override fun onPause() {
        super.onPause()
        isAppInBackground = true
    }
}
