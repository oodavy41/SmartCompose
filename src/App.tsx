import React, { useEffect, forwardRef } from "react";

import withSmartCompose, { ToSmartComposeProps } from "./smartCompose";

export const EditableDiv = forwardRef<HTMLDivElement, ToSmartComposeProps & Partial<HTMLElement>>(
  (props, ref) => {
    useEffect(() => {
      const currentElement = ref as React.RefObject<HTMLDivElement>;
      const handleInput = (e: Event) => {
        const target = e.target as HTMLElement;
        console.log("on input html: ", target.innerHTML, target.innerHTML.split('<span style="color:gray">')[0])

        const range = window.getSelection()?.getRangeAt(0);
        let caretPosition = 0;
        if (range) {
          range.setStart(currentElement.current!, 0);
          caretPosition = range.toString().length;
        }
        props.onChange(
          target.innerHTML.split('<span style="color:gray">')[0],
          caretPosition
        );


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
          width: 400,// @ts-ignore
          textAlign: "left",
        }}
        ref={ref}
        {...props}
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
        <SmartEditableDiv onChange={(text) => console.log(text)} />
      </div>
    </>
  );
}

export default App;
