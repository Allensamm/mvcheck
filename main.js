import "./style.css";
import eyepng from './public/eye.png'
import like from './public/like.png'
import comment from './public/comment.png'
import { Client, Account, ID, Databases, Query } from "appwrite";
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const projectId = import.meta.env.VITE_APPWRITE_PROJECTID
const databaseAuth = import.meta.env.VITE_DATABASEAUTH
const commmenttext = document.querySelector(".comment--text");
const commentbtn = document.querySelector(".post--comment");
const loggedInUser = localStorage.getItem("username");

//appwrite config
const client = new Client();

client
  .setEndpoint(`${endpoint}`) // Your API Endpoint
  .setProject(`${projectId}`);

// const account = new Account(client);
const database = new Databases(client);
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      `Bearer ${databaseAuth}`,
  },
};

const databaseId = import.meta.env.VITE_APPWRITEDATABASEID
  const likescollection = import.meta.env.VITE_APPWRITELIKESCOLLECTIONID
  const seencollection = import.meta.env.VITE_VITE_APPWRITESEENCOLLECTIONID
  const commentcollection = import.meta.env.VITE_VITE_APPWRITECOMMENTCOLLECTIONID
// to get ht eloggedin user
document.addEventListener("DOMContentLoaded", function () {
  const loggedInUser = localStorage.getItem("username");
  const userlogo = loggedInUser
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  if (loggedInUser) {
    showMovies();
    document.querySelector(".account").innerHTML = `<span style='font-weight: 700; ' class='username' title='${loggedInUser}'>${userlogo}</span>
    `;
    let register = (document.querySelector(".register").style.display = "none");
  } else {
  }
});

//for page navigation
let currentPage = 1;
let loading = false;

//for getting the movies

