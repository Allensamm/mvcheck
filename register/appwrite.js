import { Client, Account, ID, Databases } from "appwrite";


const appwriteendpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const appwriteId = import.meta.env.VITE_APPWRITE_PROJECTID
const databaseId = import.meta.env.VITE_APPWRITEDATABASEID
const usercollecton = import.meta.env.VITE_APPWRITE_USERSCOLLECTION 
// alerts


//appwrite config
const client = new Client();
const database = new Databases(client)

client
  .setEndpoint(`${appwriteendpoint}`)
  .setProject(`${appwriteId}`);

const account = new Account(client);

let loginform = document.getElementById("loginForm");
loginform.style.display = "none";
let logininstead = document.getElementById("logininstead");
let registerform = document.getElementById("registrationForm");

//to switch into login form
logininstead.addEventListener("click", () => {
  registerform.style.display = "none";
  loginform.style.display = "block";
});

// for the registerform
registerform.addEventListener("submit", async function (event) {
  event.preventDefault();

  let email = document.getElementById("email").value;
  let name = document.getElementById("name").value;
  let password = document.getElementById("password").value;

  try {
    const response = await account.create(ID.unique(),email,password, name);
    const dataBase = await database.createDocument(`${databaseId}`, `${usercollecton}` , ID.unique(), {
      name,
      email, 
    })
    console.log(response);
    console.log('this is for database' ,dataBase);
  } catch (error) {
    console.log(error);
    if (
      error.message.includes(
        "Invalid `password` param: Password must be at least 8 characters"
      )
    ) {
      
    } else {
      null;
    }
  }
});

// logic for login
loginform.addEventListener("submit", async function (event) {
  event.preventDefault();

  let loginemail = document.getElementById("loginemail").value;
  let loginpassword = document.getElementById("loginpassword").value;

  try {
    const response = await account.createEmailSession(
      loginemail,
      loginpassword
    );
    
    const userName = await account.get()
    const username = userName.name

  localStorage.setItem('username', username)
    localStorage.setItem("loggedInUser", JSON.stringify(response));
    window.location.href =  "/";
  } catch (error) {
    console.log(error);
  }
});
