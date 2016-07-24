var state = {
    userId: "",
    photos: []
};

window.onload = function () {
    handleClick();
};

function handleClick(inputUserId, minDate, maxDate){
  var button = document.getElementById('find-button');
  button.onclick = function(){
    saveUserInput();
    }
}

function saveUserInput(){
    var inputUserId = document.getElementById('flickrUsername').value;
    var rawMinDate = document.getElementById('minDate').value;
    var minDate = Date.parse(rawMinDate)/1000;
    var rawMaxDate = document.getElementById('maxDate').value;
    var maxDate = Date.parse(rawMaxDate)/1000;
    findUser(inputUserId, minDate, maxDate);
}

function findUser(username, minDate, maxDate){
    var url = 'https://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key=d836aea8ef2a786aad020fb216b0b1c4&username=' + username +'&format=json&nojsoncallback=1' 
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var personObject = JSON.parse(jsonString);
            saveUserToState(personObject.user.id);
            getPhotos(personObject.user.id, minDate, maxDate);

        }
    }
    request.send();
}

function saveUserToState(apiUserId){
    state.userId = apiUserId;
}

function getPhotos(userId, minDate, maxDate){
    var url = 'https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=d836aea8ef2a786aad020fb216b0b1c4&user_id=' + userId + '&min_taken_date=' + minDate + '&max_taken_date=' + maxDate + '&extras=geo%2C+date_taken&format=json&nojsoncallback=1' 
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var photosObject = JSON.parse(jsonString);
            savePhotosToState(photosObject.photos.photo);
        }
    }
    request.send();
}

function savePhotosToState(apiPhotos){
    apiPhotos.forEach(function(photo){
        if (photo.latitude > 0 && photo.longitude > 0){
            state.photos.push(photo);
        }
    })  
    sortPhotosByDate();
    var map = new Map(getFirstLatLng());
    addPhotoMarkers(map, state.photos);
    console.log(state);
}

function sortPhotosByDate(){
    state.photos.forEach(function(photo){
        photo.datetaken = Date.parse(photo.datetaken)/1000;
    })
    state.photos.sort(function(a, b){
        if (a.datetaken > b.datetaken){
            return 1;
        }
        if (a.datetaken < b.datetaken){
            return -1;
        }
        return 0;
    })
}

function getFirstLatLng(){
    var firstPhoto = state.photos[0];
    latLng = {lat: Number(firstPhoto.latitude), lng: Number(firstPhoto.longitude)}
    return latLng;
}

function addPhotoMarkers(map, photos){
    photos.forEach(function(photo){
        content = infoWindowContent(photo.farm, photo.server, photo.id, photo.secret, photo.title);
    map.addInfoWindow({lat: Number(photo.latitude), lng: Number(photo.longitude)}, content, "icon-camera.png")
    })
}

function Map(latLng){
  this.map = new google.maps.Map(document.getElementById('map'), {
    center: latLng,
    zoom: 10
}),
  this.addMarker = function(latLng, content, icon){
    var marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      content: content,
      icon: icon
  });
    return marker
},
  this.addInfoWindow = function(latLng, content, icon){
    var marker = this.addMarker(latLng, content, icon);
    marker.addListener('click', function() {
      var infowindow = new google.maps.InfoWindow({
          content: content
      });
      infowindow.open(this.map, marker);
  });
}
}

function infoWindowContent(farm, server, id, secret, title){
    return '<img src=' + 'https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '.jpg></img><p>' + title

}






