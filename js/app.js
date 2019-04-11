'use strict';
//get DOM elements
var imageUl = document.getElementById('image-survey');
var footerUl = document.getElementById('canvas-controls');

// ++++++++++++++++++++++++++++++++++++++++++++
// DATA - Variable declarations
// ++++++++++++++++++++++++++++++++++++++++++++
var imageNames = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg'];
var imageListPrevious = []; //holds previous image ids(indexes)
var imageListCurrent = []; //holds current image ids(indexes)
var images = []; //holds all the image objects
var numberOfImagesForSurvery = 3; //this could change
var imageLength = 0; //length of the image array
var numOfVotes = 0; //starting number of votes
var maxVotes = 25; //max votes made this so it can be adjusted
var imageChart; //image chart
var chartDrawn = false; //chartDrawn value
var imagesSaved = false;
var dataLoaded = false;

// ++++++++++++++++++++++++++++++++++++++++++++
// DATA - Constructor and instances
// ++++++++++++++++++++++++++++++++++++++++++++
function ImageConstructor(fileName, votes, views) {
  this.filePath = `img/${fileName}`;
  this.name = fileName.split('.').slice(0, -1).join('.');
  this.votes = votes;
  this.views = views;
  //increments votes
  this.incrementVotes = function(){
    this.votes++;
  };
  //increments views
  this.incrementViews = function(){
    this.views++;
  };
}

var dataVote = {
  labels: [], // titles array we declared earlier
  datasets: [{
    label: 'Number of Votes',
    data: [], // votes array we declared earlier
    backgroundColor: '#1FE3B1',
    hoverBackgroundColor: '#516AF6'
  },{
    label: 'Number of Views',
    data: [], // votes array we declared earlier
    backgroundColor: '#38A7D4',
    hoverBackgroundColor: '#516AF6'
  }]
};
// ++++++++++++++++++++++++++++++++++++++++++++
// FUNCTION DECLARATIONS
// ++++++++++++++++++++++++++++++++++++++++++++

//Checks for loaded data this will help clean up code and avoid unnecessary reloads
function loadData(){
  if(!dataLoaded){
    if(localStorage){ //if local storage
      if(localStorage.length === 0){ //if local storage is empty
        //create objects from array
        //populate images
        populateImageList(imageNames);
      }else{
        //read from local storage
        retrieveImageClasses();
      }
    }
    dataLoaded = true;
  }
}

//saves all the image class objects to local storage
function saveImageClasses(){
  //saves all images data to local storage
  //if local storage exists and they images haven't been saved
  if(localStorage && !imagesSaved) {
    localStorage.setItem('images', JSON.stringify(images));
    imagesSaved = true;
  }else if(imagesSaved){
    console.log('Image Data: already saved');
  }else{
    alert('There was a problem saving to local storage');
  }
}

function retrieveImageClasses(){
  let imageObjects = readLocalStorage();
  if(imageObjects){
    //we have retrieved objects
    //clear images
    images = [];
    let imageLength = imageObjects.length;
    for(let i = 0; i < imageLength; i++){
      //create image classes
      //Note the split and pop to avoid cotinually adding the file extention.
      images.push(new ImageConstructor(imageObjects[i].filePath.split('/').pop(), imageObjects[i].votes, imageObjects[i].views));
    }
  }else{
    //if we didn't retrieve anything (or failed too)
    images = [];
    //create objects with 0 votes and 0 views the default way
    populateImageList(imageNames);
  }
}

//reads local storage and returns data to restrieve image classes
function readLocalStorage(){
  let retrievedJSONData = localStorage.getItem('images');
  return JSON.parse(retrievedJSONData);
}


//populate image list
function populateImageList(imageNames){
  //clear array
  images = [];
  //populate array
  imageLength = imageNames.length;
  for(let i = 0; i < imageLength; i++){
    //since this is the CREATION votes and views are 0
    images.push(new ImageConstructor(imageNames[i], 0, 0));
  }
}

//Create title names for list
function populateChartNames(){
  //clear array
  dataVote.labels = [];
  //populate array
  imageLength = imageNames.length;
  for(let i = 0; i < imageLength; i++){
    dataVote.labels[i] = (imageNames[i].split('.').slice(0, -1).join('.'));
  }
}

//Create votes array from votes per object
function populateVotes(){
  //clear array
  dataVote.datasets[0].data = [];
  //populate array
  imageLength = imageNames.length;
  for(let i = 0; i < imageLength; i++){
    dataVote.datasets[0].data[i] = (images[i].votes);
  }
}

