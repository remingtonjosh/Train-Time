// Global Variables
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// jQuery global variables
var myTrain = $("#train-name");
var myTrainDestination = $("#train-destination");
// form validation for Time using jQuery Mask plugin
var myTrainTime = $("#train-time").mask("00:00");
var myTimeFreq = $("#time-freq").mask("00");

// Your web app's Firebase configuration

var firebaseConfig = {
  apiKey: "AIzaSyA8Who6y7f2gajwFClqBh8rlTLtCPuocY0",
  authDomain: "fir-6c8c9.firebaseapp.com",
  databaseURL: "https://fir-6c8c9.firebaseio.com",
  projectId: "fir-6c8c9",
  storageBucket: "fir-6c8c9.appspot.com",
  messagingSenderId: "938268537146",
  appId: "1:938268537146:web:93762fb7eaba3e037de003"
};

firebase.initializeApp(firebaseConfig);

// Assigns the reference to the database to a variable named 'database'
var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {
  //firebase information on stoage
  var trainDiff = 0;
  var trainRemainder = 0;
  var minutesTillArrival = "";
  var nextTrainTime = "";
  var frequency = snapshot.val().frequency;

  trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes"); // calculating the difference from now to UNIX timestamp

  // get the remainder of time by using 'moderator' with the frequency & time difference, store in var
  trainRemainder = trainDiff % frequency;

  // subtract the remainder from the frequency, store in var
  minutesTillArrival = frequency - trainRemainder;

  // add minutesTillArrival to now, to find next train & convert to standard time format
  nextTrainTime = moment()
    .add(minutesTillArrival, "m")
    .format("hh:mm A");

  // appends table of trains, inside tbody, with a new row of the train data
  $("#table-data").append(
    "<tr><td>" +
      snapshot.val().name +
      "</td>" +
      "<td>" +
      snapshot.val().destination +
      "</td>" +
      "<td>" +
      frequency +
      "</td>" +
      "<td>" +
      minutesTillArrival +
      "</td>" +
      "<td>" +
      nextTrainTime +
      "  " +
      "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" +
      "</td></tr>"
  );

  $("span").hide();
});

// function to call the button event, and store the values in the input form
var storeInputs = function(event) {
  // prevent from from reseting
  event.preventDefault();

  // get & store input values
  trainName = myTrain.val().trim();
  trainDestination = myTrainDestination.val().trim();
  trainTime = moment(myTrainTime.val().trim(), "HH:mm")
    .subtract(1, "years")
    .format("X");
  trainFrequency = myTimeFreq.val().trim();

  // add to firebase databse
  database.ref("/trains").push({
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency,
    nextArrival: nextArrival,
    minutesAway: minutesAway,
    date_added: firebase.database.ServerValue.TIMESTAMP
  });

  //  empty form once submitted
  myTrain.val("");
  myTrainDestination.val("");
  myTrainTime.val("");
  myTimeFreq.val("");
};

// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function(event) {
  // form validation - if empty - alert
  if (
    myTrain.val().length === 0 ||
    myTrainDestination.val().length === 0 ||
    myTrainTime.val().length === 0 ||
    myTimeFreq === 0
  ) {
    alert("Please Fill All Required Fields");
  } else {
    // if form is filled out, run function
    storeInputs(event);
  }
});

// Calls storeInputs function if enter key is clicked
$("form").on("keypress", function(event) {
  if (event.which === 13) {
    // form validation - if empty - alert
    if (
      myTrain.val().length === 0 ||
      myTrainDestination.val().length === 0 ||
      myTrainTime.val().length === 0 ||
      myTimeFreq === 0
    ) {
      alert("Please Fill All Required Fields");
    } else {
      // if form is filled out, run function
      storeInputs(event);
    }
  }
});
