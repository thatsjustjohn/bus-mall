'use strict';
//get DOM elements
var imageUl = document.getElementById('image-survey');
var statsUl = document.getElementById('image-statistics');

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
// Arrays to hold data for the chart
var votes = [];
var chartNames = [];

// ++++++++++++++++++++++++++++++++++++++++++++
// DATA - Constructor and instances
// ++++++++++++++++++++++++++++++++++++++++++++
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

// ++++++++++++++++++++++++++++++++++++++++++++
// FUNCTION DECLARATIONS
// ++++++++++++++++++++++++++++++++++++++++++++

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

//Create title names for list
function populateChartNames(){
  //clear array
  chartNames = [];
  //populate array
  imageLength = imageNames.length;
  for(let i = 0; i < imageLength; i++){
    chartNames[i] = (imageNames[i].split('.').slice(0, -1).join('.'));
  }
  console.log('', chartNames);
}

//Create votes array from votes per object
function populateVotes(){
  //clear array
  votes = [];
  //populate array
  imageLength = imageNames.length;
  for(let i = 0; i < imageLength; i++){
    votes[i] = (images[i].votes);
  }
  console.log('votes', votes);
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

//This function renders the statistics for the survery via list
function renderListStatistics() {
  //get length of image list
  let imageLength = images.length;
  console.log(imageLength);
  for(let i = 0; i < imageLength; i++){
    //This creats a list item element and gets the attributes and appends it to Underorder list
    let liEl = document.createElement('li');
    //print "3 votes for the Banana Slicer" to underordered list
    liEl.innerHTML = `${images[i].votes} votes for the ${images[i].name}`;
    statsUl.appendChild(liEl);
  }
}

//This function renders the statistifs for the surery via chart
function renderChartStatistics() {
  //we only want to draw the chart once.
  if(!chartDrawn){
    //populate data for the chart.
    populateChartNames();
    populateVotes();
    //data.datasets[0].data = votes;
    //data.labels = chartNames;
    drawChart();
    console.log('chart was drawn');
  }
  // //get length of image list
  // let imageLength = images.length;

  // for(let i = 0; i < imageLength; i++){

  // }
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

// ++++++++++++++++++++++++++++++++++++++++++++
// CHART STUFF
// Charts rendered using Chart JS v.2.6.0
// http://www.chartjs.org/
// ++++++++++++++++++++++++++++++++++++++++++++

function drawChart() {
  var data = {
    labels: chartNames, // titles array we declared earlier
    datasets: [{
      data: votes, // votes array we declared earlier
      backgroundColor: [
        'bisque',
        'darkgray',
        'burlywood',
        'lightblue',
        'navy',
        'bisque',
        'darkgray',
        'burlywood',
        'lightblue',
        'navy',
        'bisque',
        'darkgray',
        'burlywood',
        'lightblue',
        'navy',
        'bisque',
        'darkgray',
        'burlywood',
        'lightblue',
        'navy',
        'bisque',
        'darkgray',
        'burlywood',
        'lightblue',
        'navy'
      ],
      hoverBackgroundColor: [
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple',
        'purple'
      ]
    }]
  };

  var ctx = document.getElementById('voting-chart').getContext('2d');
  imageChart = new Chart(ctx, {
    type: 'bar',
    data: data,
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

//function to hide the chart.
function hideChart() {
  document.getElementById('funky-chart').hidden = true;
}

// ++++++++++++++++++++++++++++++++++++++++++++
// MAIN FUNCTION CALLS
// ++++++++++++++++++++++++++++++++++++++++++++

//populate images
populateImageList(imageNames);

//populate first random images
getRandomImages(numberOfImagesForSurvery);

//renders all the images for the current list
renderRandomImages(imageListCurrent);

// ++++++++++++++++++++++++++++++++++++++++++++
// EVENT LISTENERS
// ++++++++++++++++++++++++++++++++++++++++++++
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
      //renderListStatistics();
      renderChartStatistics();
      console.log(images);
    }
  }
});



