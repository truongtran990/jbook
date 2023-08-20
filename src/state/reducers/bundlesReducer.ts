import { produce } from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";

interface BundlesState {
  [key: string]: {
    loading: boolean;
    code: string;
    err: string;
  };
}
const initialBundlesState: BundlesState = {};

const reducer = produce(
  (state: BundlesState = initialBundlesState, action: Action): BundlesState => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        return state;
      case ActionType.BUNDLE_COMPLETE:
        return state;
      default:
        return state;
    }
  }
);

export default reducer;
