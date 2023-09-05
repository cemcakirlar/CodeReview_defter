import React from "react";
import ReactDOM from "react-dom/client";
import Entities from "./Pages/entities";
import "./index.css";
import {
  //   createBrowserRouter,
  //   RouterProvider,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./Pages/home";
import NewEntity from "./Pages/new-entity";
import Layout from "./Pages/layout";
import EntityDetail from "./Pages/entity-detail";
import NotFound from "./Pages/not-found";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//     errorElement: <NotFound />,
//   },
//   {
//     path: "/entities",
//     element: <Entities />,
//   },
//   {
//     path: "/entities/new",
//     element: <NewEntity />,
//   },
//   {
//     path: "/entities/:entityId",
//     element: <EntityDetail />,
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Home />}
            errorElement={<NotFound />}
          />
          <Route
            path="/entities"
            element={<Entities />}
          />
          <Route
            path="/entities/new"
            element={<NewEntity />}
          />
          <Route
            path="/entities/:entityId"
            element={<EntityDetail />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
    {/* <Layout>
      <RouterProvider router={router} />
    </Layout> */}
  </React.StrictMode>
);
