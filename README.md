# Back-end

Route for public jokes:
GET /api/jokes

Route for Login:
POST /api/login

Route for Register:
POST /api/register

## Must pass token into headers for anything that follows ##
Route to Post Joke: 
POST /api/restricted/jokes


Route for Private jokes:
GET /api/restricted/jokes/:id

Route for Saved Jokes:
GET /api/restricted/saved/:id
pass in the user id

POST /api/restricted/saved
must pass in user_id, posted_user_id, and joke_id


Route for Edit/delete jokes
PUT/DEL /api/restricted/joke/:id