import React, { useState, useContext } from "react";
import "./style.css"; // External CSS
import { postDataToApi } from "../../utils/apiCalls";
import { MyContext } from "../../App";


const Newsletter = () => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const context = useContext(MyContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");

		try {
			const data = await postDataToApi("/api/newsletter/subscribe", { email });
			if (!data){
				context.setAlertBox({
					open: true,
					msg: "Something went worng. Try again!",
					error: true
				})

			} else {
				context.setAlertBox({
					open: true,
					msg: data?.message,
					error: false
				})
			}
	
			setEmail(""); // Clear input after successful submission
		} catch (error) {
			setMessage(error.response?.data?.error || "Something went wrong!");
		}
	};

  return (
	<section className="newsletter">
		<div className="newsletter-container">
			<div className="newsletter-text">
				<h2>Get Helpful Tips on Building Your Brand</h2>
				<p>Subscribe to our newsletter and receive expert insights, marketing tips, and business strategies to grow your agri-business with Agri-Konnect.</p>
			</div>

			<form className="newsletter-form" onSubmit={handleSubmit}>
				<input
					type="email"
					className="formElem"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<button type="submit">Subscribe</button>
			</form>
		</div>
	</section>
  );
};

export default Newsletter;
