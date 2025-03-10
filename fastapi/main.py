from fastapi import FastAPI
from api.v1.nlp_route import router as nlp_router
import logging

app = FastAPI()

# Include the router with a prefix
app.include_router(nlp_router, prefix='/api/v1', tags = ['v1'])

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("uvicorn")

@app.get("/")
def read_root():
    logger.debug("Root endpoint is being accessed.")
    return "Fast Api Server Running  Dev mode..." 

@app.get("/test/")
async def test_route():
    return {"message": "Test route working"} 


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000, reload=True)  