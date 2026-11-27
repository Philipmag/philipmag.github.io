import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="page-heading">
          <div className="container">
            <p className="eyebrow">Page not found · 404</p>
            <h1>Let’s get you back on track</h1>
            <p className="text-muted-foreground mb-6">
              This page may have moved, or the address may be incorrect.
            </p>
            <Link href="/" className="button">
              Go to home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
