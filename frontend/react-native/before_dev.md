# 开发前需要了解的东西


## Platform specific extensions

React Native will detect when a file has a .ios. or .android. extension and load the right file for each platform when requiring them from other components.

For example, you can have these files in your project:

BigButton.ios.js
BigButton.android.js

With this setup, you can just require the files from a different component without paying attention to the platform in which the app will run.

import BigButton from './components/BigButton';
React Native will import the correct component for the running platform.


更多请查看[官方文档-platform-specific-extensions](http://facebook.github.io/react-native/docs/platform-specific-code.html#platform-specific-extensions)
