var map = L.map('mymap').setView([51.505, -0.09], 13);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom: 19,
  attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a>,Tiles courtesy of<a href="http://hot.openstreetmap.org/" target="_blank"> Humanitarian OpenStreetMap Team </a>'
}).addTo(map);
$("#search").on("submit", function(event) {
  event.preventDefault();
  var term = $("[name=term]").val();
  var location = $("[name=location]").val();
  $.ajax({
    data: {
      term: term,
      location: location
    },
    url: "/yelpmeup"
  }).done(function(data) {
      var center = data.region.center;
      map.panTo({lng: center.longitude, lat: center.latitude});

      data.businesses.forEach(function(business) {
        var coord = business.location.coordinate;
        var marker = L.marker([coord.latitude, coord.longitude]).addTo(map);
      });
    })
    .fail(function() {
      alert( "error" );
    });
});