import React, { useEffect, useState, useContext } from "react";
import "./productReviews.css";
import { fetchDataFromApi, postDataToApi, deleteDataFromApi, updateDataToApi } from "../../utils/apiCalls";
import { MyContext } from "../../App";
import { Rating } from "@mui/material";


const ProductReviews = ({ productId, user }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");
    const [editingReview, setEditingReview] = useState(null);
    const [error, setError] = useState(null);
    const context = useContext(MyContext);

    useEffect(() => {
        // axios.get(`/api/reviews/${productId}`)
        //     .then(res => setReviews(res.data))
        //     .catch(err => console.error("Error fetching reviews:", err));

        fetchDataFromApi(`/api/productReviews/${productId}`)
        .then((res) =>{
			console.log(res)
            setReviews(res);
        })
        .catch(err => console.error("Error fetching reviews:", err));
    }, [productId]);

    // const token = localStorage.getItem("token");
    // const headers = { Authorization: `Bearer ${token}` };

    // Submit a New Review
    const submitReview = (e) => {
        e.preventDefault();

        try {
            // const { data } = await axios.post("/api/reviews", { productId, rating, comment }, { headers });

            // setReviews([...reviews, data.review]);
            // setRating(0);
            // setComment("");

            const postReviews = { productId, rating, comment }

            postDataToApi(`/api/productReviews/add`, postReviews)
            .then((res) => {
				console.log("***",res)
                if(res.error) {
                    setRating(1);
                    setComment("");
                    context.setAlertBox({
                        open: true,
                        msg: res.message,
                        error: true
                    })
                } else{
                    console.log("reviews", res)
                    setReviews([...reviews, res.review]);
                 
                }
      
            })
        } catch (err) {
            setError(err.response?.data?.message || "Error submitting review");
        }
    };

    // Edit an Existing Review
    const updateReview = async (e) => {
        e.preventDefault();

        try {

            const reviewData = { rating, comment }

            updateDataToApi(`/api/productReviews/${editingReview._id}`, reviewData)
            .then((res) => {
                setReviews(reviews.map(review => (review._id === editingReview._id ? res.review : review)));              
                setEditingReview(null);
                setRating(1);
                setComment("");
            });
        } catch (err) {
            setError(err.response?.data?.message || "Error updating review");
        }
    };

    // Delete a Review
    const deleteReview = (reviewId) => {
        try {

            deleteDataFromApi(`/api/productReviews/${reviewId}`)
                .then((res) => {
                    setReviews(reviews.filter(review => review._id !== reviewId));
                });

        } catch (err) {
            setError("Error deleting review");
        }
    };

    return (
		<div className="reviews-container">
			<div className="reviews-header">
				<h3 className="reviews-title">Customer Reviews</h3>
				<span className="verified-buyer-note">(Only verified buyers can leave reviews)</span>
				
				{reviews.length > 0 && (
				<div className="reviews-summary">
					<div className="average-rating">
					<span className="rating-value">
						{reviews?.rating}
					</span>
					<Rating 
						value={reviews?.rating} 
						precision={0.1} 
						readOnly 
						size="large"
					/>
					</div>
					<div className="total-reviews">{reviews.length} reviews</div>
				</div>
				)}
			</div>

			{reviews.length === 0 ? (
				<div className="no-reviews">
					<div className="no-reviews-icon">⭐</div>
					<p>No reviews yet. Be the first to review this product!</p>
				</div>
			) : (
				<div className="reviews-list">
					{reviews.map((review, index) => (
						<div key={index} className="review-card">
							<div className="review-header">
								<div className="reviewer-info">
									<div className="reviewer-avatar">
										{review?.user?.name.charAt(0).toUpperCase()}
									</div>
									<div>
										<div className="reviewer-name">{review?.user?.name}</div>
										<div className="review-date">
											{new Date(review?.createdAt).toLocaleDateString()}
										</div>
									</div>
								</div>
								<div className="review-rating">
									<Rating value={review?.rating} readOnly size="medium" />
								</div>
							</div>
						
							<div className="review-content">
								<p>{review?.comment}</p>
							</div>
						
							{user && user?.userId === review?.user._id && (
								<div className="review-actions">
									<button 
										className="action-btn edit-btn"
										onClick={() => {
										setEditingReview(review);
										setRating(review?.rating);
										setComment(review?.comment);
										}}
									>
										Edit
									</button>
									<button 
										className="action-btn delete-btn"
										onClick={() => deleteReview(review?._id)}
									>
										Delete
									</button>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{user && (
				<div className="review-form-container">
					<form onSubmit={editingReview ? updateReview : submitReview} className="review-form">
						<h4 className="form-title">
							{editingReview ? "Edit Your Review" : "Write a Review"}
						</h4>
						
						{error && <div className="error-message">{error}</div>}
						
						<div className="form-group">
						<label htmlFor="rating-select">Your Rating</label>
						<select
							id="rating-select"
							value={rating}
							onChange={(e) => setRating(e.target.value)}
							className="rating-select"
						>
							<option value="0">Select Rating</option>
							<option value="1">1 - Poor</option>
							<option value="2">2 - Fair</option>
							<option value="3">3 - Good</option>
							<option value="4">4 - Very Good</option>
							<option value="5">5 - Excellent</option>
						</select>
						</div>
						
						<div className="form-group">
						<label htmlFor="review-text">Your Review</label>
						<textarea
							id="review-text"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder="Share your experience with this product..."
							rows="5"
							className="review-textarea"
						></textarea>
						</div>
						
						<button type="submit" className="submit-btn">
						{editingReview ? "Update Review" : "Submit Review"}
						</button>
					</form>
				</div>
			)}
		</div>
    );
};

export default ProductReviews;

