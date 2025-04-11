from fastapi import FastAPI
import uvicorn
import ai as oai

app = FastAPI()

@app.get("/api/health")
async def root():
    return {"message": "System is healthy"}

@app.get("/api/submit")
async def submit(text: str, screenshot_path: str):
    print(f"Recieved request to submit prompt, text: {text}, screenshot_path: {screenshot_path}")
    response_text = oai.submit_prompt(text, screenshot_path)
    return {"message": response_text}

# add good


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)



