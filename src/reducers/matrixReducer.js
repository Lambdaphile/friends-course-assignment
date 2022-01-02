import fp from "lodash/fp";

fp.map = fp.map.convert({ cap: false });

export default function matrixReducer(state, action) {
  switch (action.type) {
    case "setMatrix":
      return { ...state, values: action.payload.values };
    case "setMatrixValue":
      return {
        ...state,
        values: fp.map(
          (row, i) =>
            fp.map(
              (n, j) =>
                i === action.payload.i && j === action.payload.j
                  ? fp.parseInt(action.payload.value, 10)
                  : n,
              row
            ),
          state.values
        )
      };
    case "submit":
      return { ...state, isSubmited: true };
    default:
      throw new Error();
  }
}
