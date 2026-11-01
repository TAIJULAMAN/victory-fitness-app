import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type CrossPlatformWebViewProps = {
  source: { html?: string; uri?: string };
  style?: StyleProp<ViewStyle>;
  originWhitelist?: string[];
  javaScriptEnabled?: boolean;
  domStorageEnabled?: boolean;
  mediaPlaybackRequiresUserAction?: boolean;
  allowsInlineMediaPlayback?: boolean;
  setSupportMultipleWindows?: boolean;
  javaScriptCanOpenWindowsAutomatically?: boolean;
  scrollEnabled?: boolean;
  startInLoadingState?: boolean;
  renderLoading?: () => React.ReactElement | null;
  onShouldStartLoadWithRequest?: (request: { url: string }) => boolean;
  onError?: () => void;
  onLoadEnd?: () => void;
};

declare const CrossPlatformWebView: React.ComponentType<CrossPlatformWebViewProps>;
export default CrossPlatformWebView;
