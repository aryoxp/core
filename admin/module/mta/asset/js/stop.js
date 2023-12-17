(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: "AIzaSyCjLU08DWP-wBEfkl4lyGyOiMPV6iiEnoE",
  // Add other bootstrap parameters as needed, using camel case.
  // Use the 'v' parameter to indicate the version to load (alpha, beta, weekly, etc.)
});

class App {

  static dialogLineProfile;

  static map;

  static markers = new Map();
  static polylines = new Map();

  static pointIcon;
	static stopIcon

  static async initMap() {

    const { Map } = await google.maps.importLibrary("maps");

    var malang = {
      lat: -7.982379,
      lng: 112.630321
    };
    // Create a map object and specify the DOM element for display.
    App.map = new Map(document.getElementById('map'), {
      center: malang,
      zoom: 13,
      clickableIcons: false,
      styles: [{
        featureType: "poi",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }]
      }]
    });
    App.map.addListener('click', e => {
      $('#mta-marker-context').hide();
      $('#mta-polyline-context').hide();
    });

    var infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        var malang = {
          lat: -7.982379,
          lng: 112.630321
        };
        App.map.setCenter(malang);
        App.map.setZoom(13);
      }, function () {
        App.handleLocationError(true, infoWindow, App.map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      App.handleLocationError(false, infoWindow, App.map.getCenter());
    }
  }

  static handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    var malang = {
      lat: -7.982379,
      lng: 112.630321
    };
    App.map.setCenter(malang);
    App.map.setZoom(13);
  }

  static getLines() {
    Core.instance().ajax().get('m/x/mta/lineApi/getLines').then(lines => {
      $('#input-line-id').find('.item-line').remove();
      lines.forEach(line => {
        $('#input-line-id').append(`<option class="item-line" data-id="${line.idline}" value="${line.idline}" data-linecolor="${line.linecolor}" data-name="${line.name}" data-direction="${line.direction == "O" ? "Outbound" : "Inbound"}" data-enabled="${line.enabled}">${line.name} - ${line.direction == "O" ? "Outbound" : "Inbound"} ${line.count > 0 ? "&#10003;" : ""}</option>`)
      });
    }, err => {
      (new CoreInfo(err)).show();
    });
  }

  static async drawLine(line) { // console.log(line);

    if(line.points.length == 0) {
      (new CoreInfo("This line has no route.")).show();
      return;
    }

    const { Point } = await google.maps.importLibrary("core");
    const lineSymbol = {
      path: "M 0,-2 0,2",
      strokeOpacity: 1,
      scale: 3,
    };

    App.pointIcon = {  
      path: "M-4,0a4,4 0 1,0 8,0a4,4 0 1,0 -8,0",
      fillColor: line.linecolor,
      fillOpacity: .5,
      anchor: new Point(0,0),
      strokeWeight: 0,
    }
    App.stopIcon = {  
      path: "M -6,-6 v 12 h 12 v -12 z",
      fillColor: '#FFFFFF',
      fillOpacity: 1,
      anchor: new Point(0,0),
      strokeWeight: 3,
      strokeColor: line.linecolor
    }

		// Create array of points
    let path = [];

    // Clean all previously created markers
    // App.markers.forEach(marker => marker.setMap(null));

    let markers = [];

    line.points.forEach(p => { // console.log(p.idpoint);
      let pos = new google.maps.LatLng(p.lat, p.lng);
      pos.idpoint = p.idpoint;
      pos.isStop = parseInt(p.stop);
      path.push(pos);

      // if (!parseInt(p.stop)) return;
      // Draw marker on Map
      if (!App.markers.has(p.idpoint)) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(p.lat, p.lng),
          map: App.map,
          icon: parseInt(p.stop) ? App.stopIcon : App.pointIcon,
          idline: line.idline,
          idpoint: p.idpoint,
          isStop: parseInt(p.stop) ? true : false,
          title: line.idline + ":" + line.name,
          line: line
        });

        //Add right-click listener 
        marker.addListener('rightclick', (e) => {
          console.log(e);
          $('#mta-marker-context').css('top', e.domEvent.clientY).css('left', e.domEvent.clientX).show();
          $('#btn-mark-stop').attr('data-id', marker.idpoint);
          $('#btn-unmark-stop').attr('data-id', marker.idpoint);
        });
        // Add marker to marker list
        App.markers.set(p.idpoint, marker);
        markers.push(marker);
      } else App.markers.get(p.idpoint).setMap(App.map);

    });

    // Draw current polyline
    if (!App.polylines.has(line.idline)) {
      let poly = new google.maps.Polyline({
        path: path,
        strokeColor: line.linecolor,
        strokeOpacity: 0.5,
        strokeWeight: 5,
        idline: line.idline,
        markers: markers
      });
      poly.setMap(App.map);
      poly.addListener('rightclick', (e) => {
        console.log(e);
        $('#mta-polyline-context').css('top', e.domEvent.clientY).css('left', e.domEvent.clientX).show();
        $('#btn-show-hide').attr('data-id', poly.idline);
      });
      
      App.focusTo(poly);
      poly.getPath().addListener('set_at', (index, vertex) => {
        let p = poly.getPath().getAt(index);
        Object.entries(vertex).forEach(([key, val], index) => {
          if (typeof val != "function") p[key] = vertex[key];
        })
        if (p.isStop) App.markers.get(p.idpoint).setPosition(new google.maps.LatLng(p.lat(), p.lng()));
      })
      App.polylines.set(line.idline, poly);
    } else {
      App.polylines.get(line.idline).setMap(App.map);
    }
    // set camera to center of the line
    // var bounds = new google.maps.LatLngBounds();
    // var points = App.polylines.get(line.idline).getPath().getArray();
    // for (var n = 0; n < points.length; n++)
    //   bounds.extend(points[n]);
    // App.map.setCenter(bounds.getCenter());

    // if camera is far, zoom out to show the line as a whole. 
    if (App.map.getZoom() <= 14) {
      App.focusTo(App.polylines.get(line.idline));
    }
  }

  static focusTo(poly) {
    var bounds = new google.maps.LatLngBounds();
    var points = poly.getPath().getArray();
    for (var n = 0; n < points.length; n++)
      bounds.extend(points[n]);
    if (points.length > 0) App.map.fitBounds(bounds);
  }

}

