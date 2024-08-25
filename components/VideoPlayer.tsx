import React, { useCallback, useMemo, useRef, useState } from "react";
import WebView, { WebViewMessageEvent } from "react-native-webview";

enum MessageType {
  PLAY = "play",
  PAUSE = "pause",
  ENDED = "ended",
  READY = "ready",
  DURATION = "duration",
  TIMEUPDATE = "timeupdate",
}

interface Message {
  TYPE: MessageType;
  value: number;
}

interface Props {
  video: string;
}

const VideoPlayer = ({ video }: Props) => {
  const playerRef = useRef<WebView>(null);

  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const data = event.nativeEvent.data;
      const { TYPE, value }: Message = JSON.parse(data);

      switch (TYPE) {
        case MessageType.READY:
          setLoading(false);
          break;
        case MessageType.PLAY:
          break;
        case MessageType.PAUSE:
          break;
        case MessageType.ENDED:
          restartVideo();
          break;
        case MessageType.DURATION:
          setDuration(value);
          break;
        case MessageType.TIMEUPDATE:
          if (!duration) return;
          const percentage = ((value / duration) * 100).toFixed(2);
          if (Number(percentage) >= 90) {
            restartVideo();
          }
          break;
      }
    },
    [duration]
  );

  const handleFullScreen = () => {
    const fullScreenScript = `
      document.querySelector('.ytp-fullscreen-button').click();
    `;
    playerRef.current?.injectJavaScript(fullScreenScript);
  };

  const pauseVideo = () => {
    const pauseScript = `
      document.querySelector('video').pause();
    `;
    playerRef.current?.injectJavaScript(pauseScript);
  };

  const playVideo = () => {
    const playScript = `
      document.querySelector('.ytp-play-button').click();
    `;
    playerRef.current?.injectJavaScript(playScript);
  };

  const restartVideo = () => {
    const restartScript = `
      document.querySelector('video').currentTime = 0;
      document.querySelector('video').play();
    `;
    playerRef.current?.injectJavaScript(restartScript);
  };

  const seekVideo = (time: number) => {
    const seekScript = `
      document.querySelector('video').currentTime = ${time};
    `;
    playerRef.current?.injectJavaScript(seekScript);
  };

  const forwardVideo = (time: number) => {
    const forwardScript = `
      document.querySelector('video').currentTime += ${time};
    `;
    playerRef.current?.injectJavaScript(forwardScript);
  };

  const rewindVideo = (time: number) => {
    const rewindScript = `
      document.querySelector('video').currentTime -= ${time};
    `;
    playerRef.current?.injectJavaScript(rewindScript);
  };

  const handleDoubleClickRight = () => {
    forwardVideo(10);
  };

  const handleDoubleClickLeft = () => {
    rewindVideo(10);
  };

  const videoId = useMemo(() => {
    const url = new URL(video);
    return url.pathname;
  }, [video]);

  return (
    <WebView
      source={{
        uri: `https://www.youtube.com/embed/${videoId}?controls=1&autoplay=1&mute=1&fs=1&rel=0&modestbranding=1`,
      }}
      style={{
        backgroundColor: "transparent",
      }}
      javaScriptEnabled={true}
      bounces={false}
      originWhitelist={["*"]}
      allowsInlineMediaPlayback
      ref={playerRef}
      mediaPlaybackRequiresUserAction={false}
      allowsFullscreenVideo
      userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
      injectedJavaScript={`
             // add eventlister on youtube player
      const player = document.querySelector("video");
      player.addEventListener("play", () => {
      const message = {
          TYPE: "play",
          value: player.currentTime,
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
      });
      player.addEventListener("pause", () => {
      const message = {
          TYPE: "pause",
          value: player.currentTime,
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
      });
      player.addEventListener("ended", () => {
      const message = {
          TYPE: "ended",
          value: player.currentTime,
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
      });

      //event listerner for timeVideo
      player.addEventListener("timeupdate", () => {
      const message = {
          TYPE: "timeupdate",
          value: player.currentTime,
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
      });

      // add event listener for fullscreen
      player.addEventListener("webkitbeginfullscreen", () => {
      window.ReactNativeWebView.postMessage(JSON.stringify({ TYPE: "fullscreen" }));
      });`}
      onMessage={onMessage}
    />
  );
};

export default VideoPlayer;
