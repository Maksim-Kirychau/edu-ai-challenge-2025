# Sample Application Outputs

This document contains sample runs of the Product Search Application with different user requests and their corresponding outputs.

## Sample Run 1: Smartphone Under $800

**User Input:**
```
Enter your search query: I need a smartphone under $800
```

**Application Output:**
```
=== Product Search Application ===
Enter your search query in natural language (e.g., 'I need electronics under $200')
Type 'exit' to quit the application.

Enter your search query: I need a smartphone under $800

Searching for products...

Filtered Products:
1. Smartphone - $799.99, Rating: 4.5, Out of Stock

--------------------------------------------------
```

## Sample Run 2: Smartphone Under $5 (No Results)

**User Input:**
```
Enter your search query: I need a smartphone under 5 dollars
```

**Application Output:**
```
=== Product Search Application ===
Enter your search query in natural language (e.g., 'I need electronics under $200')
Type 'exit' to quit the application.

Enter your search query: I need a smartphone under 5 dollars

Searching for products...

Filtered Products:
No products found matching your criteria.

--------------------------------------------------
```

## Sample Run 3: Electronics Under $200

**User Input:**
```
Enter your search query: I need electronics under $200 with good ratings
```

**Application Output:**
```
=== Product Search Application ===
Enter your search query in natural language (e.g., 'I need electronics under $200')
Type 'exit' to quit the application.

Enter your search query: I need electronics under $200 with good ratings

Searching for products...

Filtered Products:
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Smart Watch - $199.99, Rating: 4.6, In Stock
3. Bluetooth Speaker - $49.99, Rating: 4.4, In Stock
4. Gaming Mouse - $59.99, Rating: 4.3, In Stock
5. External Hard Drive - $89.99, Rating: 4.4, In Stock
6. Portable Charger - $29.99, Rating: 4.2, In Stock

--------------------------------------------------
```

## Sample Run 4: Fitness Equipment with High Ratings

**User Input:**
```
Enter your search query: Show me fitness equipment with rating above 4.5 that are in stock
```

**Application Output:**
```
=== Product Search Application ===
Enter your search query in natural language (e.g., 'I need electronics under $200')
Type 'exit' to quit the application.

Enter your search query: Show me fitness equipment with rating above 4.5 that are in stock

Searching for products...

Filtered Products:
1. Dumbbell Set - $149,99, Rating: 4,7, In Stock
2. Exercise Bike - $499,99, Rating: 4,5, In Stock
3. Foam Roller - $24,99, Rating: 4,5, In Stock

--------------------------------------------------
```

## Sample Run 6: Kitchen Appliances in Stock

**User Input:**
```
Enter your search query: Find kitchen appliances that are in stock
```

**Application Output:**
```
=== Product Search Application ===
Enter your search query in natural language (e.g., 'I need electronics under $200')
Type 'exit' to quit the application.

Enter your search query: Find kitchen appliances that are in stock

Searching for products...

Filtered Products:
1. Blender - $49.99, Rating: 4.2, In Stock
2. Air Fryer - $89.99, Rating: 4.6, In Stock
3. Coffee Maker - $79.99, Rating: 4.3, In Stock
4. Toaster - $29.99, Rating: 4.1, In Stock
5. Electric Kettle - $39.99, Rating: 4.4, In Stock
6. Rice Cooker - $59.99, Rating: 4.3, In Stock
7. Pressure Cooker - $99.99, Rating: 4.7, In Stock

--------------------------------------------------
```

## Notes on Output Format

- Each product is displayed with its name, price, rating, and stock status
- Products are numbered sequentially starting from 1
- The application handles various natural language inputs and extracts relevant filtering criteria
- Results are filtered based on the criteria extracted by OpenAI's function calling
- The application gracefully handles cases where no products match the criteria
- Price formatting uses decimal points (e.g., $99.99) for consistency
- Rating values are displayed with one decimal place (e.g., 4.5)
