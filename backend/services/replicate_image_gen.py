import requests
import os
import time

def generate_image(prompt):
    token = os.getenv("REPLICATE_API_TOKEN")
    headers = {
        "Authorization": f"Token {token}",
        "Content-Type": "application/json"
    }

    version = "7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc"
    endpoint = "https://api.replicate.com/v1/predictions"
    body = {
        "version": version,
        "input": {
            "prompt": prompt,
            "width": 768,
            "height": 768,
            "refine": "expert_ensemble_refiner",
            "apply_watermark": False,
            "num_inference_steps": 25
        }
    }

    # Step 1: Kick off prediction
    resp = requests.post(endpoint, json=body, headers=headers)
    if resp.status_code != 201:
        return f"Error: {resp.status_code} - {resp.text}"

    # Step 2: Poll for result
    status_url = resp.json()["urls"]["get"]
    while True:
        result = requests.get(status_url, headers=headers).json()
        if result["status"] == "succeeded":
            return result["output"][0]
        elif result["status"] == "failed":
            return "Image generation failed."
        time.sleep(1)