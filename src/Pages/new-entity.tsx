import { useState } from "react";
import { DefterDb, Entity } from "../db";

const db = new DefterDb();

function NewEntity() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [note, setNote] = useState("");

  function resetForm() {
    setName("");
    setPhoneNumber("");
    setNote("");
  }
  return (
    <>
      <form
        className="p-2 m-2 flex rounded-sm flex-col gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          const newCustomer: Entity = {
            name,
            phoneNumber,
            note,
          };
          console.log(newCustomer);
          db.entities.add(newCustomer).then(resetForm);
        }}
      >
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="p-2 bg-inherit border-white border-2 rounded"
          placeholder="isim"
        />
        <input
          onChange={(e) => {
            const val = e.target.value;
            setPhoneNumber(val);
            // if (
            //   !val.match(
            //     /^(((\+|00)?(90)|0)[-| ]?)?((5\d{2})[-| ]?(\d{3})[-| ]?(\d{2})[-| ]?(\d{2}))$/gm
            //   )
            // ) {
            //   e.target.style.borderColor = "red";
            // }
          }}
          value={phoneNumber}
          className="p-2 bg-inherit border-white border-2 rounded"
          placeholder="telefon"
        />
        <input
          onChange={(e) => setNote(e.target.value)}
          value={note}
          className="p-2 bg-inherit border-white border-2 rounded"
          placeholder="not"
        />
        <button>kaydet</button>
      </form>
    </>
  );
}

export default NewEntity;
