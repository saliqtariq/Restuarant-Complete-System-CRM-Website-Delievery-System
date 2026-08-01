import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "..", "public");

async function optimizeImages() {
  console.log(`Scanning ${publicDir} for PNG images...`);
  
  const files = fs.readdirSync(publicDir);
  const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));
  
  console.log(`Found ${pngFiles.length} PNG files. Starting optimization...`);
  
  let totalSavedBytes = 0;

  for (const file of pngFiles) {
    const filePath = path.join(publicDir, file);
    const tempPath = path.join(publicDir, `temp_${file}`);
    
    try {
      const stats = fs.statSync(filePath);
      const originalSize = stats.size;
      
      // Skip very small files (already optimized)
      if (originalSize < 200 * 1024) {
        console.log(`Skipping ${file} (already small: ${Math.round(originalSize / 1024)} KB)`);
        continue;
      }

      // Optimize: resize to max 800px width if larger, and compress with sharp
      await sharp(filePath)
        .resize({ width: 800, withoutEnlargement: true })
        .png({ quality: 80, compressionLevel: 9, palette: true })
        .toFile(tempPath);
      
      const newStats = fs.statSync(tempPath);
      const newSize = newStats.size;
      
      if (newSize < originalSize) {
        // Replace original with optimized version
        fs.renameSync(tempPath, filePath);
        const saved = originalSize - newSize;
        totalSavedBytes += saved;
        console.log(`Optimized ${file}: ${(originalSize / 1024 / 1024).toFixed(2)} MB -> ${(newSize / 1024 / 1024).toFixed(2)} MB (Saved ${(saved / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        // Optimization didn't help (rare), remove temp file
        fs.unlinkSync(tempPath);
        console.log(`Skipping ${file} (optimization didn't reduce size)`);
      }
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err);
      // Clean up temp file if it exists
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }

  console.log(`\nOptimization complete!`);
  console.log(`Total space saved: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB`);
}

optimizeImages().catch(console.error);
