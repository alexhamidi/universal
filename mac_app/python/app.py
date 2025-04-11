from fastapi import FastAPI, HTTPException
import uvicorn
from typing import Optional
import ai as oai
from pydantic import BaseModel

app = FastAPI()

class ToolResponse(BaseModel):
    action: dict
    explanation: str



@app.get("/api/health")
async def root():
    return {"message": "System is healthy"}

@app.get("/api/submit")
async def submit(text: str, screenshot_path: str):
    print(f"Received request to submit prompt, text: {text}, screenshot_path: {screenshot_path}")
    response_text = oai.submit_prompt(text, screenshot_path)
    return {"message": response_text}




@app.get("/api/agent_round")
async def agent_round(text: str, screenshot_path: str):
    print(f"Received request for agent round, text: {text}, screenshot_path: {screenshot_path}")
    tool_result = oai.agent_round(text, screenshot_path)

    if tool_result is None:
        raise HTTPException(status_code=400, detail="Failed to get valid tool response")

    tool_response = ToolResponse(
        action=tool_result.action,
        explanation=tool_result.explanation
    )
    print(f"tool_response: {tool_response}")
    return {"tool_response": tool_response.model_dump_json()}

# add good

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)



