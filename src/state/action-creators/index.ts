import { ActionType } from "../action-types";
import {
  Action,
  MoveCellAction,
  DeleteCellAction,
  InsertCellBeforeAction,
  UpdateCellAction,
} from "../actions";

// Here are action creator functions, which return the perspective action
export const updateCell = (): UpdateCellAction => {};
export const deleteCell = (): DeleteCellAction => {};
export const moveCell = (): MoveCellAction => {};
export const insertCellBefore = (): InsertCellBeforeAction => {};
