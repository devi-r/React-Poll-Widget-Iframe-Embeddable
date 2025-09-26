# React Poll Widget

A poll widget built with React that can be easily **embedded as an iframe in any website**.

## Demo

- **Widget Route**: [https://react-poll-widget.onrender.com](https://react-poll-widget.onrender.com) - Standalone widget for iframe embedding
- **Iframe Demo**: [https://react-poll-widget.onrender.com/demo.html](https://react-poll-widget.onrender.com/demo.html) - **Basic HTML page demonstrating iframe embedding**

### What the Demo Shows

The `demo.html` page demonstrates:

- **Iframe Embedding**: Shows how the React widget is embedded in a basic HTML page
- **Visual Indicators**: Clear badges and borders showing HTML vs React content
- **Cross-Origin Communication**: Real-time height adjustment between iframe and parent
- **Seamless Integration**: Widget appears as part of the website while maintaining isolation

The demo page is a **basic HTML file** (not a React app) that contains:

- HTML content sections (marked with orange indicators)
- An embedded React widget (marked with blue indicators)
- Real-world example of how the widget integrates into existing websites

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Embedding the Widget

### Basic Embed

Copy this code to embed the poll widget in your website:

```html
<iframe
  src="https://react-poll-widget.onrender.com/poll-widget"
  width="500"
  height="400"
  frameborder="0"
  scrolling="no"
>
</iframe>
```

> Check out the [demo.html](https://react-poll-widget.onrender.com/demo.html) page to see a real example of iframe embedding in action!

### Customizing the Poll

You can customize the poll by sending a message to the iframe:

```javascript
// Get the iframe element
const iframe = document.querySelector("iframe");

// Wait for the widget to be ready
iframe.addEventListener("load", () => {
  iframe.contentWindow.postMessage(
    {
      type: "POLL_CONFIG",
      config: {
        pollId: "my-custom-poll",
        question: "What is your favorite color?",
        options: ["Red", "Blue", "Green", "Yellow"],
      },
    },
    "*"
  );
});
```

### Listening for Votes

Listen for when users vote:

```javascript
window.addEventListener("message", (event) => {
  if (event.data.type === "POLL_VOTE") {
    console.log("User voted:", event.data.selectedOption);
    console.log("All votes:", event.data.votes);
    console.log("Poll ID:", event.data.pollId);
  }
});
```

## API Reference

### Poll Configuration

The poll widget accepts the following configuration:

```javascript
{
  pollId: 'unique-poll-identifier',    // Required: Unique ID for the poll
  question: 'Your poll question?',     // Required: The poll question
  options: ['Option 1', 'Option 2']    // Required: Array of poll options
}
```

### Message Types

#### From Parent to Widget

- `POLL_CONFIG` - Configure the poll with custom question and options

#### From Widget to Parent

- `POLL_WIDGET_READY` - Widget is ready to receive configuration
- `POLL_VOTE` - User has voted (includes selected option and all votes)
