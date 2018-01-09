var map;
var panel;
var initMap;
var calculate;
var direction;

initMap = function () {

	var position = new google.maps.LatLng(48.815243, 2.362742); // Correspond au coordonnées de Paris
  	var options = {
	    zoom : 14, // Zoom par défaut
	    center: position, // Coordonnées de départ de la carte de type latLng 
	    maxZoom: 20, 
	    styles: [{"featureType":"all","elementType":"labels","stylers":[{"lightness":63},{"hue":"#ff0000"}]},{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#000bff"},{"visibility":"on"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"color":"#4a4a4a"},{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"weight":"0.01"},{"color":"#727272"},{"visibility":"on"}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.province","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"administrative.province","elementType":"labels.text","stylers":[{"color":"#545454"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text","stylers":[{"color":"#7c7c7c"},{"weight":"0.01"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text","stylers":[{"color":"#404040"}]},{"featureType":"landscape","elementType":"all","stylers":[{"lightness":16},{"hue":"#ff001a"},{"saturation":-61}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"color":"#828282"},{"weight":"0.01"}]},{"featureType":"poi.government","elementType":"labels.text","stylers":[{"color":"#4c4c4c"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"hue":"#00ff91"}]},{"featureType":"poi.park","elementType":"labels.text","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"color":"#999999"},{"visibility":"on"},{"weight":"0.01"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"hue":"#ff0011"},{"lightness":53}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#626262"}]},{"featureType":"transit","elementType":"labels.text","stylers":[{"color":"#676767"},{"weight":"0.01"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#0055ff"}]}]
	  };

	map = new google.maps.Map(document.getElementById('map'), options);
  	panel = document.getElementById('panel');  

	var marker = new google.maps.Marker({
		position: position,
		map: map
	});

	var infoWindow = new google.maps.InfoWindow({
    	position : position,
    	map: map
	});

	google.maps.event.addListener(marker, 'click', function() {
	    infoWindow.open(map,marker);
	  });
	  
	google.maps.event.addListener(infoWindow, 'domready', function(){ // infoWindow est biensûr notre info-bulle
	    jQuery("#tabs").tabs();
	});

	direction = new google.maps.DirectionsRenderer({
	    map   : map,
	    panel : panel // Dom element pour afficher les instructions d'itinéraire
	});	
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
}

calculate = function(){
    origin = document.getElementById('origin').value; // Le point départ
    destination = document.getElementById('destination').value; // Le point d'arrivé
    mode = document.getElementById('mode').value;
    if(origin && destination){
    	var request = {
    		origin: origin,
    		destination: destination,
            travelMode: google.maps.DirectionsTravelMode[mode] // Type de transport
        }

        var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
        directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
        	if(status == google.maps.DirectionsStatus.OK){
                direction.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
            }
        });
    }
};

function inverse (){
      origin = document.getElementById('origin').value;
      destination = document.getElementById('destination').value;
      document.getElementById('origin').value=destination;
      document.getElementById('destination').value=origin;
}

function localisation (){
   // Try HTML5 geolocation.
   	if (navigator.geolocation) {
   		navigator.geolocation.getCurrentPosition(function(position) {
   		var pos = {
   			lat: position.coords.latitude,
   			lng: position.coords.longitude
   		};

   		var lat = position.coords.latitude;
   		var lng = position.coords.longitude;

   		var location = lat + " " + lng;
   		
   		document.getElementById('origin').value=location;

   		locateMarker = new google.maps.Marker({
   			position : pos,
   			map      : map,
   			title    : "Localisation",
   			animation: google.maps.Animation.DROP
   		});

   		infoWindow.setPosition(pos);
   		infoWindow.setContent('Location found.');
   		map.setCenter(pos);

   	}, function() {
   		handleLocationError(true, infoWindow, map.getCenter());
   	});

   	} else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
      }
  }

	initMap();

	google.maps.event.addListener(map, 'click', function(event) {
			placeMarker(event.position);
	});

	var marker;
	function placeMarker(location) {
		if(marker){ //on vérifie si le marqueur existe
		  marker.setMap(null);
		  marker=null;
		  // marker.setPosition(location); //on change sa position  
		}
	  marker = new google.maps.Marker({ //on créé le marqueur
	    position: location,
	    map: map,
	    title    : "Marker",
	    animation: google.maps.Animation.DROP
	  });

	  var lat = marker.getPosition().lat();
	  var lng = marker.getPosition().lng();

	  var dest = lat + " " + lng;

	  document.getElementById('destination').value=dest;
}


