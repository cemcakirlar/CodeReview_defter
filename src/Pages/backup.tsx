import FileSaver from "file-saver";
import { prepareContentFromDb } from "../backup-handler";
import { Link } from "react-router-dom";
const today = new Date();

export default function Backup() {
  async function saveToFile() {
    const data = await prepareContentFromDb();
    
    var blob = new Blob([data], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, `YEDEK[${getLocaleDate(today)}].txt`);
  }
  return (
    <div className="flex flex-col items-center justify-around h-[50vh]">
      <button
        className="text-xl font-bold underline"
        onClick={saveToFile}
      >
        Yedek Dosyasini Kaydet
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

function getLocaleDate(ms: Date | undefined) {
  return ms?.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // dateStyle:'long'
  });
}
