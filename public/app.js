var state = {
    
}

window.onload = function () {
    findUser("snowyturner", 1370044800, 1372550400);
};

function main(userId){
    return userId;
}

function findUser(username, minDate, maxDate){
    var url = 'https://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key=c936721ec7f3163bc479e18e7082afe9&username=' + username +'&format=json&nojsoncallback=1&auth_token=72157671394112725-551190bd4e38fb61&api_sig=842c5b07f475530b70af7d0003fd0020' 
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var personObject = JSON.parse(jsonString);
            getPhotos(personObject.user.id, minDate, maxDate);
        }
    }
    request.send();
    
}

function getPhotos(userId, minDate, maxDate){
    var url = 'https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=c936721ec7f3163bc479e18e7082afe9&user_id=' + userId + '&min_upload_date=' + minDate + '&max_upload_date=' + maxDate + '&format=json&nojsoncallback=1&auth_token=72157671394112725-551190bd4e38fb61&api_sig=03f956fe02af02ddea89c81959d31b9c' 
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var photosObject = JSON.parse(jsonString);
            console.log(photosObject);
        }
    }
    request.send();
}

