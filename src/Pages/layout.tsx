import { Outlet, Link } from "react-router-dom";
import { MdMenuBook } from "../icons";

export default function Layout() {
  return (
    <main className="flex h-full flex-col items-center justify-start p-4 text-white  md:p-10 w-full flex-1 md:w-[720px]">
      <div className="w-full flex">
        <Link
          to="/"
          className="text-2xl p-2 font-bold text-center w-full  flex items-center justify-center"
        >
          <span>DEFTER &nbsp;</span>
          <MdMenuBook />
        </Link>

      </div>
      <Outlet />
    </main>
  );
}
