import React from "react";
import ReactDOM from "react-dom/client";
import Entities from "./Pages/entities";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/home";
import NewEntity from "./Pages/new-entity";
import Layout from "./Pages/layout";
import EntityDetail from "./Pages/entity-detail";
import NotFound from "./Pages/not-found";
import NewTransaction from "./Pages/new-transaction";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          element={<Layout />}
          errorElement={<NotFound />}
        >
          <Route
            path="/"
            element={<Home />}
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
          <Route
            path="/entities/:entityId/new"
            element={<NewTransaction />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
