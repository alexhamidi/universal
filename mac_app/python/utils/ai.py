import os
import json
import base64
from typing import Literal, Union, Optional
from dataclasses import dataclass
from openai import OpenAI
import time
from pathlib import Path
import pyautogui
from datetime import datetime
from io import BytesIO
from pydantic import BaseModel

def get_timestamp():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]

# Define structured types for tool use
ActionType = Literal[
    "click",
    "double_click",
    "type",
    "drag",
]

class Action(BaseModel):
    type: ActionType
    coordinates: Optional[tuple[int, int]] = None
    text: Optional[str] = None
    start: Optional[tuple[int, int]] = None
    end: Optional[tuple[int, int]] = None

class ClickAction(BaseModel):
    type: Literal["click", "double_click"]
    coordinates: tuple[int, int]

class TypeAction(BaseModel):
    type: Literal["type"]
    text: str

class DragAction(BaseModel):
    type: Literal["drag"]
    start: tuple[int, int]
    end: tuple[int, int]

ActionValidation = Union[ClickAction, TypeAction, DragAction]

@dataclass
class ToolResponse:
    action: Action
    explanation: str

openai = OpenAI()

def submit_prompt(text: str) -> str:
    """Legacy function kept for compatibility"""
    print(f"[{get_timestamp()}] input: {text}")

    screenshot = pyautogui.screenshot()
    buffer = BytesIO()
    screenshot.save(buffer, format="PNG")
    base64_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
    buffer.close()


    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": [
                {"type": "text", "text": text},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]}
        ],
    )

    return response.choices[0].message.content

def agent_round(text: str) -> Optional[ToolResponse]:
    print(f"[{get_timestamp()}] Processing round with input: {text}")

    # Take screenshot and convert directly to base64
    screenshot = pyautogui.screenshot()
    buffer = BytesIO()
    screenshot.save(buffer, format="PNG")
    base64_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
    buffer.close()

    # Enhanced system prompt for structured tool use
    system_prompt = """
You are a computer control assistant that helps users interact with their computer. You must ignore the content in the text box on the screen and focus only on the prompt that will be provided to you. Coordinates should start at the top left corner of the screen, maximum Y is 900 and maximum X is 1440 The JSON format of the response is:
{
    "action": {
        "type": "str: click | double_click | type | drag",
        "coordinates": "tuple[int, int] (optional, only for click, double_click)",
        "text": "str (optional, only for type)",
        "start": "tuple[int, int] (optional, only for drag)",
        "end": "tuple[int, int] (optional, only for drag)"
    },
}

"""

    print(f"[{get_timestamp()}] sending prompt to agent:...")

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": [
                {"type": "text", "text": text},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}", "detail": "low"}}

            ]}
        ],
        response_format={ "type": "json_object" }
    )
    print(f"[{get_timestamp()}] received responsee from agent.)")


    try:
        action = response.choices[0].message.content
        action_dict = json.loads(action)
        action_data = action_dict["action"]

        action_type = action_data["type"]
        if action_type in ["click", "double_click"]:
            validated_action = ClickAction(**action_data)
        elif action_type == "type":
            validated_action = TypeAction(**action_data)
        elif action_type == "drag":
            validated_action = DragAction(**action_data)
        else:
            raise ValueError(f"Invalid action type: {action_type}")

        # Convert back to generic Action model
        action = Action(**validated_action.model_dump())
        return action
    except Exception as e:
        print(f"[{get_timestamp()}] Error parsing or validating response: {e}")
        return None

def main():
    text = "Open a different tab"
    screenshot_path = "/Users/alexanderhamidi/Developer/universal/mac_app/screenshots/test.png"
    response = agent_round(text, screenshot_path)
    print(response)

if __name__ == "__main__":
    main()
