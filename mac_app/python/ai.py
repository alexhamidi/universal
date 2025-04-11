import os
import json
import base64
from openai import OpenAI

openai = OpenAI()
def submit_prompt(text: str, screenshot_path: str) -> str:
    """
    Submit a prompt with text and image to OpenAI's GPT-4 Vision API.

    Args:
        text (str): The text prompt to send
        screenshot_path (str): Path to the screenshot image file

    Returns:
        str: The response from the API
    """
    print(f"input: {text}")


    # Read and encode the image
    with open(screenshot_path, "rb") as image_file:
        image_data = image_file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')

    # API endpoint
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": [
                {"type": "text", "text": text},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]}
        ]
    )

    response_text = response.choices[0].message.content

    return response_text

    # Make the API request

