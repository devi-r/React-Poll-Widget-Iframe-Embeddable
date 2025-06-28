import React, { useState } from "react";
import PollWidget from "./PollWidget";

function HomePage() {
  const [pollConfig] = useState({
    pollId: "demo-poll",
    question: "What is your favorite programming language?",
    options: ["JavaScript", "Python", "Java", "C++", "Go"],
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Poll Widget</h1>
        <p>A customizable poll widget that can be embedded as an iframe</p>
      </header>

      <main className="App-main">
        <section className="demo-section">
          <h2>Live Demo</h2>
          <PollWidget {...pollConfig} />
        </section>

        <section className="embed-section">
          <h2>Embed Code</h2>
          <p>Copy this code to embed the poll widget in your website:</p>
          <div className="embed-code">
            <pre>
              {`<iframe 
  src="${window.location.origin}/poll-widget"
  width="500" 
  height="400" 
  frameborder="0"
  scrolling="no">
</iframe>`}
            </pre>
          </div>

          <h3>Customize Poll</h3>
          <p>You can customize the poll by sending a message to the iframe:</p>
          <div className="embed-code">
            <pre>
              {`// Get the iframe element
const iframe = document.querySelector('iframe');

// Wait for the widget to be ready
iframe.addEventListener('load', () => {
  iframe.contentWindow.postMessage({
    type: 'POLL_CONFIG',
    config: {
      pollId: 'my-custom-poll',
      question: 'What is your favorite color?',
      options: ['Red', 'Blue', 'Green', 'Yellow']
    }
  }, '*');
});`}
            </pre>
          </div>

          <h3>Listen for Votes</h3>
          <p>Listen for when users vote:</p>
          <div className="embed-code">
            <pre>
              {`window.addEventListener('message', (event) => {
  if (event.data.type === 'POLL_VOTE') {
    console.log('User voted:', event.data.selectedOption);
    console.log('All votes:', event.data.votes);
  }
});`}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
