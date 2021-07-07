import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styled from "styled-components";
const url = "https://arxiv.org/pdf/quant-ph/0410100.pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Test() {
  // https://arxiv.org/pdf/quant-ph/0410100.pdf

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(2);

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

  return (
    <>
      <Main className="main">
        <div className="d-flex mb-2 py-1 justify-content-end toggle-zoom">
          <div className="d-flex toggle-zoom-main">
            <button
              className="btn toggle-zoom-minus"
              onClick={() => setZoom((c) => c - 1)}
              disabled={zoom <= 2}
            >
              <i className="fas fa-search-minus"></i>
            </button>
            <button
              className="toggle-zoom-plus btn"
              onClick={() => setZoom((c) => c + 1)}
              disabled={zoom >= 5}
            >
              <i className="fas fa-search-plus"></i>
            </button>
          </div>
        </div>
        <Document
          file={url}
          className="pdfViewer"
          onLoadSuccess={onDocumentLoadSuccess}
          id="text"
        >
          <Page pageNumber={pageNumber} scale={zoom} className="pdfViewer_" />
        </Document>
        <div className=" mt-3 py-4 border-darken-4 text-dark control-nav">
          <div className="pdf-progress py-1 border border-5 rounded-pill mb-3">
            <div
              className="dot rounded-circle"
              style={{
                left: `${Math.round((pageNumber / numPages) * 100) - 2}%`,
              }}
            ></div>
          </div>
          <p className="text-end mb-2 fw-bold fs-5">
            {Math.round((pageNumber / numPages) * 100)}% read
          </p>
          <div className="d-flex control-nav-main justify-content-center align-items-center">
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
  user-select: none;
  width: 100%;
  min-height: 100vh;
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
      height: 1600px;
      overflow: auto;
      section {
        display: none !important;
      }
      canvas {
        direction: none;
        margin: 0 auto;
      }
    }
  }
  .control-nav {
    .pdf-progress {
      position: relative;
      height: 30px;
      display: flex;
      align-items: center;
      .dot {
        position: absolute;
        width: 30px;
        height: 30px;
        background: #a7a7a7;
      }
    }
    &-main {
      gap: 3rem;
    }
  }
`;
