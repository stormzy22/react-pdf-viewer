import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styled from "styled-components";

const url = "https://arxiv.org/pdf/quant-ph/0410100.pdf";

export default function Test() {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  /*To Prevent right click on screen*/
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  /*When document gets loaded successfully*/
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function search() {
    let text = document.querySelectorAll("span");
    console.log(text);
    let txt_to_search = "hi";
    txt_to_search = txt_to_search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let pattern = new RegExp(`${txt_to_search}`, "gi");
    text.innerHTML = text.textContent.replace(
      pattern,
      (match) => `<mark class="bg-warning">${match}</mark>`
    );
  }

  return (
    <>
      <Main className="main">
        <div className="d-flex mb-2 py-1 justify-content-end toggle-zoom">
          <div className="d-flex toggle-zoom-main">
            <button className="btn toggle-zoom-minus">
              <i className=" text-white fas fa-search-minus"></i>
            </button>
            <button className="toggle-zoom-plus btn">
              <i className=" text-white fas fa-search-plus"></i>
            </button>
          </div>
        </div>
        <Document
          file={url}
          className="pdfViewer"
          onLoadSuccess={onDocumentLoadSuccess}
          id="text"
        >
          <Page pageNumber={pageNumber} scale={1.5} className="pdfViewer_" />
        </Document>
        <div className="bg-warning mt-3 py-4 control-nav">
          <div className="d-flex bg-danger control-nav-main justify-content-center align-items-center">
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
              className="Pre btn p-0 bg-transparent"
            >
              <i className="fas fa-2x fa-caret-left"></i>
            </button>
            <div className="pagec">
              Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
            </div>
            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
              className="btn p-0 bg-transparent"
            >
              <i className="fas fa-2x fa-caret-right"></i>
            </button>
          </div>
        </div>
      </Main>
    </>
  );
}

const Main = styled.div`
  width: 100%;
  min-height: 90vh;
  .toggle-zoom {
    &-main {
      gap: 2rem;
      i {
        font-size: 2rem;
      }
    }
  }
  .pdfViewer {
    min-height: inherit !important;
    &_ {
      min-height: inherit;
      overflow: auto;
      section {
        display: none !important;
      }
      canvas {
        direction: none;
        margin: 0 auto;
        min-height: inherit;
      }
    }
  }
  .control-nav {
    &-main {
      gap: 3rem;
    }
  }
`;
