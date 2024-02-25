import React, { ComponentType, useEffect, useState } from "react";

const fetchSuggestions = async (input: string): Promise<string> => {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve("[suggesting]"), 500);
  });
};

export interface WithSmartComposeProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

function withSmartCompose<T extends WithSmartComposeProps>(
  WrappedComponent: ComponentType<T>
) {
  return (props: T) => {
    const [inputValue, setInputValue] = useState("");
    const [suggestion, setSuggestion] = useState("");

    useEffect(() => {
      if (inputValue) {
        fetchSuggestions(inputValue).then(setSuggestion);
      } else {
        setSuggestion("");
      }
    }, [inputValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      props.onChange(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Tab" && suggestion) {
        e.preventDefault();
        console.log("auto fill: ", suggestion);
        setInputValue(inputValue + suggestion);
        setSuggestion("");
      }
      props.onKeyDown(e);
    };

    return (
      <div style={{ position: "relative" }}>
        <WrappedComponent
          {...props}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {suggestion && (
          <div style={{ color: "grey", position: "absolute", top: 0, left: 0 }}>
            {inputValue}
            <span>{suggestion}</span>
          </div>
        )}
      </div>
    );
  };
}

export default withSmartCompose;
