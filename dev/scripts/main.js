
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA8FFMyn81ZNHNmY6EUHIuiyyb4Wq_MBvQ",
    authDomain: "songkick-19f05.firebaseapp.com",
    databaseURL: "https://songkick-19f05.firebaseio.com",
    projectId: "songkick-19f05",
    storageBucket: "songkick-19f05.appspot.com",
    messagingSenderId: "946494866814"
  };
  firebase.initializeApp(config);

const dbRef = firebase.database().ref('UserConcertList');
 

$(function(){

  firebase.database().ref('userConcertList').on('value', function(res){
    $('.concertListItems').empty();
    var userConcertListItems = res.val();
    for (userConcertListItem in userConcertListItems) {
      $('.userConcertListItems').append("<li data-key="+userConcertListItem+">" + userConcertListItems[userConcertListItem] + "</li>");
    }
  });

  $('.concertListItems').on('click', '.concertListItem', function() {
    //grab the value of each concertList item when user clicks on them and store in fb
    let userConcertListItem = $('.concertListItem') //this?  how to access?
    if (userConcertListItem !== '') {
      dbRef.push(userConcertListItem);
    }
  });

});

const sk = {};

sk.apiKey = 'hHSjLHKTmsfByvxU';
sk.city = 'toronto';

sk.init = function () {
  sk.getMatchingCities();
};

// write a function to get the users location from field on submit

// cities that match query
sk.getMatchingCities = function () {
  $.ajax({
    url: 'http://api.songkick.com/api/3.0/search/locations.json',
    method: 'GET',
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    data: {
      query: sk.city,
      apikey: sk.apiKey
    }
  }).then(function (locationResults) {
      locationResults = locationResults.resultsPage.results.location[0].city.displayName;
      console.log(locationResults);
  });
};
// http://api.songkick.com/api/3.0/search/locations.json?query={search_query}&apikey={your_api_key}



$(function () {
    sk.init();
})

