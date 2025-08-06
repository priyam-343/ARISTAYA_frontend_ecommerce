ARISTAYA E-commerce Frontend
This is the frontend application for the ARISTAYA E-commerce Platform.

Features
The ARISTAYA platform comes with a powerful set of features to provide a seamless user and admin experience:

User Authentication & Authorization: Secure user and admin logins with JWT.

Email Verification: New users are verified once via email using Firebase.

Google Sign-In: Easy login and registration using a Google account.

Admin Dashboard: A centralized hub for all site management, including:

Product Management: Add, modify, and delete products.

User Management: View and manage user profiles, including their order, cart, wishlist, and review history.

Admin Approval: A secure process where new admin requests must be approved by a super-admin.

Analytics: Visualize revenue trends, cart performance, and user engagement with a variety of graphs and charts.

Dynamic Pricing & Offers: Provides user-specific free shipping offers controlled by the admin panel.

Payment Gateway Integration: Seamless checkout process integrated with Razorpay and its webhook system.

Order & Cart Management: View and manage your personal cart, wishlist, and a comprehensive order history page.

Product Details: Detailed product pages with a review system.

Forgot & Reset Password: Securely reset your password via email.

Tech Stack
ReactJS

Material UI

ContextAPI

React-router-dom

Backend Counterpart
This frontend consumes APIs from the ARISTAYA E-commerce Backend.
Backend Repository: https://github.com/priyam-343/ARISTAYA_backend_ecommerce.git

How to Run Locally
Prerequisites
Node.js & npm (or Yarn)

A running ARISTAYA Backend instance

Installation
Clone this repository:

git clone https://github.com/priyam-343/ARISTAYA_frontend_ecommerce.git


Navigate into the project directory:

cd ARISTAYA_frontend_ecommerce


Install dependencies:

npm install


Environment Variables
Create a .env file in the project root and add the following variables.

REACT_APP_BACKEND_URL=YOUR_BACKEND_URL
REACT_APP_PRODUCT_TYPE=YOUR_BACKEND_URL/api/product/fetchproduct/type
REACT_APP_PRODUCT_TYPE_CATEGORY_=YOUR_BACKEND_URL/api/product/fetchproduct/category
REACT_APP_ADMIN_LOGIN=YOUR_BACKEND_URL/api/admin/login
REACT_APP_ADMIN_REGISTER=YOUR_BACKEND_URL/api/admin/register
REACT_APP_FORGOT_PASSWORD=YOUR_BACKEND_URL/api/password/forgot-password
REACT_APP_GET_USER_DETAILS=YOUR_BACKEND_URL/api/auth/getuser
REACT_APP_LOGIN=YOUR_BACKEND_URL/api/auth/login
REACT_APP_REGISTER=YOUR_BACKEND_URL/api/auth/register
REACT_APP_UPDATE_USER=YOUR_BACKEND_URL/api/auth/updateuser
REACT_APP_DELETE_USER=YOUR_BACKEND_URL/api/auth/delete/user
REACT_APP_GET_REVIEW=YOUR_BACKEND_URL/api/review/fetchreview
REACT_APP_ADD_REVIEW=YOUR_BACKEND_URL/api/review/addreview
REACT_APP_DELETE_REVIEW=YOUR_BACKEND_URL/api/review/deletereview
REACT_APP_ADMIN_DELETE_REVIEW=YOUR_BACKEND_URL/api/admin/review
REACT_APP_EDIT_REVIEW=YOUR_BACKEND_URL/api/review/editreview
REACT_APP_GET_KEY=YOUR_BACKEND_URL/api/payment/getkey
REACT_APP_GET_CHECKOUT=YOUR_BACKEND_URL/api/payment/checkout
REACT_APP_GET_PAYMENTVERIFICATION=YOUR_BACKEND_URL/api/payment/paymentverification
REACT_APP_GET_PREVIOUS_ORDERS=YOUR_BACKEND_URL/api/payment/getPreviousOrders
REACT_APP_GET_PAYMENT_DETAILS=YOUR_BACKEND_URL/api/payment/getpaymentdetails
REACT_APP_FETCH_PRODUCT=YOUR_BACKEND_URL/api/product/fetchproduct
REACT_APP_GET_CART=YOUR_BACKEND_URL/api/cart/fetchcart
REACT_APP_GET_WISHLIST=YOUR_BACKEND_URL/api/wishlist/fetchwishlist
REACT_APP_ADD_CART=YOUR_BACKEND_URL/api/cart/addcart
REACT_APP_DELETE_FROM_CART=YOUR_BACKEND_URL/api/cart/deletecart
REACT_APP_ADD_WISHLIST=YOUR_BACKEND_URL/api/wishlist/addwishlist
REACT_APP_DELETE_WISHLIST=YOUR_BACKEND_URL/api/wishlist/deletewishlist
REACT_APP_RESET_PASSWORD=YOUR_BACKEND_URL/api/password/reset/password
REACT_APP_ADMIN_ADD_PRODUCT=YOUR_BACKEND_URL/api/admin/addproduct
REACT_APP_ADMIN_GET_ALL_USERS=YOUR_BACKEND_URL/api/admin/getusers
REACT_APP_ADMIN_GET_SINGLE_USER=YOUR_BACKEND_URL/api/admin/getuser
REACT_APP_ADMIN_GET_USER_CART=YOUR_BACKEND_URL/api/admin/getcart
REACT_APP_ADMIN_GET_USER_WISHLIST=YOUR_BACKEND_URL/api/admin/getwishlist
REACT_APP_ADMIN_GET_USER_REVIEW=YOUR_BACKEND_URL/api/admin/getreview
REACT_APP_ADMIN_GET_USER_ORDER=YOUR_BACKEND_URL/api/admin/getorder
REACT_APP_ADMIN_GET_CHART_DATA=YOUR_BACKEND_URL/api/admin/chartdata
REACT_APP_ADMIN_UPDATE_PRODUCT=YOUR_BACKEND_URL/api/admin/updateproduct
REACT_APP_ADMIN_DELETE_USER_CART_ITEM=YOUR_BACKEND_URL/api/admin/usercart
REACT_APP_ADMIN_DELETE_USER_WISHLIST_ITEM=YOUR_BACKEND_URL/api/admin/userwishlist
REACT_APP_ADMIN_DELETE_PRODUCT=YOUR_BACKEND_URL/api/admin/deleteproduct
REACT_APP_ADMIN_DELETE_USER=YOUR_BACKEND_URL/api/admin/deleteuser
REACT_APP_ADMIN_USER_TOGGLE_SHIPPING=YOUR_BACKEND_URL/api/admin/user
REACT_APP_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
REACT_APP_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
REACT_APP_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
REACT_APP_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID"

Run Application
npm start

The application will run on http://localhost:3000.

Developed by Priyam Kumar
