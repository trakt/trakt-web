object ManifestConstants {
    const val DEV_LOOPBACK_URL = "http://10.0.2.2:5173/"
    const val PROD_URL = "https://app.trakt.tv/"
}

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "tv.trakt.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "tv.trakt.app"
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            // FIXME: proper signing for release builds
            signingConfig = signingConfigs.getByName("debug")
            manifestPlaceholders["IS_CLEAR_TEXT_TRAFFIC"] = "false"
            manifestPlaceholders["BASE_URL"] = ManifestConstants.PROD_URL
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            manifestPlaceholders["IS_CLEAR_TEXT_TRAFFIC"] = "true"
            manifestPlaceholders["BASE_URL"] = ManifestConstants.DEV_LOOPBACK_URL
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = "11"
    }

    buildFeatures {
        compose = true
        viewBinding = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.tv.foundation)
    implementation(libs.androidx.tv.material)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)
}
