import { RouterProvider, createBrowserRouter } from "react-router";
import { Toaster } from "sonner";
import Root from "./Root";
import Entry from "./Entry";
import AIPreview from "./AIPreview";
import Builder from "./Builder";
import ProductReview from "./ProductReview";
import ProductOverview from "./ProductOverview";
import BasicDetails from "./BasicDetails";
import Questions from "./Questions";
import Exclusions from "./Exclusions";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Entry },
      { path: "ai-preview", Component: AIPreview },
      { path: "builder", Component: Builder },
      { path: "basic-details", Component: BasicDetails },
      { path: "questions", Component: Questions },
      { path: "exclusions", Component: Exclusions },
      { path: "review", Component: ProductReview },
      { path: "overview", Component: ProductOverview },
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}
