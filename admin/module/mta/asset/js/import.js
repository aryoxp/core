((g) => {
  var h,
    a,
    k,
    p = "The Google Maps JavaScript API",
    c = "google",
    l = "importLibrary",
    q = "__ib__",
    m = document,
    b = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g)
          e.set(
            k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
            g[k]
          );
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + " could not load.")));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a);
      }));
  d[l]
    ? console.warn(p + " only loads once. Ignoring:", g)
    : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
  key: "AIzaSyCjLU08DWP-wBEfkl4lyGyOiMPV6iiEnoE",
  // Add other bootstrap parameters as needed, using camel case.
  // Use the 'v' parameter to indicate the version to load (alpha, beta, weekly, etc.)
});

class App {
  static map;

  static markers = new Map();
  static polylines = new Map();

  static pointIcon;
  static stopIcon;

  static async initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    var malang = {
      lat: -7.982379,
      lng: 112.630321,
    };
    // Create a map object and specify the DOM element for display.
    App.map = new Map(document.getElementById("map"), {
      center: malang,
      zoom: 13,
      clickableIcons: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
      ],
    });
    App.map.addListener("click", (e) => {
      $("#mta-poly-context").hide();
    });

    var infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          var malang = {
            lat: -7.982379,
            lng: 112.630321,
          };
          App.map.setCenter(malang);
          App.map.setZoom(13);
        },
        function () {
          App.handleLocationError(true, infoWindow, App.map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      App.handleLocationError(false, infoWindow, App.map.getCenter());
    }
  }

  static handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    var malang = {
      lat: -7.982379,
      lng: 112.630321,
    };
    App.map.setCenter(malang);
    App.map.setZoom(13);
  }

  static async drawLine(line) {
    
    (new CoreInfo(`A route of ${line.points.length} points has been imported.`)).show();

    const { Point } = await google.maps.importLibrary("core");
    const lineSymbol = {
      path: "M 0,-2 0,2",
      strokeOpacity: 1,
      scale: 3,
    };

    App.startIcon = {
      path: "M-4,0a4,4 0 1,0 8,0a4,4 0 1,0 -8,0",
      fillColor: "#0ee886",
      fillOpacity: 1,
      anchor: new Point(0, 0),
      strokeWeight: 4,
      strokeColor: '#ff0000',
      strokeOpacity: 0.5,
      scale: 2
    };
    App.finishIcon = {
      path: "M-4,0a4,4 0 1,0 8,0a4,4 0 1,0 -8,0",
      fillColor: "#e80e2f",
      fillOpacity: 0.8,
      anchor: new Point(0, 0),
      strokeWeight: 4,
      strokeColor: '#ff0000',
      strokeOpacity: 0.5,
      scale: 2
    };

    if(App.polylines.has(line.idline)) {
      App.polylines.get(line.idline).setMap(null);
      console.log(App.markers);
      App.markers.forEach(marker => {
        marker.setMap(null);
      })
      App.markers.clear();
    }

    // Create array of points
    let path = [];
    let index = 0;
    line.points.forEach((p) => {
      let pos = new google.maps.LatLng(p.lat, p.lng);
      path.push(pos);

      // if (!parseInt(p.stop)) return;
      // Draw marker on Map
      if (index == 0 || index == line.points.length - 1) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(p.lat, p.lng),
          map: App.map,
          icon: index ? App.finishIcon : App.startIcon,
          idline: line.idline,
          idpoint: p.idpoint
        });
        // Add marker to marker list
        App.markers.set(index ? "f" : "s", marker);
      }
      index++;
    });




    // Draw current polyline
    let poly = new google.maps.Polyline({
      path: path,
      strokeColor: line.linecolor,
      strokeOpacity: 0.5,
      strokeWeight: 5,
      idline: line.idline,
      // editable: true,
      // strokeOpacity: 0,
      icons: [
        {
          icon: { 
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor: '#000000',
            strokeOpacity: 1,
          },
          offset: "50%",
          // repeat: "20px",
        },
      ]
    });
    poly.setMap(App.map);


    App.focusTo(poly);


    poly.getPath().addListener("set_at", (index, vertex) => {
      let p = poly.getPath().getAt(index);
      Object.entries(vertex).forEach(([key, val], index) => {
        if (typeof val != "function") p[key] = vertex[key];
      });
      if (p.isStop)
        App.markers
          .get(p.idpoint)
          .setPosition(new google.maps.LatLng(p.lat(), p.lng()));
      // console.log(p, vertex);
    });
    poly.addListener("dblclick", (e) => {
      poly.setEditable(!poly.getEditable());
      e.stop();
    });
    poly.addListener("contextmenu", (e) => {
      if (poly.getEditable() && e.vertex) {
        // console.warn(poly.getPath().getAt(e.vertex));
        if (!poly.getPath().getAt(e.vertex).isStop)
          poly.getPath().removeAt(e.vertex);
      } else if (!poly.getEditable()) {
        $("#mta-poly-context")
          .css("top", e.domEvent.clientY)
          .css("left", e.domEvent.clientX)
          .show();
        $("#btn-save-line").attr("data-id", poly.idline);
      }
    });

    App.polylines.set(line.idline, poly);
  }

  static focusTo(poly) {
    var bounds = new google.maps.LatLngBounds();
    var points = poly.getPath().getArray();
    for (var n = 0; n < points.length; n++)
      bounds.extend(points[n]);
    if (points.length > 0) App.map.fitBounds(bounds);
  }

  static uploadData(formData) {
    Core.instance().ajax().post('m/x/mta/lineApi/importGpx', formData)
      .then(json => {
        // console.log(json);
        App.displayGpx(json)
      }, error => (new CoreInfo(error)).show());
  }

  static displayGpx(gpxJson) {
    let trkpts = gpxJson.trk.trkseg.trkpt;
    let line = {
      linecolor: '#FF0000',
      points: [],
      idline: '0'
    }
    trkpts.forEach(p => {
      line.points.push({
        lat: p['@attributes'].lat,
        lng: p['@attributes'].lon
      })
    });
    // console.log(line);
    App.drawLine(line);
  }
}

