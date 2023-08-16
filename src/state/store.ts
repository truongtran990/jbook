import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { ActionType } from "./action-types";
import reducers from "./reducers";

export const store = createStore(reducers, {}, applyMiddleware(thunk));

store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: "001",
    type: "code",
  },
});
store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: "002",
    type: "text",
  },
});
