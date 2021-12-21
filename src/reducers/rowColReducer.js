import fp from "lodash/fp";

export default function rowColReducer(state, action) {
  switch (action.type) {
    case "setRows":
      return {
        ...state,
        rows: action.payload.value ? parseInt(action.payload.value, 10) : ""
      };
    case "setCols":
      return {
        ...state,
        cols: action.payload.value ? parseInt(action.payload.value, 10) : ""
      };
    case "submit":
      return { ...state, isSubmited: true };
    default:
      throw new Error();
  }
}
