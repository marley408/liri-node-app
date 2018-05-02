// here we add code to read and set any environment variables with the dotenv package:
//we ran npm install dotenv
require("dotenv").config();

//*Setup variables
// Add the code required to import the keys.js file and store it in a variable.
var keys = require('./keys')
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require('fs') // 'do-what-it-says'



// slice specifies an element index and pulls it out of array and into a new array. this is saying everything after index 2 until end of array (dont need .length)
var songName = process.argv.slice(3).join(' ');
var spotify = new Spotify(keys.spotify);


function spotifyIt(songName) {
  if(songName.length === 0){
    songName = 'all the small things' //if no song is provided
  }
  return spotify.search({ type: 'track', query: songName, limit:5 }, function(err, data) {
    // console.log(err, data)
    if (err) {     
      return console.log('Error occurred: ' + err);
    } else {
      var songInfo = data.tracks.items[0]
      console.log(songInfo.artists[0].name)
      console.log(songInfo.name)
      console.log(songInfo.album.name)
      console.log(songInfo.preview_url)
    }
  
  });
}


//* Twitter *
var client = new Twitter(keys.twitter);


function myTweets() {
  var params = {screen_name: 'matt98873632'};

  return client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (let key in tweets){
        console.log(tweets[key].text)
    }
    }
  });
}


// ** OMDB **  

var request = require("request")
// store all arguments in an array
var nodeArgs = process.argv


function movieInfo(){ 
  // Grab or assemble the movie name and store it in a variable called "movieName"
  var movieName = ""
  
  // loop thru words in node arg. ignoring the first three Node arguments with var i = 3
  for(var i =3; i <nodeArgs.length; i++){
    if (i > 3 && i < nodeArgs.length){
      movieName = movieName + "+" + nodeArgs[i]
    }
    else {
      movieName += nodeArgs[i]
    }
  }
    
  // Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy&tomatoes=true";

  // This line is just to help us debug against the actual URL.
  // console.log(queryUrl);
  
  // Then create a request to the queryUrl
  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Release year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
      console.log("Country produced in: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
    
  });
};

//* 'do-what-it-says'

function readAndrun(){
  fs.readFile('random.txt', 'utf8', function(err, data){
    if(err){
      console.log(err)
    }
    
    const args = data.split(',');
    var command = args[0];
    const argument = args[1];
       
    switch (command) {
      case 'spotify-this-song':
        spotifyIt(argument);
        break;
    }
  })
}


//** Commands */

  const command = process.argv[2];

  
  switch (command) {
    case 'spotify-this-song':
      spotifyIt(songName);
      break;
    case 'my-tweets':
      myTweets();
      break;
    case 'do-what-it-says':
      readAndrun();
      break;
    case 'movie-this':
      movieInfo();
      break;
    default:
      break;
  }
