#commit 690f1cf304b3d31fd37e2fdda4d2583d8b3c682c:  Custom Dynamic Middleware for ApiKey and Permissions to improve api security
- Create a custom middleware to check the permission and api key from request header
- Only requests containing a valid api key and permission can pass to the next route handler

#commit 95ac18531a7d0f4b6f599e26cfbc041eae9874fc: update Key initializing by common version
- Implementing the common way for auth for less confidential and sensitive systems
- Performance can be better

 #commit 8b6c0b18c366ba175eb99d3e409e1b18665d03a4:  Setup signup api with symetric key
- The most effective and secure method for auth

#handle refresh token
**version 1:
- when access token is expired, user needs to send refresh token to server to request a new key pair.
- to prevent token from being stolen, we need to store used refresh token in an array, if it was used to request new key pair, it can be considered suspicious attempt.
**version 2:
    Known issue: router.use(authentication) which requires accessToken, placed before handleRefreshToken. In this case, accessToken is expired and checking it in auth is none-sense.

#commit f08c4d1630cd236052ed955a62e3872e7a54a0b7: Optimize Product API
- update userId from req (which is passed from auth) into product_shop
- update parent Product _id = child Product _id (ex: Product._id = Electronics._id)