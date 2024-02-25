import React, { useEffect, useRef, useState, forwardRef } from "react";
import "./App.css";

import withSmartCompose, { ToSmartComposeProps } from "./smartCompose";

const EditableDiv = forwardRef<HTMLDivElement, ToSmartComposeProps>(
  (props, ref) => {
    useEffect(() => {
      const currentElement = ref as React.RefObject<HTMLDivElement>;
      const handleInput = (e: Event) => {
        const target = e.target as HTMLElement;
        props.onChange(
          target.innerHTML.split('<span style="color:gray">')[0],
          window.getSelection()?.focusOffset || 0
        );
        console.log(window.getSelection());
      };

      if (currentElement.current) {
        currentElement.current.addEventListener("input", handleInput);
      }

      return () => {
        if (currentElement.current) {
          currentElement.current.removeEventListener("input", handleInput);
        }
      };
    }, [ref, props]);

    return (
      <div
        style={{
          minHeight: 100,
          border: "1px solid #ccc",
          padding: 10,
          width: 400,
          textAlign: "left",
        }}
        ref={ref}
        contentEditable
        // onChange={props.onChange}
        onKeyDown={props.onKeyDown}
      />
    );
  }
);

function App() {
  const SmartEditableDiv = withSmartCompose(EditableDiv);

  return (
    <>
      <div>
        <h2>TEST</h2>
        =====
        <SmartEditableDiv onChange={(text) => console.log(text)} />
        =====
      </div>
    </>
  );
}

export default App;
