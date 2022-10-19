import { useState } from "react";
import { Tau } from "../schema";

const UnitSelect = (unit) => {};

const Page = () => {
  const [unitsInArmy, addUnitToArmy] = useState<Array<{}>>([]);
  console.log(Tau);
  return (
    <div>
      <h1>Select Units</h1>
      <button>Add unit</button>
      {unitsInArmy.map((a) => (
        <div>{a.name}</div>
      ))}
      <div>Points total: 0</div>
    </div>
  );
};

export default Page;
