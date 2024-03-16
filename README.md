MovieCheck
Welcome to MovieCheck! This web application allows users to view popular movie posters and interact with them through various social media functions.

Introduction
MovieCheck provides users with a platform to discover and interact with a collection of popular movie posters. Users can register, login, and perform actions such as liking a movie, marking a movie as watched, and leaving comments on movies.


Installation
To install and run MovieCheck locally, follow these steps:

Navigate to the project directory:
cd mvcheck

Install dependencies using npm:
npm install


Run the application:
npm start


Usage
Upon running the application, users will be prompted to register. It's important to remember your password as password recovery functionality is not yet implemented. Once logged in, users will be presented with a list of movies.

Use the search bar at the top to filter movies by title.

Click on any movie to view more details.

In the movie details modal, users can:

View the movie title and poster.
Leave comments about the movie.
Close the modal.
Interact with the movie cards to:

Like a movie.
Mark a movie as watched.
View and leave comments on a movie.



Prerequisites
Node.js (version 14 or above)
npm (version 6 or above)
A TMDB API key
An Appwrite account, including an API endpoint, project ID, and database authentication secret



Features
Browse a collection of movies.
Search for movies by title.
Like movies.
Mark movies as watched.
Leave comments on movies.
Configuration
MovieCheck does not require any additional configuration options or settings.

Contributing
Contributions to MovieCheck are welcome! If you'd like to contribute to this project, please fork the repository and create a pull request with your changes.


Clone the Repository: Begin by cloning the repository of the web application to your local machine using Git. You can do this by running the following command in your terminal:

Install Dependencies: After cloning the repository, navigate to the project directory using the terminal. Once inside the project directory, install the necessary dependencies by running the following command:

note that this is a project made on VITE

cd <project-directory>
<npm install vite@latest . //this-will-install-vite-in-the-cloned-project

<npm install appwrite //note-that-appwrite-version-for-this-project-is-version-13.0.1

Go to https://cloud.appwrite.io/
create a project, create authentication,database storage, create collections.. see the official appwrite documentation
https://appwrite.io/docs


License
This project is licensed under the MIT License. See the LICENSE file for details.


Additional Information
MovieCheck is a work in progress. With the help of passionate JavaScript engineers, we aim to continually improve and enhance this project to provide the best movie viewing experience for our users.

After successful setup of appwrite