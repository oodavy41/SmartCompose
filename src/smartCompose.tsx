import React, { ComponentType, useEffect, useState, useRef } from "react";
import { fetchOrigin, debounceDelay } from "./config";

const fetchSuggestions = (input: string): Promise<string> => {
  console.log("fetch", input);
  if (fetchOrigin) {
    return new Promise<string>((resolve, reject) => {
      fetch(`http://${fetchOrigin}/api/smartCompose`, {
        method: "POST", headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input })
      }).then(res => res.json()
      ).then(json => resolve(json["completion"])).catch(e => reject(e));
    });
  }
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

function withSmartCompose<T extends ToSmartComposeProps >(
  WrappedComponent: ComponentType<T>
) {
  return (props: WithSmartComposeProps ) => {
    const ref = useRef<HTMLElement>(null);
    const [inputValue, setInputValue] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [pos, setPos] = useState(0);

    useEffect(() => {
      const onMouseUp = () => adjustCaretPosition(ref.current!)

      ref.current?.addEventListener('mouseup', onMouseUp);

      return () => {
        ref.current?.removeEventListener('mouseup', onMouseUp);
      };
    }, [ref.current]);

    useEffect(() => {
      const handler = setTimeout(() => {
        inputValue && fetchSuggestions(inputValue).then(setSuggestion).catch(e => console.error(e));
      }, debounceDelay);

      return () => {
        clearTimeout(handler);
      };
    }, [inputValue]);

    useEffect(() => {
      if (ref.current) {
        ref.current.innerHTML = inputValue + (suggestion ? ('<span style="color:gray">' + suggestion + "</span>") : "");
        restoreCaretPosition(ref.current!, pos);
      }
    }, [inputValue, suggestion]);

    const handleChange = (text: string, pos: number) => {
      setSuggestion("");
      setInputValue(text);
      setPos(pos);

      console.log("handleChange", text, pos);

      props.onChange(text);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Tab" && suggestion) {
        e.preventDefault();
        console.log("auto fill: ", suggestion);
        handleChange(inputValue + suggestion, pos + suggestion.length);
      }
      //adjustCaretPosition(ref.current!);
      props.onKeyDown?.(e);
    };

    return (
      <WrappedComponent
        ref={ref}
        {...props as unknown as T}
        onChange={handleChange}
        onKeyDown={handleKeyDown}></WrappedComponent>
    );
  };
}

export default withSmartCompose;


const restoreCaretPosition = (context: HTMLElement, position: number) => {
  const selection = window.getSelection();
  const range = document.createRange();
  range.setStart(context, 0);
  range.setEnd(context, 0);
  range.collapse(true);

  let currentNodePosition = 0;

  const walkNodes = (node: Node) => {
    if (!node) return;
    for (let childNode of node.childNodes) {
      console.log("walk", childNode, position);
      if (childNode.nodeType === 3) {
        const nextPosition = currentNodePosition + (childNode as Text).length;
        if (position <= nextPosition) {
          range.setStart(childNode, position - currentNodePosition);
          range.setEnd(childNode, position - currentNodePosition);
          console.log("range", position - currentNodePosition)
          selection?.removeAllRanges();
          selection?.addRange(range);
          return;
        }
        currentNodePosition = nextPosition;
      } else {
        walkNodes(childNode);
      }
    }
  };

  walkNodes(context);
};

const adjustCaretPosition = (context: HTMLElement) => {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return;

  let range = selection?.getRangeAt(0);
  let node: Node | null = range?.startContainer;

  while (node && node.parentNode !== context) {
    node = node.parentNode;
  }

  if (node && node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
    const textNode = document.createTextNode(' ');
    node.parentNode?.insertBefore(textNode, node);
    range.setStart(textNode, 0);
    range.setEnd(textNode, 0);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};