import { useTypedSelector } from "../hooks/use-typed-selector";
import CellListItem from "./cell-list-item";

const CellList: React.FC = () => {
  //@ts-ignore
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id: string) => data[id]);
  });

  const renderedCells = cells.map((cell) => (
    <CellListItem key={cell.id} cell={cell} />
  ));

  return <ul>{renderedCells}</ul>;
};

export default CellList;
