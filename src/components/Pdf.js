import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styled from "styled-components";

const url = "https://arxiv.org/pdf/quant-ph/0410100.pdf";

const Test = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [localUrl, setLocalUrl] = useState(null);

  /*To Prevent right click on screen*/
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  /*When document gets loaded successfully*/
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
    setZoom(1);
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

  const getPdf = (e) => {
    const doc = e.target.files[0];
    const data = [];
    data.push(doc);
    const urlDoc = window.URL.createObjectURL(
      new Blob(data, { type: "application/pdf" })
    );
    setLocalUrl(urlDoc);
  };

  return (
    <main className="bg-light">
      <section className="py-2 flex-grow-1">
        <Main className="main container">
          <form className="mb-2">
            <input
              type="file"
              className="form-control"
              onChange={(e) => getPdf(e)}
              placeholder="upload PDF..."
            />
          </form>
          <div className="d-flex mb-2 py-1 justify-content-end toggle-zoom">
            <div className="d-flex toggle-zoom-main">
              <button
                className="btn toggle-zoom-minus"
                onClick={() => setZoom((c) => c - 1)}
                disabled={zoom <= 1}
                aria-label="zoom out"
              >
                <i className="fas fa-search-minus"></i>
              </button>
              <button
                className="toggle-zoom-plus btn"
                onClick={() => setZoom((c) => c + 1)}
                disabled={zoom >= 5}
                aria-label="zoom in"
              >
                <i className="fas fa-search-plus"></i>
              </button>
            </div>
          </div>
          <Document
            file={localUrl ? localUrl : url}
            className="pdfViewer"
            onLoadSuccess={onDocumentLoadSuccess}
            id="text"
            renderMode="canvas"
            onLoadError={() => {
              setLocalUrl(null);
              alert(`Can't load pdf`);
            }}
            error={`cant't load PDF`}
            loading="loading........."
          >
            <Page pageNumber={pageNumber} scale={zoom} className="pdfViewer_" />
          </Document>
          <div className=" mt-1 py-1 border-darken-4 text-dark control-nav">
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped"
                role="progressbar"
                style={{
                  width: `${Math.round((pageNumber / numPages) * 100)}%`,
                }}
                aria-label="progress"
                aria-valuenow={pageNumber}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
            <p className="text-end mb-1 fw-bold fs-5">
              {Math.round((pageNumber / numPages) * 100)}% read
            </p>
            <div className="d-flex control-nav-main justify-content-center align-items-center">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={previousPage}
                className="Pre btn p-0 bg-transparent"
                aria-label="arrow left"
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
                aria-label="arrow right"
              >
                <i className="fas fa-2x fa-caret-right"></i>
              </button>
            </div>
          </div>
        </Main>
      </section>
    </main>
  );
};

export default Test;
const Main = styled.div`
  user-select: none;
  width: 90%;
  max-width: 100000000px;
  min-height: 95vh;
  .toggle-zoom {
    &-main {
      gap: 2rem;
      i {
        font-size: 2rem;
      }
    }
  }
  .pdfViewer {
    width: 100% !important;
    margin: 0 auto;
    &_ {
      /* min-height: 90vh; */
      overflow: auto;
      section {
        display: none !important;
      }
      canvas {
        direction: none;
        margin: 0 auto;
        /* height: auto !important; */
        width: inherit !important;
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
