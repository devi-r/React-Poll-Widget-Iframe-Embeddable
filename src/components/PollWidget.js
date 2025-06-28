import React, { useState, useEffect } from "react";
import "./PollWidget.css";
import PollForm from "./PollForm";

const getDummyVotes = (options) => {
  // Generate some dummy votes for demo
  const base = [5, 3, 2, 1, 0, 0];
  const votes = {};
  options.forEach((option, i) => {
    votes[option] = base[i] !== undefined ? base[i] : 0;
  });
  return votes;
};

const PollWidget = ({ pollId = "", question = "", options = [] }) => {
  const [votes, setVotes] = useState(() => {
    // Try to load from localStorage, else use dummy
    const savedVotes = localStorage.getItem(`poll_${pollId}`);
    if (savedVotes) return JSON.parse(savedVotes);
    return getDummyVotes(options);
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(() =>
    Object.values(votes).reduce((sum, count) => sum + count, 0)
  );
  const [userVote, setUserVote] = useState(null);

  // Load votes from localStorage on component mount
  useEffect(() => {
    const savedVotes = localStorage.getItem(`poll_${pollId}`);
    const savedUserVote = localStorage.getItem(`poll_vote_${pollId}`);

    if (savedVotes) {
      const parsedVotes = JSON.parse(savedVotes);
      setVotes(parsedVotes);
      setTotalVotes(
        Object.values(parsedVotes).reduce((sum, count) => sum + count, 0)
      );
    } else {
      const initialVotes = getDummyVotes(options);
      setVotes(initialVotes);
      setTotalVotes(
        Object.values(initialVotes).reduce((sum, count) => sum + count, 0)
      );
    }

    if (savedUserVote) {
      setHasVoted(true);
      setUserVote(savedUserVote);
    }
  }, [pollId, options]);

  const handleVote = (selectedOption) => {
    if (hasVoted) return;

    const newVotes = { ...votes };
    newVotes[selectedOption] = (newVotes[selectedOption] || 0) + 1;

    setVotes(newVotes);
    setTotalVotes(totalVotes + 1);
    setHasVoted(true);
    setUserVote(selectedOption);

    // Save to localStorage
    localStorage.setItem(`poll_${pollId}`, JSON.stringify(newVotes));
    localStorage.setItem(`poll_vote_${pollId}`, selectedOption);

    // Post message to parent window if embedded
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: "POLL_VOTE",
          pollId,
          selectedOption,
          votes: newVotes,
        },
        "*"
      );
    }
  };

  // Send height update when voting state changes
  useEffect(() => {
    if (window.parent !== window) {
      // Small delay to ensure DOM has updated
      const timeoutId = setTimeout(() => {
        const height = document.querySelector(".poll-widget")?.scrollHeight;
        if (height) {
          window.parent.postMessage(
            {
              type: "WIDGET_HEIGHT",
              height: height,
            },
            "*"
          );
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [hasVoted, votes, totalVotes]);

  const resetPoll = () => {
    const initialVotes = getDummyVotes(options);
    setVotes(initialVotes);
    setTotalVotes(
      Object.values(initialVotes).reduce((sum, count) => sum + count, 0)
    );
    setHasVoted(false);
    setUserVote(null);
    localStorage.removeItem(`poll_${pollId}`);
    localStorage.removeItem(`poll_vote_${pollId}`);
  };

  return (
    <div className="poll-widget">
      <div className="poll-header">
        <h3 className="poll-question">{question}</h3>
        {totalVotes > 0 && (
          <span className="poll-total-votes">
            {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <PollForm
        options={options}
        onVote={handleVote}
        votes={votes}
        totalVotes={totalVotes}
        hasVoted={hasVoted}
        userVote={userVote}
        onReset={resetPoll}
      />
    </div>
  );
};

export default PollWidget;
