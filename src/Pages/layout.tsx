import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 text-white  md:p-10 bg-[#5b5c6e]">
      <div className="w-full flex-1 md:w-[720px] md:p-0">
        <div className="w-full flex">
          <Link
            to="/"
            className="text-2xl p-2 font-bold text-center w-full underline"
          >
            DEFTER
          </Link>
        </div>
        <Outlet />
      </div>
    </main>
  );
}
