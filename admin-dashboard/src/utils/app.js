// // Toggle sidebar collapse (desktop)
// const toggleBtn = document.querySelector('.toggle-btn');
// const sidebar = document.querySelector('.sidebar');
// const mainContent = document.querySelector('.main-content');
// const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
// const overlay = document.querySelector('.sidebar-overlay');

// console.log(toggleBtn)

// toggleBtn.addEventListener('click', function() {
//     sidebar.classList.toggle('sidebar-collapsed');
//     toggleBtn.querySelector('i').classList.toggle('fa-chevron-left');
//     toggleBtn.querySelector('i').classList.toggle('fa-chevron-right');
// });

// // Mobile menu toggle
// mobileMenuBtn.addEventListener('click', function() {
//     sidebar.classList.add('active');
//     overlay.classList.add('active');
//     document.body.style.overflow = 'hidden';
// });

// // Close sidebar when clicking overlay
// overlay.addEventListener('click', function() {
//     sidebar.classList.remove('active');
//     overlay.classList.remove('active');
//     document.body.style.overflow = '';
// });

// // Close sidebar when clicking outside on mobile
// document.addEventListener('click', function(event) {
//     if (window.innerWidth <= 992 && 
//         !sidebar.contains(event.target) && 
//         event.target !== mobileMenuBtn && 
//         !mobileMenuBtn.contains(event.target)) {
//         sidebar.classList.remove('active');
//         overlay.classList.remove('active');
//         document.body.style.overflow = '';
//     }
// });

// // Close sidebar when window is resized above 992px
// window.addEventListener('resize', function() {
//     if (window.innerWidth > 992) {
//         sidebar.classList.remove('active');
//         overlay.classList.remove('active');
//         document.body.style.overflow = '';
//     }
// });

// // Simulate loading (for demo purposes)
// setTimeout(() => {
//     document.querySelector('.hero').style.opacity = '1';
// }, 300);