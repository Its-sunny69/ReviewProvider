from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from textblob import TextBlob
from typing import List

app = FastAPI()

class ReviewRequest(BaseModel):
    reviews: List[str]

def analyze_sentiment(review: str) -> str:
    """Determine if the review is Good or Bad based on sentiment polarity."""
    sentiment = TextBlob(review).sentiment.polarity
    return "Good" if sentiment > 0 else "Bad"

@app.post("/analyze/")
def analyze_reviews(data: ReviewRequest):
    """API endpoint to analyze multiple reviews."""
    if not (1 <= len(data.reviews) <= 4):
        raise HTTPException(status_code=400, detail="Number of reviews must be between 1 and 4")
    
    results = [{"review": review, "sentiment": analyze_sentiment(review)} for review in data.reviews]
    return {"results": results}
