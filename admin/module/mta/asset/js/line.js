(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: "AIzaSyCjLU08DWP-wBEfkl4lyGyOiMPV6iiEnoE",
  // Add other bootstrap parameters as needed, using camel case.
  // Use the 'v' parameter to indicate the version to load (alpha, beta, weekly, etc.)
});

class App {

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
      $('#mta-poly-context').hide();
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

  static async drawLine(line) { // console.log(line);

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

    line.points.forEach(p => { // console.log(p.idpoint);
      let pos = new google.maps.LatLng(p.lat, p.lng);
      pos.idpoint = p.idpoint;
      path.push(pos);

      if (!parseInt(p.stop)) return;
      // Draw marker on Map
      if (!App.markers.has(p.idpoint)) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(p.lat, p.lng),
          map: App.map,
          icon: parseInt(p.stop) ? App.stopIcon : App.pointIcon,
          idline: line.idline,
          idpoint: p.idpoint,
          isStop: parseInt(p.stop) ? true : false,
          title: line.idline + ":" + line.name
        });
        // Add marker to marker list
        App.markers.set(p.idpoint, marker);
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
        // editable: true,
        // strokeOpacity: 0,
        // icons: [
        //   {
        //     icon: lineSymbol,
        //     offset: "0",
        //     repeat: "20px",
        //   },
        // ]
      });
      poly.setMap(App.map);
      poly.addListener('dblclick', (e) => {
        poly.setEditable(!poly.getEditable());
        e.stop();
      });
      poly.addListener('contextmenu', (e) => {
        // console.log(poly);
        if (poly.getEditable() && e.vertex) poly.getPath().removeAt(e.vertex);
        else if (!poly.getEditable()) {
          $('#mta-poly-context').css('top', e.domEvent.clientY).css('left', e.domEvent.clientX).show();
          $('#btn-save-line').attr('data-id', poly.idline);
        }
      });

      App.polylines.set(line.idline, poly);
    } else App.polylines.get(line.idline).setMap(App.map);
  }

}

$(() => {
  App.initMap();

  let ajax = Core.instance().ajax();
  ajax.get('m/x/mta/lineApi/getLines').then(lines => {
    $('#input-line-id').find('.item-line').remove();
    lines.forEach(line => {
      $('#input-line-id').append(`<option class="item-line" data-id="${line.idline}" value="${line.idline}" data-linecolor="${line.linecolor}" data-name="${line.name}" data-direction="${line.direction == "O" ? "Outbound" : "Inbound"}">${line.name} - ${line.direction == "O" ? "Outbound" : "Inbound"} ${line.count > 0 ? "&#10003;" : ""}</option>`)
    });
  }, err => {
    (new CoreInfo(err)).show();
  });


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

  $('#btn-save-line').on('click', () => {
    let idline = $('#btn-save-line').attr('data-id');
    let path = App.polylines.get(idline).getPath();
    let line = [];
    path.forEach((p, index) => {
      // console.log(p, p.idpoint);
      line.push({
				idpoint: p.idpoint,
				lat: p.lat(),
				lng: p.lng(),
				sequence: index
			});
    });
    // console.log(line);
    ajax.post('m/x/mta/lineApi/saveLine', {
      line: JSON.stringify(line),
      idline: idline
    }).then((response) => {
      if (response) 
        (new CoreInfo("Line route path has been saved.")).show();
    }, (err) => {
      (new CoreInfo(err)).show();
    });
    $('#mta-poly-context').fadeOut('fast');

  });

});