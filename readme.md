This project was written for educational purposes only - both frontend and backend parts of appilcation were written as the part of a team project.
Express js framework was used to run the server and prvide the reliable server-side logic for the current application. The router logic was built using the callback principle: each route was separately handled in its own dedicated file (e.g. roots/api/auth, roots/api/users, roots/api/books), which in place helps to maintain the  readability and accelerate error-catch process if needed.
Separate controller's functions were added to handle the logic of router's methods as well as process response and request headers.
Mongoose ODM library was used to enforce the specific schema for the application (e.g. user, book, planning models).

The project was deployed on the "Render" cloud platform - the link for the backend application is as follows: 
https://github.com/dairedo7/goit-team-project-backend

Don't forget to check out the frontend written for this application specifically: 
https://book-reading-app.vercel.app/
