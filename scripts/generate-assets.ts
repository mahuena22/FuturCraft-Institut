import sharp from "sharp";
import { mkdirSync, existsSync, copyFileSync } from "fs";
import { join } from "path";

const PUBLIC_IMAGES = join(process.cwd(), "public", "images");
const FORMATIONS_DIR = join(PUBLIC_IMAGES, "formations");

async function generateIcons() {
  console.log("Generating PWA icons...");
  const logoPath = join(PUBLIC_IMAGES, "Logo-crop.png");
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

  for (const size of sizes) {
    const outputPath = join(PUBLIC_IMAGES, `icon-${size}x${size}.png`);
    // Fit logo inside size x size with some breathing room padding
    const innerSize = Math.round(size * 0.85);
    const logoBuffer = await sharp(logoPath)
      .resize(innerSize, innerSize, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 251, g: 252, b: 252, alpha: 1 }, // #FBFCFC matching brand bg
      },
    })
      .composite([{ input: logoBuffer, gravity: "center" }])
      .png()
      .toFile(outputPath);

    console.log(`✓ Generated icon-${size}x${size}.png`);
  }
}

async function generateFormationFallbacks() {
  console.log("Ensuring formations directory and fallback images...");
  if (!existsSync(FORMATIONS_DIR)) {
    mkdirSync(FORMATIONS_DIR, { recursive: true });
  }

  const slugs = [
    "developpement-web-fullstack",
    "developpement-intelligence-artificielle",
    "maitrise-outils-intelligence-artificielle",
    "web-design-ui-ux",
    "webmaster",
    "graphisme-et-serigraphie",
    "marketing-digital",
    "maintenance-informatique-et-reseau",
    "photographie-cadrage-et-montage-video",
    "copywriting",
    "e-commerce",
    "pilotage-de-drone",
  ];

  // Base images available in public/images
  const baseHero = join(PUBLIC_IMAGES, "hero-bg.jpg");
  const baseDrone = join(PUBLIC_IMAGES, "Excution-Ganvie.jpg");
  const baseVideo = join(PUBLIC_IMAGES, "Montage-Video.jpg");
  const baseProject = join(PUBLIC_IMAGES, "projet-vano-baby.jpg");

  const imageMap: Record<string, string> = {
    "developpement-web-fullstack": baseHero,
    "developpement-intelligence-artificielle": baseProject,
    "maitrise-outils-intelligence-artificielle": baseHero,
    "web-design-ui-ux": baseProject,
    "webmaster": baseHero,
    "graphisme-et-serigraphie": baseVideo,
    "marketing-digital": baseProject,
    "maintenance-informatique-et-reseau": baseHero,
    "photographie-cadrage-et-montage-video": baseVideo,
    "copywriting": baseProject,
    "e-commerce": baseProject,
    "pilotage-de-drone": baseDrone,
  };

  for (const slug of slugs) {
    const target = join(FORMATIONS_DIR, `${slug}.jpg`);
    const source = imageMap[slug] || baseHero;
    await sharp(source)
      .resize(1200, 675, { fit: "cover" })
      .jpeg({ quality: 85 })
      .toFile(target);
    console.log(`✓ Created local formation fallback: ${slug}.jpg`);
  }
}

async function main() {
  await generateIcons();
  await generateFormationFallbacks();
  console.log("All asset generation complete!");
}

main().catch((err) => {
  console.error("Asset generation error:", err);
  process.exit(1);
});
