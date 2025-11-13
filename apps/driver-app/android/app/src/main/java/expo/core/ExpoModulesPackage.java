package expo.core;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.List;

/**
 * Compatibility bridge so that generated PackageList references to
 * {@code expo.core.ExpoModulesPackage} resolve correctly while delegating to
 * the Expo SDK 52 implementation located at {@code expo.modules.ExpoModulesPackage}.
 */
public final class ExpoModulesPackage implements ReactPackage {
    private final expo.modules.ExpoModulesPackage delegate = new expo.modules.ExpoModulesPackage();

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return delegate.createNativeModules(reactContext);
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return (List<ViewManager>) (List<?>) delegate.createViewManagers(reactContext);
    }
}

