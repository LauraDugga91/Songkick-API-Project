  
  // Initialize Firebase
var config = {
    apiKey: "pE1BwpmMDHJdfs9n",
    authDomain: "songkick-19f05.firebaseapp.com",
    databaseURL: "https://songkick-19f05.firebaseio.com",
    projectId: "songkick-19f05",
    storageBucket: "songkick-19f05.appspot.com",
    messagingSenderId: "946494866814"
  };
firebase.initializeApp(config);

const skRef = firebase.database().ref('/UserConcertList');
 
var filteredList = [];

$(function(){
  $('#concertListItems').on('click', '.concertListItem', function() {
    const concertDetails = $(this).html();
    skRef.push(concertDetails);
  });

  skRef.on('value', function(res){
    var userListConcertItems = res.val();
    
    for (var userListConcertItem in userListConcertItems){
      filteredList.push(userListConcertItems[userListConcertItem]);
      filteredList = _.uniq(filteredList);
    }

    filteredList.forEach(function(element) {
      $('#userListConcertItems').append("<li>" + element + "</li>");
      console.log(element)
      
    });
    // for (let userListConcertItem in userListConcertItem) {
    //   $('#userConcertListItems').append("<li data-key="+userConcertListItem+">" + userConcertListItems[userConcertListItem] + "</li>");
    // }
    // console.log(_.uniq(filteredList))
    // console.log(...filteredList)
  });
});



const sk = {};

sk.apiKey = 'hHSjLHKTmsfByvxU';


// write a function to get the users location from field on submit
sk.locationResults = ""

sk.locationEvent = function(){
  $('form').on('submit', function(e){
    e.preventDefault();
    let userCity = $('.usersLocation').val();
   let userCityLowerCase = userCity.toLowerCase();
  let userCityCapitalized = userCityLowerCase.charAt(0).toUpperCase() + userCityLowerCase.substr(1);
   sk.getMatchingCities(userCityCapitalized);
   $('.usersLocation').val('');
   $('#concertListItems').empty();
  });
}

// cities that match query
sk.getMatchingCities = function (userCity) {
  $.ajax({
    url: 'http://api.songkick.com/api/3.0/search/locations.json',
    method: 'GET',
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    data: {
      query: userCity,
      apikey: sk.apiKey
    }
  }).then(function (locationResults) {
      sk.locationResults = locationResults.resultsPage.results.location[0];
    $('.location').html(sk.locationResults.city.displayName);
    sk.getCityShows(sk.locationResults.metroArea.id);
  });
};

sk.getCityShows = function (id) {
  $.ajax({
    url: `http://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json`,
    method: 'GET',
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    data: {
      apikey: sk.apiKey
    }
  }).then(function (res) {
      sk.filterList(res)
  });
};


sk.filterList = function(concertList) {
  let drilledToConcertArray = concertList.resultsPage.results.event
  var concertsByPop = drilledToConcertArray.sort(function(obj1, obj2){
    return  obj2.popularity - obj1.popularity;
  })
  var concertsOnly = concertsByPop.filter(function(value){
    return value.type === "Concert"
  })
  var slicedConcerts = concertsOnly.slice(0, 20)
  sk.addArtistNameToObject(slicedConcerts);
  // sk.getArtistImage(slicedConcerts)
  console.log(slicedConcerts)
};


sk.addArtistNameToObject = function(concertList){
  // console.log('concert list: ', concertList);
  // let template = '';
  // for (var concert in concertList){
  //   $('').append ( `
  //     `)
  // }
  concertList.forEach(function(concert){
    var artistName = concert.performance[0].displayName;
  
    // const { concert: }{performance[0]: displayName} } = concert;
    // console.log(`${artistName}`)
    concert.artistName = artistName;
    // sk.getArtistImage(artistName);
    // sk.deconstructObject('concert list: ', concertList)
    // console.log(artistName);
    // console.log(concert);
    // $('.artist').append('<h3>' + artistName + '</h3>');
    // $('#concertListItems').append(`<li>${artistName}</li>`);
    //concertList now has the artist name in it
  });
  sk.getArtistsImages(concertList);  
};

// sk.deconstructObject = function(concert){
//   console.log(concert)

// }


// http://api.songkick.com/api/3.0/search/locations.json?query={search_query}&apikey={your_api_key}

//get location id and make second songkickajax request for concerts
//get artist names from second songkickajax store in variable and use to query musiki for images
//funnel second ajaxsongkick and musiki results into handlebar template
//display that in our masonry div

//figure out how to make it clickable into firebase (storage)
//figure out hot update userConcertListItems with firebase->handlebar template for the userConcertListItems

// get artist images

// figure out how to append this
sk.getArtistsImages = function (concertList) {
  var artistImages = [];

  artistImages = concertList.map(function(concert) {
    return $.ajax({
      url: `https://music-api.musikki.com/v1/artists`,
      method: 'GET',
      dataType: 'json',
      data: {
        // make the q: a variable input based on grabbing the artist name
        q: concert.artistName,
        appkey: '7039c8a27b6cbabadb760d4890a3011e',
        appid: '294aaa1e4e2e356b1873051727fa0456'
      }
    });
  });

  $.when(...artistImages) 
    .done(function(...promises) {
       // if the image doesn't existin the promise, we want to append a new object property with a value of a default image
      promises.forEach(function(promise, index) {
        // right now we're just going to skip over adding any images to all objects..
        if( promise[0].results[0] === undefined ) {
          concertList[index].image = "https://unsplash.it/300?random"
        } else {
        concertList[index].image = promise[0].results[0].image;
        }
      });
      console.log(concertList);
      sk.sendObjectToHandlebarTemplate(concertList);
    });



  // $.ajax({
  //   url: `https://music-api.musikki.com/v1/artists`,
  //   method: 'GET',
  //   dataType: 'json',
  //   data: {
  //     // make the q: a variable input based on grabbing the artist name
  //     q: artist,
  //     appkey: '7039c8a27b6cbabadb760d4890a3011e',
  //     appid: '294aaa1e4e2e356b1873051727fa0456'
  //   }
  // }).then(function (artist) {
  //     var artistImage = artist.results[0].image;
  //     // sk.addArtistImageToObject(artistImage)

  //     //now we need to add artistImage as a property of our ConcertList Object
  //     // console.log(artist.results[0].image);
  //     // console.log(artist)
  // });
};


//need an object that already has all the proerties were sending to HB. Then send to HB object
//all data must be received before sending to HB

sk.sendObjectToHandlebarTemplate = function(concertList){
  var concertTemplate = $('#concertList').html();
  var compiledConcertTemplate = Handlebars.compile(concertTemplate);

  concertList.forEach(function(concert){
    $('#concertListItems').append(compiledConcertTemplate(concert));
  
  })


}




sk.init = function() {
  // remove getArtistImage from here once we call it in another function
  // sk.getArtistImage();
  sk.locationEvent();

};


$(function() {
    sk.init();
});
