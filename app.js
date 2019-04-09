'use strict';
//get DOM elements
var imageUl = document.getElementById('image-survey');
var statsUl = document.getElementById('image-statistics');
//create structure to hold images and data
var imageNames = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
var imageListPrevious = []; //holds previous image ids(indexes)
var imageListCurrent = []; //holds current image ids(indexes)
var images = []; //holds all the image objects
var numberOfImagesForSurvery = 3; //this could change
var imageLength = 0; //length of the image array
var numOfVotes = 0; //starting number of votes
var maxVotes = 25; //max votes made this so it can be adjusted

//image object constructor
function ImageConstructor(fileName) {
  this.filepath = `img/${fileName}`;
  this.name = fileName.split('.').slice(0, -1).join('.');
  this.votes = 0;
  this.views = 0;
  //increments votes
  this.incrementVotes = function(){
    this.votes++;
  };
  //increments views
  this.incrementViews = function(){
    this.views++;
  };
}

//populate image list
function populateImageList(imageNames){
  //clear array
  images = [];
  //populate array
  imageLength = imageNames.length;
  for(let i = 0; i < imageLength; i++){
    images.push(new ImageConstructor(imageNames[i]));
  }
}

// display random image 0 - N being the list size (but not including N) we need to floor this.
// since 19.9 is possible rounding or ceil is not an option since 20 is out of bounds.
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//function to get 0-n random images
function getRandomImages(maxImages){
  imageListPrevious = imageListCurrent;
  imageListCurrent = [];
  imageLength = images.length; //make sure this is up to date
  //loops until we get all the images
  console.log('enter loop');
  while(imageListCurrent.length !== maxImages){
    //gets a random number
    let randomNumber = getRandomNumber(0, imageLength);
    //check to see if its in the list
    if(!imageListCurrent.includes(randomNumber) && !imageListPrevious.includes(randomNumber)){
      //if its not in the list push it to the array
      imageListCurrent.push(randomNumber);
      //increment view count for image
      images[randomNumber].incrementViews();
      console.log('image number', randomNumber);
    }else{
      console.log('duplicate', randomNumber);
    }
  }
}

//This function renders the images based on the 3 current random numbers
//It does this by creating LI elements and appending them to the Unordered list
function renderRandomImages(imageListCurrent){
  //get length of image list
  let imageListLength = imageListCurrent.length;
  for(let i = 0; i < imageListLength; i++){
    //This creats a list item element and gets the attributes and appends it to Underorder list
    let liEl = document.createElement('li');
    //dynamically change pixel size based on how many images (FUTURE)
    liEl.innerHTML = `<img id="${imageListCurrent[i]}" width="300px" height="300" src="${images[imageListCurrent[i]].filepath}" alt="${images[imageListCurrent[i]].name}" title="${images[imageListCurrent[i]].name}">`;
    imageUl.appendChild(liEl);
  }
}

//This function renders the statistics for the survery that was just taken
function renderStatistics() {
  //get length of image list
  let imageLength = images.length;
  console.log(imageLength);
  for(let i = 0; i < imageLength; i++){
    //This creats a list item element and gets the attributes and appends it to Underorder list
    let liEl = document.createElement('li');
    //primnt "3 votes for the Banana Slicer" to underordered list
    liEl.innerHTML = `${images[i].votes} votes for the ${images[i].name}`;
    statsUl.appendChild(liEl);
  }
}

//This fucntion just clears all the images from the UL
function clearRandomImages(){
  while (imageUl.firstChild) {
    imageUl.removeChild(imageUl.firstChild);
  }
}

//This function handles the clicks in the UL and appropriately calls functions for a round
function handleSurveyClick(id, fileName) {
  //id have O(1) lookup unless we store items in hashtable
  console.log(id + ' ' + fileName);
  //call function to update stats
  images[id].incrementVotes();
  //get new random images
  getRandomImages(numberOfImagesForSurvery);
  //clear previous
  clearRandomImages();
  //render new
  renderRandomImages(imageListCurrent);
}

//This add an event listen to the UL.
imageUl.addEventListener('click', function(e){
  console.log(e.target);
  //makes sure you clicked on something good.
  if (e.target && e.target.alt) {
    //if statement to handle number of votes
    if(numOfVotes < maxVotes){
      //increment votes
      numOfVotes++;
      console.log(numOfVotes);
      handleSurveyClick(e.target.id, e.target.alt);
    }else{
      //handle max votes
      alert('You have reach the max number of votes!');
      renderStatistics();
      console.log(images);
    }
  }
});

//FUNCTION CALLS TO DO THE MAIN STUFF
//populate images
populateImageList(imageNames);

//populate first random images
getRandomImages(numberOfImagesForSurvery);

//renders all the images for the current list
renderRandomImages(imageListCurrent);


