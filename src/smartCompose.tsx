import React, { ComponentType, useEffect, useState, useRef } from "react";

const fetchSuggestions = (input: string): Promise<string> => {
  console.log("fetch", input);
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve("[suggesting]"), 500);
  });
};

export interface WithSmartComposeProps {
  onChange: (text: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export interface ToSmartComposeProps {
  onChange: (text: string, pos: number) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

function withSmartCompose<T extends ToSmartComposeProps & HTMLElement>(
  WrappedComponent: ComponentType<T>
) {
  return (props: WithSmartComposeProps) => {
    const ref = useRef<T>(null);
    const [inputValue, setInputValue] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [pos, setPos] = useState(0);

    useEffect(() => {
      fetchSuggestions(inputValue).then(setSuggestion);
    }, [inputValue]);

    useEffect(() => {
      if (ref.current) {
        ref.current.innerHTML =
          inputValue + '<span style="color:gray">' + suggestion + "</span>";
      }
    }, [inputValue, suggestion]);

    const handleChange = (text: string, pos: number) => {
      console.log("handleChange", text);
      setInputValue(text);
      setPos(pos);

      window.getSelection()?.collapse(ref.current?.childNodes[0] as Node, pos);

      props.onChange(text);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Tab" && suggestion) {
        e.preventDefault();
        console.log("auto fill: ", suggestion);
        handleChange(inputValue + suggestion, pos + suggestion.length);
        setSuggestion("");
      }
      props.onKeyDown?.(e);
    };

    return (
      <WrappedComponent
        ref={ref}
        {...props}
        onChange={handleChange}
        onKeyDown={handleKeyDown}></WrappedComponent>
    );
  };
}

export default withSmartCompose;
