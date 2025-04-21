from fastapi import FastAPI, HTTPException
import uvicorn
from typing import Optional
import utils.ai as oai
from pydantic import BaseModel

app = FastAPI()

@app.get("/api/health")
async def root():
    return {"message": "System is healthy"}

@app.get("/api/submit")
async def submit(text: str):
    print(f"Received request to submit prompt, text: {text}")
    response_text = oai.submit_prompt(text)
    return {"message": response_text}

@app.get("/api/agent_round")
async def agent_round(text: str):
    print(f"Received request for agent round, text: {text}")
    action = oai.agent_round(text)

    if action is None:
        raise HTTPException(status_code=400, detail="Failed to get valid tool response")

    return {"action": action.model_dump_json()}

# add good

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)



