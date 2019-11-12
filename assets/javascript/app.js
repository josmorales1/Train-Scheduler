// start with the firebase
let firebaseConfig = {
    apiKey: "AIzaSyAAtzkJGflxsAb44qVuxYJgt_wC5S29wQo",
    authDomain: "train-scheduler-9d172.firebaseapp.com",
    databaseURL: "https://train-scheduler-9d172.firebaseio.com",
    projectId: "train-scheduler-9d172",
    storageBucket: "train-scheduler-9d172.appspot.com",
    messagingSenderId: "258198591612",
    appId: "1:258198591612:web:a5e709bdd8b9111d7a11f9",
    measurementId: "G-K5BZY1KMVZ"
}

firebase.initializeApp(firebaseConfig);
firebase.analytics();

let database = firebase.database();

let arrivalTime = "null"

let minutesAway = "null"

// when something is added to the database
database.ref().on("child_added", function (snapshot) {
    let check = false;
    if (snapshot.val().firstTrain != "" && snapshot.val().frequency != "") {
        let time = moment(snapshot.val().firstTrain, "h:mm");
        while (!check) {
            if (moment().isAfter(time)) {
                time.add(snapshot.val().frequency, 'minutes');
            }
            else {
                check = true;
            }
        }
        arrivalTime = time.format("h:mm a");
        minutesAway = moment(arrivalTime, "h:mm a").fromNow(true);

        // we are creating new table row
        $("#newRow").append("<tr>" +
            "<td>" + snapshot.val().train + "</td>" +
            "<td>" + snapshot.val().destination + "</td>" +
            "<td>" + snapshot.val().frequency + "</td>" +
            "<td>" + arrivalTime + "</td>" +
            "<td>" + minutesAway + "</td>" +
            "</tr>");
    }
});

// when add train button is clicked
$("#addTrain").on("click", function (event) {
    event.preventDefault();
    // pushing input data to firebase
    database.ref().push({
        train: $("#train").val().trim(),
        destination: $("#destination").val().trim(),
        frequency: $("#frequency").val().trim(),
        firstTrain: $("#firstTrain").val().trim(),
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    $("#train").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");

});

//   showing the current time
function clock() {
    let clock = moment().format("h:mm:ss a")
    $("#clock").text("Current Time: " + clock);
    // updates the clock each second 
    setInterval(function () {
        this.clock();
    }, 1000);
}

clock();
