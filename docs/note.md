#commit 8b6c0b18c366ba175eb99d3e409e1b18665d03a4:  Setup signup api with symetric key
- The most effective and secure method for auth

#commit 95ac18531a7d0f4b6f599e26cfbc041eae9874fc: update Key initializing by common version
- Implementing the common way for auth for less confidential and sensitive systems
- Performance can be better

#commit 690f1cf304b3d31fd37e2fdda4d2583d8b3c682c:  Custom Dynamic Middleware for ApiKey and Permissions to improve api security
- Create a custom middleware to check the permission and api key from request header
- Only requests containing a valid api key and permission can pass to the next route handler
 