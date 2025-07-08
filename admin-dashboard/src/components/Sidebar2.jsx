import React, { useState, useEffect } from 'react';
import { FaBars, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import "./style.css"

const SidebarLayout = () => {
  // State management
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 992) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle body overflow when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Toggle handlers
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Determine if mobile view
    const isMobile = windowWidth <= 992;

    return (
        <div className="relative flex h-screen bg-gray-100">
            {/* Mobile Menu Button (only visible on mobile) */}
            {isMobile && (
            <button
                className="fixed top-4 left-4 z-40 p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                <FaBars className="text-xl" />
            </button>
            )}

            {/* Sidebar */}
            <aside
            className={`
                fixed md:relative z-30 h-full bg-white shadow-lg transition-all duration-300
                ${isCollapsed ? 'w-20' : 'w-64'}
                ${isMobile ? (isMobileMenuOpen ? 'left-0' : '-left-64') : 'left-0'}
            `}
            >
            {/* Toggle Button (only visible on desktop) */}
            {!isMobile && (
                <button
                className="absolute -right-3 top-4 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                onClick={toggleCollapse}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                </button>
            )}

            {/* Close Button (only visible on mobile) */}
            {isMobile && (
                <button
                className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                >
                <FaTimes />
                </button>
            )}

            {/* Sidebar Content */}
            <div className="h-full overflow-y-auto p-4">
                <h2 className={`font-bold mb-4 ${isCollapsed ? 'text-center' : 'text-left'}`}>
                {isCollapsed ? 'M' : 'Menu'}
                </h2>
                <nav>
                <ul className="space-y-2">
                    {['Dashboard', 'Projects', 'Team', 'Calendar', 'Reports'].map((item) => (
                    <li key={item}>
                        <a
                        href="#"
                        className={`flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors ${
                            isCollapsed ? 'justify-center' : ''
                        }`}
                        >
                        <span className={isCollapsed ? 'hidden' : 'block'}>{item}</span>
                        </a>
                    </li>
                    ))}
                </ul>
                </nav>
            </div>
            </aside>

            {/* Overlay (only visible on mobile when menu is open) */}
            {isMobile && isMobileMenuOpen && (
            <div
                className="fixed inset-0 z-20 bg-black bg-opacity-50"
                onClick={closeMobileMenu}
                role="button"
                aria-label="Close menu"
                tabIndex={0}
            />
            )}

            {/* Main Content */}
            <main className={`flex-1 overflow-auto transition-all duration-300 ${
            !isMobile && !isCollapsed ? 'ml-64' : !isMobile && isCollapsed ? 'ml-20' : ''
            }`}>
            <div className={`p-6 transition-opacity duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
            }`}>
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((card) => (
                    <div key={card} className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-medium text-lg mb-2">Card {card}</h3>
                    <p className="text-gray-600">Content for card {card}</p>
                    </div>
                ))}
                </div>
            </div>
            </main>
        </div>
    );
};

export default SidebarLayout;