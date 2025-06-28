import React, { useState, useEffect, useRef } from "react";
import PollWidget from "./PollWidget";

function PollWidgetPage() {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [pollConfig, setPollConfig] = useState({
    pollId: "demo-poll",
    question: "What is your favorite programming language?",
    options: ["JavaScript", "Python", "Java", "C++", "Go"],
  });
  const widgetRef = useRef(null);

  useEffect(() => {
    // Check if the app is running in an iframe
    if (window.parent !== window) {
      setIsEmbedded(true);

      // Listen for messages from parent window
      const handleMessage = (event) => {
        if (event.data.type === "POLL_CONFIG") {
          setPollConfig(event.data.config);
        }
      };

      window.addEventListener("message", handleMessage);

      // Notify parent that widget is ready
      window.parent.postMessage(
        {
          type: "POLL_WIDGET_READY",
          pollId: pollConfig.pollId,
        },
        "*"
      );

      return () => {
        window.removeEventListener("message", handleMessage);
      };
    }
  }, [pollConfig.pollId]);

  // Send height updates to parent window when embedded
  useEffect(() => {
    if (isEmbedded && widgetRef.current) {
      const sendHeight = () => {
        const height = Math.max(widgetRef.current.scrollHeight, 200); // Minimum height of 200px
        window.parent.postMessage(
          {
            type: "WIDGET_HEIGHT",
            height: height,
          },
          "*"
        );
      };

      // Send initial height
      sendHeight();

      // Set up ResizeObserver to watch for height changes
      const resizeObserver = new ResizeObserver(() => {
        sendHeight();
      });

      resizeObserver.observe(widgetRef.current);

      // Also send height after a short delay to catch any dynamic content
      const timeoutId = setTimeout(sendHeight, 100);

      // Send height again after a longer delay to ensure all content is loaded
      const longTimeoutId = setTimeout(sendHeight, 500);

      return () => {
        resizeObserver.disconnect();
        clearTimeout(timeoutId);
        clearTimeout(longTimeoutId);
      };
    }
  }, [isEmbedded, pollConfig]);

  return (
    <div className="App embedded" ref={widgetRef}>
      <PollWidget {...pollConfig} />
    </div>
  );
}

export default PollWidgetPage;