async function showMovies(page = 1) {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`,
    options
  );
  const movies = await res.json();
  const movieContainer = document.getElementById("movie-container");
  //loading div
  const loadingDiv = document.getElementById("loading");

  movies.results.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
      <div class='movie-card-cover'>
        <div>
          <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title} Poster" class="movie-image">
          <h2>${movie.title}</h2>
          <p>Release Date: ${movie.release_date}</p>
          <p class='overview'>${movie.overview}</p>
        </div>

        <div class='flex-flex'>

        <div class='activity'>
          <div class='button--cover'>
             <button class='seen--button'>
              <img class='seen--button' data-movie-id='${movie.id} ${movie.title}' src='${eyepng}'>
            </button>               
          </div>
          <div class='button--cover'>
            <button  >
              <img class='like--button' data-movie-id='${movie.id} ${movie.title}' src='${like}'>
            </button>           
          </div>
          <div class='button--cover'>
            <button>
              <img class='comment--button' data-movie-id='${movie.id}' 
              data-movie-title='${movie.title}' 
              data-movie-poster='${movie.poster_path}' src='${comment}'>
            </button>             
          </div>
        </div>
            <div class='counts'>
              <span class='countseen'>0</span>
              <span class='countlike'>0</span>
              <span class='countcomments'>0</span>
            </div>
        </div>
      </div>
    `;

    // Append all movie cards to the container
    movieContainer.appendChild(movieCard);
  });

  // Add event listener for the search input
  document.getElementById("search").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();

    // Filter movie cards based on the search term
    const movieCards = document.querySelectorAll(".movie-card");
    movieCards.forEach((movieCard) => {
      const movieTitle = movieCard
        .querySelector("h2")
        .textContent.toLowerCase();
      movieCard.style.display = movieTitle.includes(searchTerm)
        ? "block"
        : "none";
    });
  });

  loading = false;
  loadingDiv.style.display = "none";

  //for counting the likes
  // let likecount = 0;

  //for the each individual movie card
  const movieCard = document.querySelectorAll(".movie-card-cover");
  let currentModalMovieId, currentModalMovieTitle, currentModalMoviePoster;
  

  movieCard.forEach(async (card) => {
    let likeClicked = false;
    let seenClicked = false;
    
    const movieId = card.querySelector(".like--button").dataset.movieId;
    const movieSeenId = card.querySelector(".comment--button").dataset.movieId;
    try {
      // Fetch the like count for the current movie from Appwrite
      const query = [Query.equal("name-id-movie", movieId)]; // Adjusted the query to filter by movieId;
      const likeCountResponse = await database.listDocuments(
        `${databaseId}`, // Your collection ID
        `${likescollection}`, // Your document ID
        query
      );
      // Extract the like count from the response
      const likeCount = likeCountResponse.documents[0].likes;
      // Update the UI with the fetched like count
      const countLikeElement = card.querySelector(".countlike");
      countLikeElement.textContent = likeCount;
    } catch (error) {
     
    }

    try {
      // updating the seen count from the database
      const query = [Query.equal("movieid", movieId)];
     
      const existingWatch = await database.listDocuments(
        `${databaseId}`,// Your collection ID
        `${seencollection}`, // Your document ID
        query
      );
      

      const seenCount = existingWatch.documents[0].seencount;
      const seenElement = card.querySelector(".countseen");
      seenElement.textContent = seenCount;
    } catch (error) {}


    try {
      const query = [
        Query.equal("movieid", movieSeenId), // Adjusted the query to filter by movieId
      ];
  
      // Fetch comments from the database based on the query
      
      const comments = await database.listDocuments(
        `${databaseId}`,
        `${commentcollection}`,
        query
      );
      const commentCount = comments.total
      const commentElement = card.querySelector('.countcomments')
      commentElement.textContent = commentCount
      
    } catch (error) {
      
    }
    //for each card add an eventlistner
    card.addEventListener("click", async (event) => {
      if (event.target.classList.contains("like--button")) {
        const movieId = event.target.dataset.movieId;
        const loggedInUser = localStorage.getItem("username");

        try {
          const countLikeElement = event.target
            .closest(".movie-card-cover")
            .querySelector(".countlike");
          const likeButton = event.target
            .closest(".movie-card-cover")
            .querySelector(".like--button");
          if (!likeClicked) {
            countLikeElement.textContent =
              parseInt(countLikeElement.textContent) + 1;
           
            likeClicked = true;
      
            const query = [
              Query.equal("name-id-movie", movieId), // Adjusted the query to filter by movieId
            ];
            try {

              const existinglikes = await database.listDocuments(
                `${databaseId}`, // Your collection ID
                `${likescollection}`, // Your document ID
                query
              );
              if (existinglikes.documents.length > 0) {
                const documentId = existinglikes.documents[0].$id;

                const updateLikes =
                  parseInt(existinglikes.documents[0].likes) + 1;

                await database.updateDocument(
                  `${databaseId}`, // Your collection ID
                  `${likescollection}`, // Your document ID
                  documentId,
                  {
                    likes: updateLikes,
                  }
                );
              } else {
                const promise = database.createDocument(
                  `${databaseId}`,
                  `${likescollection}`,
                  ID.unique(),
                  {
                    likes: parseInt(countLikeElement.textContent),
                    "name-id-movie": movieId,
                  }
                );
              }
            } catch (error) {}
          } else {
           
    
          }
        } catch (error) {
          
        }
      } else if (event.target.classList.contains("seen--button")) {
        const movieId = event.target.dataset.movieId;
        const loggedInUser = localStorage.getItem("username");
       

        try {
          const countSeenElement = event.target
            .closest(".movie-card-cover")
            .querySelector(".countseen");

          if (!seenClicked) {
            countSeenElement.textContent =
              parseInt(countSeenElement.textContent) + 1;
            seenClicked = true;

            const query = [Query.equal("movieid", movieId)];

            try {
              const existingWatch = await database.listDocuments(
                `${databaseId}`, // Your collection ID
                `${seencollection}`, // Your document ID
                query
              );

              

              if (existingWatch.documents.length > 0) {
                const documentId = existingWatch.documents[0].$id;
                const updatedWatch =
                  parseInt(existingWatch.documents[0].seencount) + 1;
                await database.updateDocument(
                  `${databaseId}`, // Your collection ID
                  `${seencollection}`, // Your document ID
                  documentId,
                  {
                    seencount: updatedWatch,
                  }
                );
              } else {
                const promise = database.createDocument(
                  `${databaseId}`, // Your collection ID
                  `${seencollection}`, // Your document ID
                  ID.unique(),
                  {
                    seencount: parseInt(countSeenElement.textContent),
                    movieid: movieId,
                  }
                );
              }
            } catch (error) {
             
            }
          } else {
            // Logic for handling the case where seen is already clicked
          }
        } catch (error) {
        
        }
      } else if (event.target.classList.contains("comment--button")) {
        const currentMovieId = event.target.dataset.movieId;
        
        const currentMovieTitle = event.target.dataset.movieTitle;
        const moviePoster = event.target.dataset.moviePoster;
        openModal(currentMovieId, currentMovieTitle, moviePoster);
      }
    });
  });

  const commentsection = document.querySelector(".comment--section");
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");
  const closeModalBtn = document.querySelector(".btn-close");
  const baseUrl = "https://image.tmdb.org/t/p/w300";
  let commentButtonListenerAdded = false;

  if (!commentButtonListenerAdded) {
    // Add event listener to the comment button
    commentbtn.addEventListener("click", () =>
      handleCommentSubmission(currentModalMovieId, currentModalMovieTitle)
    );
    commentButtonListenerAdded = true;
  }

  async function openModal(currentMovieId, currentMovieTitle, moviePoster) {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    currentModalMovieId = currentMovieId;
    currentModalMovieTitle = currentMovieTitle;
    currentModalMoviePoster = moviePoster;

    // Clear the existing comments
    commentsection.innerHTML = "";

    const comments = await fetchComments(currentMovieId);
    const commentsec = document.createElement("div");
    commentsec.classList.add("commentsection--inner");

    
    // Set movie title and poster
    movietitle.innerHTML = currentMovieTitle;
    movieposter.src = baseUrl + moviePoster;

    // Iterate over the comments and append each to the comment section
    comments.forEach((commentinfo) => {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add('commentdiv')
      commentDiv.innerHTML = `
                  <img class="profileUrl" src="" alt="u">
                  <div>
                      <div class="user--commenting">${commentinfo.username}</div>
                      <div class="user--comment">${commentinfo.comment}</div>
                  </div>
              `;
      commentsec.appendChild(commentDiv);
    });

    // Add event listener for comment submission

    // Append the comment section to the modal
    commentsection.appendChild(commentsec);
  }

  const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  closeModalBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", closeModal);

  const movietitle = document.querySelector(".movietitle");
  const movieposter = document.querySelector(".movieposter");

  // movietitle.innerHTML = movieTitle;
  // movieposter.src = baseUrl + moviePoster;

  let currentDate = new Date();
  let time = currentDate.toLocaleTimeString();

  async function handleCommentSubmission() {
    // Retrieve the comment content
    const commentContent = commmenttext.value || commmenttext.textContent;

    // Submit comment to the database
    const promise = await database.createDocument(
      `${databaseId}`,
      `${commentcollection}`,
      ID.unique(),
      {
        movie: currentModalMovieTitle,
        movieid: currentModalMovieId,
        comment: commentContent,
        username: loggedInUser,
        date: time,
      }
    );
    

    // Display the new comment in the comment section
    const newComment = document.createElement("div");
    newComment.innerHTML = `
          <img class="profileUrl" src="" alt="userlogo">
          <div>
            <div class="user--commenting">${loggedInUser}</div>
            <div class="user--comment">${commentContent}</div>
          </div>
        `;
    commentsection.appendChild(newComment);

    // Clear the input after submission
    commmenttext.innerHTML = "";
    commentButtonListenerAdded = false;
  }
}

//fetch comments
async function fetchComments(currentMovieId) {
  try {
    //  query to retrieve comments for the given movie ID
    const query = [
      Query.equal("movieid", currentMovieId), // Adjusted the query to filter by movieId
    ];

    // Fetch comments from the database based on the query
    const response = await database.listDocuments(
      `${databaseId}`,
      `${commentcollection}`,
      query
    );

    // Extract comments from the response and return them
    let comments = response.documents;
    return comments;
  } catch (error) {
   
    return [];
  }
}

//responsoble for loading the infinite scroll logic
function loadNextPage() {
  if (!loading) {
    loading = true;
    currentPage++;
    showMovies(currentPage);
  }
}

function handleScroll() {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const windowHeight = window.innerHeight;
  const bodyHeight = document.body.scrollHeight - windowHeight;

  if (scrollTop > bodyHeight - 1000) {
    loadNextPage();
  }
}

window.addEventListener("scroll", handleScroll);
