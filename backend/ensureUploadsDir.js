import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdir } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = join(__dirname, "../uploads");

async function ensureUploadsDir() {
  try {
    await mkdir(uploadsDir, { recursive: true });
    console.log("Uploads directory is ready at:", uploadsDir);
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }
}

export default ensureUploadsDir; 