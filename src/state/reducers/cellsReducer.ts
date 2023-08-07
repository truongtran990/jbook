import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

// define the interface for state
interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

// initial state varialbe
const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

// define the reducer object, that will receive the current state, and action and then return the new state
const reducer = (
  state: CellsState = initialState,
  action: Action
): CellsState => {
  return state;
};

export default reducer;
