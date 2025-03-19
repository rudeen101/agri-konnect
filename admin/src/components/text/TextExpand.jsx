import React, { useState } from "react";
import "./textExpand.css"; // Importing the CSS file

const TextExpand = ({ title, salesData, maxLines = 3 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dateFormatter = (dateCreated) => {
	const date = new Date(dateCreated);
	const readableDate = date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		// hour: "2-digit",
		// minute: "2-digit",
		// second: "2-digit",
		// timeZoneName: "short",
	})
	return readableDate;
};

  return (
    <div className="text-card">
		<div className="card-header">{dateFormatter(salesData?.createdAt)}</div>
			<div className="card-body">
				<div className={`text-content ${isExpanded ? "expanded" : ""}`} style={{ WebkitLineClamp: isExpanded ? "unset" : maxLines }}>
					<div className="productContainer">
						<div>
							<div className="imageContainer">
								<img src={salesData?.orderItems[0]?.images[0]} alt="" />
							</div>
							<div className="textContainer">
								<p><strong>{salesData?.orderItems[0]?.name}</strong></p>
								<p>{salesData?.orderItems[0]?.product}</p>
							</div>
						</div>
						<div className="mt-2">
							<p>Total Price: <strong>${salesData?.totalPrice}.00</strong></p>
							<p>Order Status: <strong>{salesData?.status}</strong></p>
							<p>Payment Status: <strong>{salesData?.paymentStatus}</strong></p>
							<p>Payment Method: <strong>{salesData?.paymentDetails?.method}</strong></p>
							<p>Delivery Address:	<strong>{salesData?.deliveryAddress.address}, {salesData?.deliveryAddress.city}</strong></p>
							<p>Customer Name: <strong>{salesData?.orderedBy?.name}</strong>, ID#: <strong>{salesData?.orderedBy?._id}</strong></p>
							<p>Seller Name: <strong>{salesData?.receivedBy?.name}</strong>, ID#: <strong>{salesData?.receivedBy?._id}</strong></p>
						</div>
				
					</div>

				</div>
				<button className="toggle-button" onClick={() => setIsExpanded(!isExpanded)}>
					{isExpanded ? "Read Less" : "Read More"}
				</button>
			</div>
    </div>
  );
};

export default TextExpand;
