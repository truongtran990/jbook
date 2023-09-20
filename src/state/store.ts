import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

// import { ActionType } from "./action-types";
import reducers from "./reducers";

export const store = createStore(reducers, {}, applyMiddleware(thunk));

// store.dispatch({
//   type: ActionType.INSERT_CELL_AFTER,
//   payload: {
//     id: "001",
//     type: "code",
//   },
// });
// store.dispatch({
//   type: ActionType.INSERT_CELL_AFTER,
//   payload: {
//     id: "002",
//     type: "text",
//   },
// });
// store.dispatch({
//   type: ActionType.INSERT_CELL_AFTER,
//   payload: {
//     id: "003",
//     type: "code",
//   },
// });
// store.dispatch({
//   type: ActionType.INSERT_CELL_AFTER,
//   payload: {
//     id: "004",
//     type: "text",
//   },
// });
