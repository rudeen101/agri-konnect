import React, { useState } from "react";
import axios from "axios";
import "./searchBar.css";


const categories = [
    "All Categories", "Electronics", "Clothing", "Books", "Home & Kitchen", "Beauty", "Toys"
];

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Handle input change
    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 1) {
            try {
                // Simulate API call for search suggestions
                const response = await axios.get(`/api/search?query=${value}&category=${selectedCategory}`);
                setSuggestions(response.data);
                setShowDropdown(true);
            } catch (error) {
                console.error("Error fetching suggestions", error);
            }
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
    };

    // Handle search submission
    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query, selectedCategory);
            setShowDropdown(false);
        }
    };

    // Select a suggestion
    const handleSelectSuggestion = (suggestion) => {
        setQuery(suggestion);
        setShowDropdown(false);
        onSearch(suggestion, selectedCategory);
    };

    return (
        <div className="search-bar">
            <div className="search-container">
                <select 
                    className="category-dropdown" 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for products..."
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button className="search-button" onClick={handleSearch}>🔍</button>
            </div>

            {showDropdown && suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((item, index) => (
                        <li key={index} onClick={() => handleSelectSuggestion(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
