import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
import "dotenv/config"; // optional, only needed if using .env

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const input = {
  width: 768,
  height: 768,
  prompt: "An astronaut riding a rainbow unicorn, cinematic, dramatic",
  refine: "expert_ensemble_refiner",
  apply_watermark: false,
  num_inference_steps: 25,
};

const output = await replicate.run(
  "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
  { input }
);

for (const [index, item] of Object.entries(output)) {
  await writeFile(`output_${index}.png`, await fetchAndBuffer(item));
  console.log(`Saved output_${index}.png`);
}

// Helper to fetch image and convert to buffer
async function fetchAndBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to download image");
  return Buffer.from(await res.arrayBuffer());
}