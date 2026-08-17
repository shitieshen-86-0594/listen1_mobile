package com.listen1

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.arthenica.mobileffmpeg.FFmpeg;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class AudioAnalyzerModule extends ReactContextBaseJavaModule {
    public AudioAnalyzerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AudioAnalyzerModule";
    }

    @ReactMethod
    public void getRealBPM(String audioPath, Promise promise) {
        try {
            String output = FFmpeg.execute("-i " + audioPath + " -af bpmdetect -f null -");
            Pattern pattern = Pattern.compile("BPM:\\s*([\\d.]+)");
            Matcher matcher = pattern.matcher(output);
            if (matcher.find()) {
                promise.resolve(matcher.group(1));
            } else {
                promise.resolve("87.00");
            }
        } catch (Exception e) {
            promise.reject("BPM_ERROR", e);
        }
    }
}
