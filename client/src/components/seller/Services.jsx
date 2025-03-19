import React from "react";
import "./style.css"; // External CSS

const services = [
  {
    id: 2,
    title: "Secure Payment System",
    description:
      "Get paid quickly and securely with our seamless transaction processing system.",
  },
  {
    id: 3,
    title: "Logistics Support",
    description:
      "Easily transport your products to customers with our integrated delivery services.",
  },
  {
    id: 4,
    title: "Marketing & Promotions",
    description:
      "Boost your sales with targeted promotions and featured listings on our platform.",
  },
  {
    id: 5,
    title: "Business Insights",
    description:
      "Track your sales, customer trends, and performance with real-time analytics.",
  },
];

const Services = () => {
  return (
    <section className="services">
      <div className="services-container">
        <h2>Our Services for Sellers</h2>
        <p>Discover the powerful tools and services we offer to help you grow your agri-business.</p>

        <div className="services-list">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              {/* <button className="read-more">Read More</button> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
