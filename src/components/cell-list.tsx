import { Fragment } from "react";

import "./cell-list.css";
import { useTypedSelector } from "../hooks/use-typed-selector";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";

const CellList: React.FC = () => {
  //@ts-ignore
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id: string) => data[id]);
  });

  const renderedCells = cells.map((cell: any) => (
    <Fragment key={cell.id}>
      <CellListItem key={cell.id} cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
