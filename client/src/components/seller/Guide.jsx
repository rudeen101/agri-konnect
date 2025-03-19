import React, { useState, useEffect, useRef } from "react";
import "./style.css";

const guides = [
  { id: "getting-started", title: "Getting Started" },
  { id: "create-account", title: "Creating an Account" },
  { id: "list-products", title: "Listing Your Products" },
  { id: "manage-orders", title: "Managing Orders" },
  { id: "receive-payments", title: "Receiving Payments" },
  { id: "customer-support", title: "Providing Customer Support" },
];

const Guide = () => {
  const [activeSection, setActiveSection] = useState(guides[0].id);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".guide-section");
      let currentSection = sections[0].id;

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 150) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    const contentElement = contentRef.current;
    contentElement.addEventListener("scroll", handleScroll);

    return () => contentElement.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="how-to-sell">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>How to Sell on AgriKonnect</h3>
        <ul>
          {guides.map((guide) => (
            <li
              key={guide.id}
              className={activeSection === guide.id ? "active" : ""}
            >
              <a href={`#${guide.id}`}>{guide.title}</a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Content Section */}
      <main className="content" ref={contentRef}>
        {guides.map((guide) => (
          <section key={guide.id} id={guide.id} className="guide-section">
            <h2>{guide.title}</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              vehicula lacus nec dui feugiat, et vehicula leo suscipit. Ut
              consectetur urna nec metus volutpat, non tincidunt lorem
              efficitur.
            </p>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Guide;
