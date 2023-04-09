import { useState } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";

export default function MyDocument({ uri }) {
  const docs = [{ uri }];
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  console.log(uri);

  return (
    // <DocViewer
    //   documents={docs}
    //   style={{ height: "85vh" }}
    //   pluginRenderers={DocViewerRenderers}
    //   config={{ header: { disableHeader: true } }}
    // />
    <iframe
      src={uri}
      style={{ width: "100%", height: "100%" }}
      target="_blank"
    />
  );
}
