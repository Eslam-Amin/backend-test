# Inventory Admin API Documentation

## **Challenge 1: Build a RESTful API with Node.js, Express, Express Validator, and JWT Authentication**

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

Certainly! Below is the updated **Files Overview** with `server.js` included as a separate file.

---

## Files Overview

### **Folder Structure**

```
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   └── handlers.js
├── models/
│   ├── userModel.js
│   └── productModel.js
├── routers/
│   ├── authRouter.js
│   └── productRouter.js
├── startup/
│   ├── app.js
│   ├── db.js
│   └── createUserAndAdmin.js
├── utils/
│   ├── ApiError.js
│   ├── ApiFeatures.js
│   ├── CapitalizeFirstLetter.js
│   ├── constant.js
│   └── generateCode.js
├── validators/
│   ├── authValidator.js
│   └── productValidator.js
├── server.js
```

### **1. controllers/**

- **authController.js**: Handles user authentication logic (login, registration, token generation, etc.).
- **productController.js**: Manages product-related logic (creating products, updating product details, etc.).
- **handlers/**: Contains error handling logic for controllers (e.g., centralized error handling).

### **2. models/**

- **userModel.js**: Defines the user schema for MongoDB (including fields like email, password, etc.).
- **productModel.js**: Defines the product schema for MongoDB (including fields like name, price, category, etc.).

### **3. routers/**

- **authRouter.js**: Handles all authentication routes (login, registration, etc.).
- **productRouter.js**: Handles all product-related routes (create, update, delete products, etc.).

### **4. startup/**

- **app.js**: Sets up the Express app (configuring middlewares, routes, etc.).
- **db.js**: Contains logic for connecting to the MongoDB database.
- **createAdmin.js**: Logic for creating the default admin user in the database (if needed).

### **5. utils/**

- **ApiError.js**: A custom error handler that provides a structured response for errors.
- **ApiFeatures.js**: Utility that contains methods for filtering, sorting, limiting fields, and pagination for MongoDB queries.
- **CapitalizeFirstLetter.js**: A utility function to capitalize the first letter of a string.
- **constant.js**: Stores constant values (like status codes, roles, etc.).
- **generateCode.js**: Generates random codes or unique identifiers (for example, product codes).

### **6. validators/**

- **authValidator.js**: Validates user input for authentication (e.g., email, password).
- **productValidator.js**: Validates product input (e.g., name, category, price).

### **7. server.js**

- **server.js**: The entry point of the application. It initializes the Express server and connects the app to the database. This file starts the application and listens for incoming requests.

---

### **Explanation of `server.js`**:

- **server.js** is the entry point for starting the server.
- It imports and configures all the necessary files (such as `app.js`, database connection setup, etc.).
- It ensures the server is running on a specified port and is ready to handle requests.

---

## Postman Collection

You can import the Postman Collection for testing the API endpoints into your Postman application using the following link:

[Postman Collection: Inventory API](https://documenter.getpostman.com/view/23525113/2sAYX8KhFj)

---

## **Challenge 2: Optimized SQL/NoSQL Queries**

### **Objective**

Write optimized SQL/NoSQL queries to retrieve product data efficiently.

### **Requirements:**

#### **SQL Query** (Assuming PostgreSQL):

**Task**: Write a query to retrieve products with a price between $50 and $200, ordered by price (ascending), with pagination (10 products per page).

**SQL Query:**

```sql
SELECT *
FROM products
WHERE price BETWEEN 50 AND 200
ORDER BY price ASC
LIMIT 10 OFFSET (page_number - 1) * 10;
```

**Explanation of the query:**

- `WHERE price BETWEEN 50 AND 200`: Filters products with prices between $50 and $200.
- `ORDER BY price ASC`: Sorts the results by price in ascending order.
- `LIMIT 10 OFFSET (page_number - 1) * 10`: Implements pagination by displaying 10 products per page.

#### **NoSQL Query** (Assuming MongoDB):

**Task**: Write a query to retrieve products by category (e.g., "Electronics"), sorted by price in descending order. Limit the result to 5 products per page.

**MongoDB Query:**

```javascript
db.products
  .find({ category: "Electronics" })
  .sort({ price: -1 })
  .skip((page_number - 1) * 5)
  .limit(5);
```

**Explanation of the query:**

- `{ category: "Electronics" }`: Filters products belonging to the "Electronics" category.
- `.sort({ price: -1 })`: Sorts the results by price in descending order.
- `.skip((page_number - 1) * 5)`: Skips items displayed in previous pages.
- `.limit(5)`: Limits the results to 5 products per page.

### **Optimizations**:

#### **1. SQL Query Optimizations:**

- **Indexes**:

  - Create an index on the `price` column to improve filtering and sorting speed.
  - Create an index on the `category` column if queries often filter by category.
  - Add an index on `created_at` column for optimizing time-based queries.

  **Example of creating an index on the price column:**

  ```sql
  CREATE INDEX idx_price ON products(price);
  ```

- **Caching**:
  - Use caching (e.g., Redis) to store frequently queried results. This reduces the load on the database by serving results from memory.

#### **2. NoSQL Query Optimizations:**

- **Indexes**:

  - Create indexes on frequently queried fields like `category` and `price`.

  **Example of creating an index in MongoDB:**

  ```javascript
  db.products.createIndex({ category: 1 });
  db.products.createIndex({ price: -1 });
  ```

- **Caching**:
  - Use caching tools like Redis to store results for popular queries, which helps reduce the load on the database.

### **Optimization for High Traffic Scenarios**:

- **SQL**:

  - **Indexing**: Create indexes on columns used for filtering and sorting, such as `price`, `category`, and `created_at`.
  - **Reduce Complex Queries**: Minimize the use of complex joins or avoid them if possible to speed up the queries.
  - **Caching**: Use caching to store frequently requested data, reducing the load on the database.

- **NoSQL**:
  - **Use Indexes**: Create indexes on frequently queried fields like `category` and `price`.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Feel free to submit issues, feature requests, or pull requests for improvements to this project!
