Blogilista is a full-stack web application built with React (Vite) frontend and Node/Express backend. It allows users to view, create, like and delete blogs and requires authentication.

You can use the following test user to log in:
Username: klukovki
Password: salasana

To create a new user, use Postman or another API testing tool:
Send a POST request to:
https://blogilist.onrender.com/api/users
and include a JSON body like:
{
  "username": "newuser",
  "name": "New User",
  "password": "yourpassword"
}
