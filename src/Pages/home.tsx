import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <Link to="/entities">Kisi veya Kurumlar</Link>
      <Link to="/entities/new">Yeni Ekle</Link>
    </div>
  );
}
