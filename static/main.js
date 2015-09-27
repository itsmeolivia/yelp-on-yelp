var COLORS = ["red", "green", "blue", "yellow", "purple", "orange", "cadetblue", "lightgray"];

var map = L.map('mymap').setView([51.505, -0.09], 13);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom: 19,
  attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker_list = [];

$("#search").on("submit", function(event) {
  event.preventDefault();
  marker_list.forEach(function(marker){
    map.removeLayer(marker);
  });
  marker_list.length = 0;

  var input_term = $("[name=term]").val();
  var multiple_terms = input_term.split(",");
  var location = $("[name=location]").val();

  multiple_terms.forEach(function(term, i) {
    $.ajax({
      data: {
        term: term,
        location: location
      },
      url: "/yelpmeup"
    })
    .done(function(data) {
      var center = data.region.center;
      if (i === 0)
        map.panTo({lng: center.longitude, lat: center.latitude});

      data.businesses.forEach(function(business) {
        var coord = business.location.coordinate;
        var redMarker = L.AwesomeMarkers.icon({
          icon: "",
          markerColor: COLORS[i % COLORS.length]
        });
        var new_marker = L.marker([coord.latitude, coord.longitude], {icon: redMarker});
        var marker_already_exists = marker_list.some(function(old_marker) {
          var old_location = old_marker.getLatLng();
          var new_location = new_marker.getLatLng();
          return old_location.equals(new_location);
        });

        if (!marker_already_exists) {
          new_marker.addTo(map);
          new_marker.bindPopup("<b>" + business.name + "</b><br> Rating: " + business.rating + "<br><a href=" + business.url + ' target="_blank">See more on Yelp!');
          marker_list.push(new_marker);
        }

      });
    })
    .fail(function() {
      alert( "error" );
    });
  });
});
