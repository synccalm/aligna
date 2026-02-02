import UIKit
import React

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  var reactNativeFactory: RCTReactNativeFactory?
  var reactDelegate: RCTDefaultReactNativeFactoryDelegate?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    // Create the delegate
    let delegate = RCTDefaultReactNativeFactoryDelegate()

    // Create the dependency provider (no AppDependencyProvider class in RN 0.80)
    let dependencyProvider = RCTAppDependencyProvider()

    // Assign dependency provider to delegate
    delegate.dependencyProvider = dependencyProvider

    // Create the factory
    let factory = RCTReactNativeFactory(delegate: delegate)

    // Keep references
    reactNativeFactory = factory
    reactDelegate = delegate

    // Create and start the main window
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "Aligna",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}