$(() => {
  App.initMap();

  let ajax = Core.instance().ajax();

  $("html").on("dragover", e => {
    e.preventDefault();
    e.stopPropagation();
    $("#drag-info").text("Drag here");
    $('.upload-area').addClass('border-success').removeClass('border-dark border-danger');
  });

  $("html").on("drop", e => {
    e.preventDefault();
    e.stopPropagation();
  });

  // Drag enter
  $(".upload-area").on("dragenter", e => {
    e.stopPropagation();
    e.preventDefault();
    $('#drag-info').text("Drop");
    $('.upload-area').addClass('border-danger').removeClass('border-dark border-success');
  });

  // Drag over
  $(".upload-area").on("dragover", e => {
    e.stopPropagation();
    e.preventDefault();
    $('#drag-info').text("Drop");
    $('.upload-area').addClass('border-danger').removeClass('border-dark border-success');
  });

  // Drop
  $(".upload-area").on("drop", e => {
    e.stopPropagation();
    e.preventDefault();
    $('#drag-info').text("Drag and Drop GPX file here or click to select file");
    $('.upload-area').addClass('border-success').removeClass('border-danger border-success border-dark');
    var file = e.originalEvent.dataTransfer.files;
    var fd = new FormData();
    fd.append("file", file[0]);
    App.uploadData(fd);
  });

  // Open file selector on div click
  $("#uploadfile").click(() => {
    $("#file").click();
  });

  // file selected
  $("#file").change(() => {
    var fd = new FormData();
    var files = $("#file")[0].files[0];
    fd.append("file", files);
    App.uploadData(fd);
  });
  // Sending AJAX request and upload file
  // function uploadData(formdata) {
  //   $.ajax({
  //     url: "upload.php",
  //     type: "post",
  //     data: formdata,
  //     contentType: false,
  //     processData: false,
  //     dataType: "json",
  //     success: function (response) {
  //       addThumbnail(response);
  //     },
  //   });
  // }
  ajax.get('m/x/mta/lineApi/getLines').then(lines => {
    $('#input-line-id').find('.item-line').remove();
    lines.forEach(line => {
      $('#input-line-id').append(`<option class="item-line" data-id="${line.idline}" value="${line.idline}" data-linecolor="${line.linecolor}" data-name="${line.name}" data-direction="${line.direction == "O" ? "Outbound" : "Inbound"}">${line.name} - ${line.direction == "O" ? "Outbound" : "Inbound"} ${line.count > 0 ? "&#10003;" : ""}</option>`)
    });
  }, err => {
    (new CoreInfo(err)).show();
  });

  // $('#btn-load-line').on('click', e => {
  //   let id = $('#input-line-id').val();
  //   let linecolor = $('#input-line-id').find(`:selected`).data('linecolor');
  //   let name = $('#input-line-id').find(`:selected`).data('name');
  //   let direction = $('#input-line-id').find(`:selected`).data('direction')
  //   if (id == 0) {
  //     (new CoreInfo('Please select a line.')).show();
  //     return;
  //   }
  //   ajax.get(`m/x/mta/lineApi/getLine/${id}`).then(points => { // console.log(points);
  //     var line = {
  //       idline: id,
  //       name: name + " - " + direction,
  //       linecolor: linecolor,
  //       points: points
  //     }
  //     App.drawLine(line);
  //   }, err => {
  //     (new CoreInfo(err)).show();
  //   });
  // });

  $('#btn-clear-map').on('click', () => {
    App.polylines.forEach(poly => poly.setMap(null));
    App.markers.forEach(marker => marker.setMap(null));
    App.markers.clear();
    App.polylines.clear();
  });

  $('#btn-save-line').on('click', () => {
    let idline = $('#btn-save-line').attr('data-id');
    let idlineSaveTo = $('#input-line-id').val();
    console.log(App.polylines, idline, App.polylines.get(idline));
    let path = App.polylines.get(idline).getPath();
    let points = [];
    path.forEach((p, index) => {
      // console.log(p, p.idpoint);
      points.push({
  			idpoint: p.idpoint,
  			lat: p.lat(),
  			lng: p.lng(),
  			sequence: index
  		});
    });
    console.log(points, idlineSaveTo);

    if (idlineSaveTo == 0) {
      (new CoreInfo('Please select a line to save to.')).title('Info').show();
      return;
    }

    (new CoreConfirm('This action is destructive, any existing routes will be OVERWRITTEN. Continue?'))
      .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> Warning</span>')
      .positive(() => {
        ajax.post('m/x/mta/lineApi/saveLine', {
          points: JSON.stringify(points),
          idline: idlineSaveTo
        }).then((response) => {
          if (response)
            (new CoreInfo("Line route path has been saved.")).show();
        }, (err) => {
          (new CoreInfo(err)).show();
        });
        $('#mta-poly-context').fadeOut('fast');
      }).show();
  });
});