//Create votes array from votes per object
function populateViews(){
  //clear array
  dataVote.datasets[1].data = [];
  //populate array
  imageLength = imageNames.length;
  for(let i = 0; i < imageLength; i++){
    dataVote.datasets[1].data[i] = (images[i].views);
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
  while(imageListCurrent.length !== maxImages){
    //gets a random number
    let randomNumber = getRandomNumber(0, imageLength);
    //check to see if its in the list
    if(!imageListCurrent.includes(randomNumber) && !imageListPrevious.includes(randomNumber)){
      //if its not in the list push it to the array
      imageListCurrent.push(randomNumber);
      //increment view count for image
      images[randomNumber].incrementViews();
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
    liEl.innerHTML = `<img id="${imageListCurrent[i]}" width="300px" height="300" src="${images[imageListCurrent[i]].filePath}" alt="${images[imageListCurrent[i]].name}" title="${images[imageListCurrent[i]].name}">`;
    imageUl.appendChild(liEl);
  }
}

//This function renders the statistifs for the surery via chart
function renderChartStatistics() {
  //we only want to draw the chart once.
  //populate data for the chart.
  populateChartNames();
  populateVotes();
  populateViews();
  if(!chartDrawn){
    drawChart();
    showChart();
    console.log('chart was drawn');
  }else{
    imageChart.update();
    showChart();
  }
}

//This fucntion just clears all the images from the UL
function clearRandomImages(){
  while (imageUl.firstChild) {
    imageUl.removeChild(imageUl.firstChild);
  }
}

//This function handles the clicks in the UL and appropriately calls functions for a round
function handleSurveyClick(id) {
  //ids have O(1) lookup unless we store items in hashtable
  //call function to update stats
  images[id].incrementVotes();
  if(numOfVotes < 25){
    //get new random images
    getRandomImages(numberOfImagesForSurvery);
    //clear previous
    clearRandomImages();
    //render new
    renderRandomImages(imageListCurrent);
  }else{
    alert('You have reach the max number of votes!');
    //SAVE DATA ON FINISHED FOR VOTING
    //CLEAR data and maybe show top 3 for view / vote
    saveImageClasses();
    //renderListStatistics();
    renderChartStatistics();
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++
// CHART STUFF
// Charts rendered using Chart JS v.2.6.0
// http://www.chartjs.org/
// ++++++++++++++++++++++++++++++++++++++++++++

//function to draw the chart
function drawChart() {
  var ctx = document.getElementById('voting-chart').getContext('2d');
  imageChart = new Chart(ctx, {
    type: 'bar',
    data: dataVote,
    options: {
      responsive: false,
      animation: {
        duration: 100,
        easing: 'easeOutBounce'
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          max: 10,
          min: 0,
          stepSize: 1.0
        }
      }]
    }
  });
  chartDrawn = true;
}

//function to show chart
function showChart() {
  document.getElementById('voting-chart').style.visibility = 'visible';
  document.getElementById('voting-chart').style.display = 'block';
}

//function to hide the chart.
function hideChart() {
  document.getElementById('voting-chart').style.visibility = 'hidden';
  document.getElementById('voting-chart').style.display = 'none';
}

// ++++++++++++++++++++++++++++++++++++++++++++
// MAIN FUNCTION CALLS
// ++++++++++++++++++++++++++++++++++++++++++++

function main(){
  //loads data from local storage or creates a new structures or does nothing
  loadData();

  //clear random images incase any exist
  clearRandomImages();

  //populate first random images
  getRandomImages(numberOfImagesForSurvery);

  //renders all the images for the current list
  renderRandomImages(imageListCurrent);
}

//This add an event listen to the UL.
imageUl.addEventListener('click', function(e){
  //makes sure you clicked on something good.
  if (e.target && e.target.alt) {
    //if statement to handle number of votes
    if(numOfVotes < maxVotes){
      //increment votes
      numOfVotes++;
      handleSurveyClick(e.target.id, e.target.alt);
    }else{
      //handle max votes
      alert('You have reach the max number of votes!');
      //SAVE DATA ON FINISHED FOR VOTING
      saveImageClasses();
      renderChartStatistics();
    }
  }
});

//This add an event listen to the UL.
footerUl.addEventListener('click', function(e){
  //makes sure you clicked on something good
  if (e.target) {
    if(e.target.innerText === 'Reset Stats'){
      if(localStorage){
        //clear local storage and image variables
        localStorage.clear();
      }
      //clear image objects
      images = [];
      //since we are clearing all the data we need to remake images
      //could maybe do a function to just make votes and views [] as well.
      dataLoaded = false;
      //reset chart and hide chart
      hideChart();
      //set votes to 0
      numOfVotes = 0;
      main();
    }else if(e.target.innerText === 'Retake Survey'){
      //reset chart and hide chart
      hideChart();
      numOfVotes = 0;
      main();
    }
  }
});

// ++++++++++++++++++++++++++++++++++++++++++++
// MAIN
// ++++++++++++++++++++++++++++++++++++++++++++
main();
