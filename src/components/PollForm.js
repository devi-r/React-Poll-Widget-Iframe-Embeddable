import React, { useState } from "react";
import "./PollForm.css";

const PollForm = ({
  options,
  onVote,
  votes = {},
  totalVotes = 0,
  hasVoted = false,
  userVote = null,
  onReset,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionClick = (option) => {
    if (hasVoted) return; // No selection in results mode
    setSelectedOption(option);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption || hasVoted) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onVote(selectedOption);
      setIsSubmitting(false);
    }, 300);
  };

  const getPercentage = (option) => {
    if (totalVotes === 0) return 0;
    return (((votes[option] || 0) / totalVotes) * 100).toFixed(1);
  };

  return (
    <form className="poll-form" onSubmit={handleSubmit}>
      <div className="poll-options">
        {options.map((option, index) => {
          const voteCount = votes[option] || 0;
          const percentage = getPercentage(option);
          const isSelected = selectedOption === option;
          const isUserVote = userVote === option;

          return (
            <div
              key={index}
              className={`poll-option ${hasVoted ? "result" : ""} ${
                isSelected ? "selected" : ""
              } ${isUserVote ? "user-vote" : ""}`}
              onClick={() => handleOptionClick(option)}
            >
              <input
                type="radio"
                name="poll-option"
                value={option}
                checked={isSelected}
                onChange={() => handleOptionClick(option)}
                id={`option-${index}`}
                disabled={hasVoted}
                className="hidden-radio"
              />

              <div className="poll-option-bar">
                <span className="option-label">{option}</span>
                {hasVoted && (
                  <span className="vote-count">{voteCount} votes</span>
                )}
                {hasVoted && <span className="percentage">{percentage}%</span>}
              </div>

              <div
                className={`poll-progress ${hasVoted ? "voted" : ""} ${
                  isUserVote ? "user-voted" : ""
                }`}
                style={{
                  width: hasVoted
                    ? `${percentage}%`
                    : isSelected
                    ? "100%"
                    : "0%",
                }}
              />
            </div>
          );
        })}
      </div>

      {!hasVoted ? (
        <button
          type="submit"
          className={`vote-button ${!selectedOption ? "disabled" : ""}`}
          disabled={!selectedOption || isSubmitting}
        >
          {isSubmitting ? "Voting..." : "Vote"}
        </button>
      ) : (
        <div className="results-footer">
          <button type="button" className="reset-button" onClick={onReset}>
            Reset Poll
          </button>
        </div>
      )}
    </form>
  );
};

export default PollForm;
