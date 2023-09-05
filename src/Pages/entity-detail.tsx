import { useParams } from "react-router-dom";
import { DefterDb, Entity } from "../db";
import { useEffect, useState } from "react";

const db = new DefterDb();
export default function EntityDetail() {
  const { entityId } = useParams();
  const [entity, setEntity] = useState(undefined as Entity | undefined);
  useEffect(() => {
    if (
      entityId &&
      typeof entityId === "string" &&
      !Number.isNaN(parseInt(entityId))
    ) {
      db.entities.get(parseInt(entityId)).then((rec) => setEntity(rec));
    }
  }, [entityId]);
  return (
    <div className="flex flex-col w-1/2">
      <h2 className="text-xl">{entity?.name}</h2>
      <span>Tel: {entity?.phoneNumber}</span>
      <span>Not: {entity?.note}</span>
    </div>
  );
}
