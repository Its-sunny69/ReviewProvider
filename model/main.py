from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from textblob import TextBlob
from typing import List

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow requests from Vite frontend
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

class ReviewRequest(BaseModel):
    reviews: List[str]  # Expecting "question: answer" format

def analyze_sentiment(review: str) -> str:
    """Determine if the review is Good or Bad based on sentiment polarity."""
    review = review.strip()
    
    # Check if the review is a number (rating)
    if review.isdigit():  
        rating = int(review)
        if 1 <= rating <= 3:
            return "Bad"
        elif 4 <= rating <= 6:
            return "Neutral"
        elif 7 <= rating <= 10:
            return "Good"
        else:
            return "Invalid" 
    sentiment = TextBlob(review).sentiment.polarity
    print(sentiment)
    if sentiment > 0:
        return "Good"
    elif sentiment < 0:
        return "Bad"
    else:
        return "Neutral" 

@app.post("/analyze/")
def analyze_reviews(data: ReviewRequest):
    """API endpoint to analyze multiple reviews."""
    if not (1 <= len(data.reviews) <= 4):
        raise HTTPException(status_code=400, detail="Number of reviews must be between 1 and 4")

    results = []
    for item in data.reviews:
        if ":" not in item:
            raise HTTPException(status_code=400, detail="Invalid format. Use 'question: answer'.")

        question, review = item.split(":", 1)  # Split into question and answer
        sentiment = analyze_sentiment(review.strip())  # Analyze only the answer
        results.append({"question": question.strip(), "review": review.strip(), "sentiment": sentiment})
    
    print(results)
    return {"results": results}
