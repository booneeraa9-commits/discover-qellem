import { notFound } from "next/navigation";
import ComponentsPreview from "./ComponentsPreview";

// Dev-only component preview. In the production build this route renders the
// not-found page instead of shipping the preview (issue #81).
export default function ComponentsPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <ComponentsPreview />;
}
