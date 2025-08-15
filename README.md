ARISTAYA E-commerce Frontend
This is the frontend application for the ARISTAYA E-commerce Platform.

Features
User Authentication & Authorization (JWT)

Admin Dashboard (Product, Order, User management & statistics)

Payment Gateway Integration

Mail Service Integration

Forgot & Reset Password functionality

Product Listing & Search

Product Details & Reviews

Cart Management

Order History

Tech Stack
ReactJS

Material UI

ContextAPI

React-router-dom

Backend Counterpart
This frontend consumes APIs from the ARISTAYA E-commerce Backend.

Backend Repository: https://github.com/priyam-343/ARISTAYA_backend_ecommerce.git

How to Run Locally
1. Prerequisites
Node.js & npm (or Yarn)

Running ARISTAYA Backend instance

2. Installation
Clone this repository:

git clone https://github.com/priyam-343/ARISTAYA_frontend_ecommerce.git
cd ARISTAYA_frontend_ecommerce

Install dependencies:

npm install

3. Environment Variables
Create a .env file in the project root.

.env Example (copy this to your .env file and replace YOUR_BACKEND_URL):

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
REACT_APP_ADMIN_GET_SINGLE_USER=YOUR_BACKEND_URL/api/admin/geteuser
REACT_APP_ADMIN_GET_USER_CART=YOUR_BACKEND_URL/api/admin/getcart
REACT_APP_ADMIN_GET_USER_WISHLIST=YOUR_BACKEND_URL/api/admin/getwishlist
REACT_APP_ADMIN_GET_USER_REVIEW=YOUR_BACKEND_URL/api/admin/getreview
REACT_APP_ADMIN_GET_USER_ORDER=YOUR_BACKEND_URL/api/admin/getorder
REACT_APP_ADMIN_GET_CHART_DATA=YOUR_BACKEND_URL/api/admin/chartdata
REACT_APP_ADMIN_UPDATE_PRODUCT=YOUR_BACKEND_URL/api/admin/updateproduct
REACT_APP_ADMIN_DELETE_USER_CART_ITEM=YOUR_BACKEND_URL/api/admin/usercart
REACT_APP_ADMIN_DELETE_USER_WISHLIST_ITEM=YOUR_BACKEND_URL/api/admin/userwishlist
REACT_APP_ADMIN_DELETE_REVIEW=YOUR_BACKEND_URL/api/admin/review

4. Run Application
npm start

Application runs on http://localhost:3000.

Developed by Priyam Kumar.