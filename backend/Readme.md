# Smart India Hackathon (Backend)

## Auth Routes

1. `auth/google`
Method: GET  
*Will allow user to login through Google account*  
*On Success will send a json message of success else of error*

2. `auth/facebook`
Method: GET  
*Will allow user to login through facebook account*  
*On Success will send a json message of success else of error*

3. `auth/login`
Method: POST  
*Will allow user to login through user credentials*  
*On Success will send a json message of success else of error*


## User Routes

1. `api/user/test`
Method: GET
*Test route for testing purpose*

2. `api/user/current`
Method: GET
*Will send if there is a user logged in*

2. `api/user/logout`
Method: GET
*Will logout the loggedin User*

3. `api/user/update/:id`
Method: POST
*Will update user email and username if no other exists with same info else will send error*

4. `api/user/seller`
Method: GET
*Will return all users of type seller*

5. `api/user/courier`
Method: GET
*Will return all users of type courier*

4. `api/user/buyer`
Method: GET
*Will return all users of type buyer*

## Product routes

1. `api/product/test`
Method: GET
*Test route for testing purpose*

2. `api/product/addproduct`
Method: POST
*To add product in the products databse*

3. `api/product/viewproduct/:id`
Method: GET
*to view a particular product using its id*
*Get the User data by passing id(product.user) in api/user/id/:id*
*Get the Image data by passing id(product.imageId) in api/product/image/:id*

4. `api/product/viewproducts`
Method: GET
*To get a list of all products*
*Get the User data by passing id(product.user) in api/user/id/:id*
*Get the Image data by passing id(product.imageId) in api/product/image/:id*

5. `api/product/image/:id`
Method: GET
*To get a image using its id*


## Bidding routes

1. `api/bid/test`
Method: GET
*Test route for testing purpose*

2. `api/bid/addbidder/:productid`
Method: POST
*To add bidder using product id*

## Search routes

1. `api/search/test`
Method: GET
*Test route for testing purpose*

2. `api/bid/search/:query`
Method: GET
*To find relevant products regarding query*
*It searches within the product's name and description*