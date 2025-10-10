fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios screenshots

```sh
[bundle exec] fastlane ios screenshots
```

Generate screenshots for all devices and languages

### ios upload_metadata

```sh
[bundle exec] fastlane ios upload_metadata
```

Upload metadata and screenshots to App Store Connect

Note: This can be run independently of builds - you don't need a build to update metadata

However, to attach metadata to a specific version, that version should exist in App Store Connect

### ios upload_screenshots

```sh
[bundle exec] fastlane ios upload_screenshots
```

Upload only screenshots to App Store Connect

This can be run at any time - builds are not required

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Upload to TestFlight for beta testing

### ios prepare_release

```sh
[bundle exec] fastlane ios prepare_release
```

Prepare for App Store release (screenshots + metadata)

### ios download_screenshots

```sh
[bundle exec] fastlane ios download_screenshots
```

Download existing screenshots from App Store Connect

### ios download_metadata

```sh
[bundle exec] fastlane ios download_metadata
```

Download existing metadata from App Store Connect

### ios version

```sh
[bundle exec] fastlane ios version
```

Show current version and build number

### ios clean

```sh
[bundle exec] fastlane ios clean
```

Clean up simulator screenshots and derived data

----


## Android

### android screenshots

```sh
[bundle exec] fastlane android screenshots
```

Generate screenshots for Android devices

### android upload_metadata

```sh
[bundle exec] fastlane android upload_metadata
```

Upload to Google Play Console

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
