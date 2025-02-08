Sure! Here's an updated version of the README with a section for the Postman Collection link:

---

# Inventory Admin API Documentation

## Features

### 1. **Product Management**

- **Create Product**: Admins can create new products with details such as name, category, price, and quantity.
- **Update Product**: Admins can update existing product details such as price, quantity, and category.
- **Fetch Products**: Admins can retrieve a list of products with pagination and sorting.
- **Delete Product**: Admins can delete products from the inventory.

### 2. **Admin Authentication**

- **Login**: Admins can authenticate using their credentials (email and password) to obtain a JSON Web Token (JWT).
- **Protected Routes**: All product management routes are protected and can only be accessed by authenticated admins.
- **Role-based Authorization**: Only users with the admin role can access product-related routes.

### 3. **Error Handling**

- **Custom Error Handling**: The API has a custom error handling mechanism to handle different types of errors (validation errors, server errors, etc.).
- **Global Error Handler**: All errors are caught in a global error handler to return appropriate HTTP status codes and messages.

### 4. **Database Optimization**

- **Mongoose Queries**: Utilizes Mongoose queries for efficient database operations.
- **Indexing**: Relevant fields (e.g., `price`, `category`) are indexed for faster queries.
- **Pagination**: Product retrieval routes include pagination to minimize data load and improve performance.

### 5. **ApiFeatures (Advanced Querying)**

- **Filtering**: Allows for complex filtering (e.g., by category, price range, or quantity) when fetching products.
- **Sorting**: Provides sorting capabilities for products (e.g., by price, by name, ascending or descending).
- **Population**: Allows for filtering and sorting on nested documents through population.
- **Field Limiting**: Restrict the fields returned in the response to reduce payload size.

### 6. **Global Error Handler**

- **ApiError Handling**: A custom error class to handle various types of errors across the API, including validation and database errors.
- **User-Friendly Error Messages**: The error responses are clear and user-friendly, providing necessary details for debugging and resolution.
- **HTTP Status Codes**: Proper HTTP status codes are returned for each error type (e.g., 400 for bad requests, 500 for server errors).

### 7. **Optimized for High Traffic Scenarios**

- **Caching**: Frequently accessed product data can be cached to reduce the load on the database.
- **Scalable Database Design**: MongoDB is used for its scalability and ability to handle large amounts of data efficiently.
- **Indexing**: Key fields (e.g., `price`, `category`, `name`) are indexed for faster querying.

---

## Routes

### 1. **Product Routes (`/api/v1/products`)**

All product-related routes are prefixed with `/api/v1/products`. These routes are protected, and only authenticated admin users can access them.

- **POST `/api/v1/products`** - Create a new product. Admins can provide product details (name, category, price, quantity) to create a new product.
- **GET `/api/v1/products`** - Retrieve all products with optional pagination, sorting, and filtering options.
- **GET `/api/v1/products/:productId`** - Retrieve a specific product by its ID.
- **PUT `/api/v1/products/:productId`** - Update a product by its ID (e.g., price, quantity, category).
- **DELETE `/api/v1/products/:productId`** - Delete a product by its ID.

### 2. **Authentication Routes (`/api/v1/auth`)**

All authentication-related routes are prefixed with `/api/v1/auth`. These routes are for logging in and obtaining a JWT token for authenticated admins.

- **POST `/api/v1/auth/login`** - Authenticate an admin with email and password to receive a JWT token.
- **POST `/api/v1/auth/register`** - Register a new admin user with name, email, password, and other required details.

---

## Example Protected Routes

1. **Create Product**
   - Method: `POST`
   - URL: `/api/v1/products`
   - Description: Admins can create a new product with details such as name, category, price, and quantity.
   - Protected: Yes (Requires JWT authentication)
2. **Get All Products**

   - Method: `GET`
   - URL: `/api/v1/products`
   - Description: Retrieve all products with optional query parameters for pagination, sorting, and filtering.
   - Protected: Yes (Requires JWT authentication)

3. **Update Product**

   - Method: `PUT`
   - URL: `/api/v1/products/:productId`
   - Description: Update product details (price, category, etc.) for a specific product.
   - Protected: Yes (Requires JWT authentication)

4. **Delete Product**
   - Method: `DELETE`
   - URL: `/api/v1/products/:productId`
   - Description: Delete a product by its ID.
   - Protected: Yes (Requires JWT authentication)

---

## Files Overview

### 1. **ApiFeatures.js**

- This file provides a set of features for querying the MongoDB database efficiently. It includes methods for filtering, sorting, limiting fields, and pagination.

### 2. **ApiError.js**

- This file defines a custom error class to standardize error handling across the API. It helps in creating specific error messages for different scenarios (e.g., validation errors, not found errors).

### 3. **GlobalErrorHandler.js**

- This file contains the middleware that handles all uncaught errors globally. It ensures that all errors are handled gracefully, providing proper HTTP status codes and descriptive error messages.

---

## Postman Collection

You can import the Postman Collection for testing the API endpoints into your Postman application using the following link:

[Postman Collection: Inventory API](#) _([Insert actual link to your Postman Collection](https://documenter.getpostman.com/view/23525113/2sAYX8KhFj))_

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Feel free to submit issues, feature requests, or pull requests for improvements to this project!
