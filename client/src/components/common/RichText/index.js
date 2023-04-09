/* eslint-disable react/function-component-definition */
import React, { useEffect } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  DefaultEditor,
  Editor,
  EditorProvider,
  HtmlButton,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";

export default function MyEditor({ setValueHtml, htmlValue }) {
  const [html, setHtml] = React.useState(htmlValue);

  function onChange(e) {
    setHtml(e.target.value);
    setValueHtml(e.target.value);
  }

  // useEffect(() => {
  //   setHtml(htmlValue);
  // }, []);

  return (
    <div>
      <EditorProvider>
        <Editor value={html} onChange={onChange}>
          <Toolbar>
            <BtnUndo />
            <BtnRedo />
            <Separator />
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
            <BtnClearFormatting />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}
