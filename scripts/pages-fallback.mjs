import { copyFileSync, writeFileSync } from "node:fs";
// GitHub Pages has no server-side SPA routing. Its 404 page loads the same
// client router while preserving the requested path. Node hosting returns 200.
copyFileSync("dist/public/index.html", "dist/public/404.html");
writeFileSync("dist/public/.nojekyll", "");
