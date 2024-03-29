import React from "react";
import Markdown from "markdown-to-jsx";
import fp from "lodash/fp";

import { Modal } from "./components";

import useMarkdown from "./hooks/useMarkdown";
import { matrixReducer, rowColReducer } from "./reducers";

import "./styles.css";
import coursework from "../coursework.md";

const initalRowCol = {
  rows: 0,
  cols: 0,
  isSubmited: false
};

const initialMatrix = {
  values: [[]],
  isSubmited: false
};

function createEmptyMatrix(rowCol) {
  return fp.times(() => fp.times(() => null, rowCol.cols), rowCol.rows);
}

export default function App() {
  const [showModal, setShowModal] = React.useState(false);
  const [isLightMode, setIsLightMode] = React.useState(true);
  const courseworkMd = useMarkdown(coursework);
  const [rowCol, dispatchRowCol] = React.useReducer(
    rowColReducer,
    initalRowCol
  );
  const [matrix, dispatchMatrix] = React.useReducer(
    matrixReducer,
    initialMatrix
  );

  function handleSubmitRowCol(event) {
    event.preventDefault();

    dispatchMatrix({
      type: "setMatrix",
      payload: { values: createEmptyMatrix(rowCol) }
    });
    dispatchRowCol({
      type: "submit"
    });
    setShowModal(true);
  }

  function handleSubmitMatrix(event) {
    event.preventDefault();

    dispatchMatrix({ type: "submit" });
    console.log(matrix);
  }

  function convertToText(matrixValues) {
    fp.reduce = fp.reduce.convert({ cap: false });

    const average = fp.reduce(
      (acc, curr, _, arr) => [
        ...acc,
        fp.reduce((acc, curr) => (acc += curr), 0, curr) / arr.length
      ],
      [],
      matrixValues
    );

    return fp.reduce(
      (acc, curr, i, arr) => {
        if (i === 0) {
          return `averageArr: [${curr}, `;
        } else if (i < arr.length - 1) {
          return `${acc} ${curr}, `;
        } else {
          return `${acc} ${curr}]`;
        }
      },
      "",
      average
    );
  }

  function isMatrixNotFilled(matrix) {
    console.log("matrix", matrix.values);
    const sum = fp.reduce(
      (acc, curr) =>
        acc +
        fp.reduce((acc, curr) => (curr !== null ? acc + 1 : acc), 0, curr),
      0,
      matrix.values
    );

    console.log("sum", sum);

    return sum !== rowCol.rows * rowCol.cols;
  }

  return (
    <div className="App">
      <div
        className="change-theme-btn"
        style={{ backgroundColor: isLightMode ? "black" : "white" }}
        onClick={() => setIsLightMode(!isLightMode)}
      >
        <span role="img" aria-label="sheep">
          {isLightMode ? "🌞" : "🌚"}
        </span>
      </div>
      <div className="task-description">
        <Markdown>{courseworkMd}</Markdown>
      </div>
      <div className="form-container">
        <form className="form" onSubmit={handleSubmitRowCol}>
          <label className="form-input">
            <span>m </span>
            <input
              value={rowCol.rows}
              onChange={(event) =>
                dispatchRowCol({
                  type: "setRows",
                  payload: { value: event.target.value }
                })
              }
            />
          </label>
          <label className="form-input">
            <span>n </span>
            <input
              value={rowCol.cols}
              onChange={(event) =>
                dispatchRowCol({
                  type: "setCols",
                  payload: {
                    value: event.target.value
                  }
                })
              }
            />
          </label>
          <button disabled={!rowCol.rows || !rowCol.cols} type="submit">
            Въведи...
          </button>
        </form>
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <form className="matrix" onSubmit={handleSubmitMatrix}>
            <div
              className="matrix-inputs"
              style={{
                gridTemplateRows: `repeat(${rowCol.rows}, 80px)`,
                gridTemplateColumns: `repeat(${rowCol.cols}, 80px)`
              }}
            >
              {fp.times(
                (i) =>
                  fp.times(
                    (j) => (
                      <label key={`${i}-${j}`}>
                        <input
                          onChange={(event) =>
                            dispatchMatrix({
                              type: "setMatrixValue",
                              payload: { value: event.target.value, i, j }
                            })
                          }
                        />
                      </label>
                    ),
                    rowCol.cols
                  ),
                rowCol.rows
              )}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="matrix-submit-btn"
              type="submit"
            >
              Close
            </button>
            <button
              // onClick={() => setShowModal(false)}
              disabled={isMatrixNotFilled(matrix)}
              className="matrix-submit-btn"
              type="submit"
            >
              Submit
            </button>
          </form>
        </Modal>
        {matrix.isSubmited && <p>{convertToText(matrix.values)}</p>}
      </div>
    </div>
  );
}
