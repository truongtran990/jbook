import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";

// use this to understand the type of data that is stored inside of our state
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
