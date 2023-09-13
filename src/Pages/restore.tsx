import { useState } from "react";
import { saveToDb } from "../backup-handler";
import { Link } from "react-router-dom";

export default function Restore() {
  const [result, setResult] = useState("Henüz dosya seçilmedi");
  const [data, setData] = useState("");
  function onchange(e: React.ChangeEvent<HTMLInputElement>) {
    var file = e.target?.files?.[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (event) {
      // The file's text will be printed here
      if (typeof event.target?.result === "string") {
        setData(event.target?.result);
        setResult("Yüklenmeye Hazir");
      } else {
        //hata
      }
    };
    reader.readAsText(file);
  }

  async function runSave() {
    const result = await saveToDb(data);
    if (result.length == 0) {
      setResult("Tamamlandi");
    } else {
      setResult(result);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <span className="text-xl">
        Tüm kayitlar silinip yerine dosyadakiler eklenecek
      </span>
      <input
        type="file"
        // accept="txt"

        onChange={onchange}
      />
      <span>{result}</span>

      <button
        disabled={data.length == 0}
        onClick={runSave}
        className={`disabled:text-gray-400 text-2xl underline`}
      >
        Seçilen dosyadan yükle
      </button>
      <Link
        to={`/`}
        className="text-center w-full block underline underline-offset-4"
      >
        Geri
      </Link>
    </div>
  );
}
