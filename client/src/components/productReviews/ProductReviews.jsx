import React, { useEffect, useState } from "react";
import "./productReviews.css";
import { fetchDataFromApi, postDataToApi, deleteDataFromApi, updateDataToApi } from "../../utils/apiCalls";


const ProductReviews = ({ productId, user }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [editingReview, setEditingReview] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // axios.get(`/api/reviews/${productId}`)
        //     .then(res => setReviews(res.data))
        //     .catch(err => console.error("Error fetching reviews:", err));

        fetchDataFromApi(`/api/productReviews/${productId}`)
        .then((res) =>{
            console.log("reviews", res);
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

            postDataToApi(`/api/productReviews/`, postReviews)
            .then((res) => {
                setReviews([...reviews, res.review]);
                setRating(0);
                setComment("");
            })
        } catch (err) {
            setError(err.response?.data?.message || "Error submitting review");
        }
    };

    // Edit an Existing Review
    const updateReview = async (e) => {
        e.preventDefault();

        try {
            // const { data } = await axios.put(`/api/reviews/${editingReview._id}`, { rating, comment }, { headers });

            // setReviews(reviews.map(r => (r._id === editingReview._id ? data.review : r)));
            // setEditingReview(null);
            // setRating(0);
            // setComment("");

            const reviewData = { rating, comment }

            
            updateDataToApi(`/api/productReviews/${editingReview._id}`, reviewData)
            .then((res) => {
                setReviews(reviews.map(r => (r._id === editingReview._id ? res.review : r)));
                setEditingReview(null);
                setRating(0);
                setComment("");
            });
        } catch (err) {
            setError(err.response?.data?.message || "Error updating review");
        }
    };

    // Delete a Review
    const deleteReview = async (reviewId) => {
        try {
            // await axios.delete(`/api/reviews/${reviewId}`, { headers });

            // setReviews(reviews.filter(r => r._id !== reviewId));

            deleteDataFromApi(`/api/productReviews/${reviewId}`)
            .then((res) => {
                setReviews(reviews.filter(r => r._id !== reviewId));

            });
        } catch (err) {
            setError("Error deleting review");
        }
    };

    return (
        <div className="review-section">
            <h3>Customer Reviews</h3>
            {reviews.length === 0 ? <p>No reviews yet.</p> : (
                reviews.map((review, index) => (
                    <div key={index} className="review">
                        <strong>{review.user.name}</strong>
                        <p>Rating: {review.rating} ⭐</p>
                        <p>{review.comment}</p>

                        {user && user.id === review.user._id && (
                            <div>
                                <button onClick={() => {
                                    setEditingReview(review);
                                    setRating(review.rating);
                                    setComment(review.comment);
                                }}>Edit</button>
                                <button onClick={() => deleteReview(review._id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))
            )}

            {user && (
                <form onSubmit={editingReview ? updateReview : submitReview}>
                    <h4>{editingReview ? "Edit Your Review" : "Write a Review"}</h4>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value="0">Select Rating</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                    </select>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review"></textarea>
                    <button type="submit">{editingReview ? "Update Review" : "Submit Review"}</button>
                </form>
            )}
        </div>
    );
};

export default ProductReviews;