$(() => {
  App.initMap();
  App.getLines();

  let ajax = Core.instance().ajax();


  $('#btn-load-line').on('click', e => {
    let id = $('#input-line-id').val();
    let linecolor = $('#input-line-id').find(`:selected`).data('linecolor');
    let name = $('#input-line-id').find(`:selected`).data('name');
    let direction = $('#input-line-id').find(`:selected`).data('direction')
    if (id == 0) {
      (new CoreInfo('Please select a line.')).show();
      return;
    }
    ajax.get(`m/x/mta/lineApi/getLine/${id}`).then(points => { // console.log(points);
      var line = {
        idline: id,
        name: name + " - " + direction,
        linecolor: linecolor,
        points: points
      }
      App.drawLine(line);
    }, err => {
      (new CoreInfo(err)).show();
    });
  });

  $('#btn-clear-map').on('click', () => {
    App.polylines.forEach(poly => poly.setMap(null));
    App.markers.forEach(marker => marker.setMap(null));
    App.markers.clear();
    App.polylines.clear();
  });

  $('#btn-mark-stop').on('click', () => {
    let id = $('#btn-mark-stop').attr('data-id');
    let marker = App.markers.get(id);
    if(marker.isStop) return;

    ajax.post('m/x/mta/lineApi/markPointAsStop/', {
      id: id
    }).then((response) => {
      App.stopIcon.strokeColor = marker.line.linecolor;
      marker.isStop = true;
      marker.setIcon(App.stopIcon);
      $('#mta-marker-context').fadeOut('fast');  
    }, (err) => {
      (new CoreInfo(err)).show();
    });
  });

  $('#btn-unmark-stop').on('click', () => {
    let id = $('#btn-unmark-stop').attr('data-id');
    let marker = App.markers.get(id);
    if(!marker.isStop) return;

    ajax.post('m/x/mta/lineApi/unmarkPointFromStop/', {
      id: id
    }).then((response) => {
      App.pointIcon.fillColor = marker.line.linecolor;
      marker.isStop = false;
      marker.setIcon(App.pointIcon);
      $('#mta-marker-context').fadeOut('fast');  
    }, (err) => {
      (new CoreInfo(err)).show();
    });
  });

  $('#btn-show-hide').on('click', () => {
    let id = $('#btn-show-hide').attr('data-id');
    let poly = App.polylines.get(id);
    poly.setMap(null);
    for(marker of poly.markers) marker.setMap(null);
    $('#mta-polyline-context').fadeOut('fast');
  });

});