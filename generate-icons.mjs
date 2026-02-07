// Script to generate PWA icons from SVG
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, 'public', 'logo.svg');

const sizes = [192, 512];

async function generateIcons() {
    console.log('Generating PWA icons from SVG...');

    const svgBuffer = fs.readFileSync(svgPath);

    for (const size of sizes) {
        const outputPath = path.join(__dirname, 'public', `logo-${size}.png`);
        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(outputPath);
        console.log(`✓ Created: logo-${size}.png (${size}x${size})`);
    }

    console.log('\n✅ PWA icons generated successfully!');
}

generateIcons().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
