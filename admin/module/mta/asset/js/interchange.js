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
    const { Point } = await google.maps.importLibrary("core");
    App.Point = Point;

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
      $('#mta-interchange-context').removeClass('d-flex').hide();
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

  static async getLine(idline) {
    let lpoints = await Core.instance().ajax().get(`m/x/mta/lineApi/getLine/${idline}`);
    var line = {
      idline: idline,
      name: lpoints[0].name,
      direction: lpoints[0].direction == "O" ? "Outbound" : "Inbound", 
      linecolor: lpoints[0].linecolor,
      points: lpoints
    };
    return line;
  }

  static async getInterchanges() {
    let interchanges = await Core.instance().ajax().get('m/x/mta/lineApi/getInterchanges');
    // console.log(interchanges);
    $('#input-interchange-id').find('.item-interchange').remove();
    interchanges.forEach(ic => {
      $('#input-interchange-id').append(`<option class="item-interchange col-2" data-id="${ic.idinterchange}"
        data-lines="${ic.idlines}" data-points="${ic.idpoints}" 
        value="${ic.idinterchange}">${ic.idinterchange} [${ic.idpoints}] Line: ${ic.idlines}</option>`);
    });
    Promise.resolve();
  }

  static addPointToInterchange(idpoint, idinterchange) {
    Core.instance().ajax().get(`m/x/mta/lineApi/addPointToInterchange/${idpoint}/${idinterchange}`).then(result => {
      // console.log(result);
      if (result) {
        let marker = App.markers.get(idpoint);
        marker.idinterchange = idinterchange;
        App.interchangeIcon.strokeColor = marker.line.linecolor;
        marker.setIcon(App.interchangeIcon);
        App.interchangePoints.add(idpoint);
        App.getInterchanges().then(() => {
          $('#input-interchange-id').find(`option[data-id="${idinterchange}"]`).prop('selected', true);
        });
      }
    }, err => {
      (new CoreInfo(err)).show();
    });    
  }
  static removePointFromInterchange(idpoint, idinterchange) {
    Core.instance().ajax().get(`m/x/mta/lineApi/removePointFromInterchange/${idpoint}/${idinterchange}`).then(result => {
      // console.log(result);
      if (result) {
        let marker = App.markers.get(idpoint);
        marker.setIcon(App.stopIcon);
        marker.idinterchange = null;
        App.interchangePoints.delete(idpoint);
        App.getInterchanges().then(() => {
          $('#input-interchange-id').find(`option[data-id="${idinterchange}"]`).prop('selected', true);
        });      }
    }, err => {
      (new CoreInfo(err)).show();
    });    
  }

  static async drawLine(line) { // console.log(line);

    if(line.points.length == 0) {
      (new CoreInfo("This line has no route.")).show();
      return;
    }



    App.pointIcon = {  
      path: "M-4,0a4,4 0 1,0 8,0a4,4 0 1,0 -8,0",
      fillColor: line.linecolor,
      fillOpacity: .5,
      anchor: new App.Point(0,0),
      strokeWeight: 0,
    }
    App.stopIcon = {  
      path: "M -6,-6 v 12 h 12 v -12 z",
      fillColor: '#FFFFFF',
      fillOpacity: 1,
      anchor: new App.Point(0,0),
      strokeWeight: 3,
      strokeColor: line.linecolor
    }
    App.interchangeIcon = {  
      path: "M -6,-6 v 12 h 12 v -12 z",
      fillColor: '#FF7777',
      fillOpacity: 1,
      anchor: new App.Point(0,0),
      strokeWeight: 3,
      strokeColor: line.linecolor
    }
    // const lineSymbol = {
    //   path: "M 0,-2 0,2",
    //   strokeOpacity: 1,
    //   scale: 3,
    // };

		// Create array of points
    let path = [];
    let linemarkers = [];

    // Clean all previously created markers
    // App.markers.forEach(marker => marker.setMap(null));
    // console.log(line.points);
    // for(let p of line.points) console.log(p.idinterchange);

    line.points.forEach(p => { // console.log(p.idpoint);
      let pos = new google.maps.LatLng(p.lat, p.lng);
      pos.idpoint = p.idpoint;
      pos.isStop = parseInt(p.stop);
      path.push(pos);

      // if (!parseInt(p.stop)) return;
      // Draw marker on Map
      if (!App.markers.has(p.idpoint)) {
        // if (!parseInt(p.stop)) return;
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(p.lat, p.lng),
          map: parseInt(p.stop) ? App.map : null,
          icon: parseInt(p.stop) ? App.stopIcon : App.pointIcon,
          idline: line.idline,
          idpoint: p.idpoint,
          isStop: parseInt(p.stop) ? true : false,
          title: line.idline + ":" + line.name,
          line: line,
          idinterchange: p.idinterchange
        });

        //Add right-click listener 
        marker.addListener('rightclick', (e) => {
          // console.log(e, marker);
          $('#mta-interchange-context').css('top', e.domEvent.clientY).css('left', e.domEvent.clientX).addClass('d-flex');
          $('#line-info').html(`${marker.line.idline}/${marker.line.name}-${marker.line.direction} ${marker.line.direction == "Outbound" ? "▷" : "◁"}`);
          $('#btn-show-interchange').attr('data-id', marker.idinterchange);
          $('#btn-create-interchange').attr('data-id', marker.idpoint);
          $('#btn-mark-stop').attr('data-id', marker.idpoint);
          $('#btn-unmark-stop').attr('data-id', marker.idpoint);
          $('#btn-nearby-lines').attr('data-idline', marker.idline)
            .attr('data-lat', p.lat)
            .attr('data-lng', p.lng);
          if(!marker.idinterchange) {
            $('#btn-create-interchange').show();
            $('#btn-show-interchange').hide();
          } else {
            $('#btn-create-interchange').hide();
            $('#btn-show-interchange').show();
          }
        });
        
        marker.addListener('click', (e) => {
          // console.log(marker, marker.idpoint, App.interchangeId);
          if (!App.interchangePoints?.size) return;
          if (App.interchangePoints.has(marker.idpoint)) {
            (new CoreConfirm(`Are you sure you want to <span class="text-danger">REMOVE</span> this point from interchange #${App.interchangeId}?`))
            .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> REMOVE point</span>')
            .positive(e => {
              App.removePointFromInterchange(marker.idpoint, App.interchangeId);
            }).show();
          } else {
            (new CoreConfirm(`Are you sure you want to <span class="text-primary">ADD</span> this point to interchange #${App.interchangeId}?`))
            .title('<span class="text-primary"><i class="bi bi-exclamation-triangle"></i> ADD point</span>')
            .positive(e => {
              App.addPointToInterchange(marker.idpoint, App.interchangeId);
            }).show();
          }
        });
        // Add marker to marker list
        App.markers.set(p.idpoint, marker);
        linemarkers.push(marker);
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
        markers: linemarkers
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
      
      if (App.map.getZoom() < 10) App.focusTo(poly);

      poly.getPath().addListener('set_at', (index, vertex) => {
        let p = poly.getPath().getAt(index);
        Object.entries(vertex).forEach(([key, val], index) => {
          if (typeof val != "function") p[key] = vertex[key];
        })
        if (p.isStop) App.markers.get(p.idpoint).setPosition(new google.maps.LatLng(p.lat(), p.lng()));
        // console.log(p, vertex);
      })
      poly.addListener('dblclick', (e) => {
        for(let marker of poly.markers) {
          if(marker.isStop) continue;
          // console.warn("DBLCLICK", marker);
          if(marker.getMap() == null) {
            marker.setMap(App.map);
            // if (marker.isStop) {
            //   App.stopIcon.strokeColor = marker.line.linecolor;
            //   marker.setIcon(App.stopIcon);
            // } else {
              App.pointIcon.fillColor = marker.line.linecolor;
              marker.setIcon(App.pointIcon);
            // }
          } else marker.setMap(null);
        }
        e.stop();
      });


      App.polylines.set(line.idline, poly);
    } else {
      let polyline = App.polylines.get(line.idline);
      polyline.setMap(App.map);
      for(let marker of polyline.markers) {
        if (!marker.isStop) marker.setMap(null);
      } 
      if (App.map.getZoom() < 10) App.focusTo(App.polylines.get(line.idline));
    }
  }

  static focusTo(poly) {
    var bounds = new google.maps.LatLngBounds();
    var points = poly.getPath().getArray();
    for (var n = 0; n < points.length; n++)
      bounds.extend(points[n]);
    if (points.length > 0) App.map.fitBounds(bounds);
  }

  static async checkShown(idlines) {
    for(let idline of idlines) {
      let polyline = App.polylines.get(idline);
      if(!polyline){
        // console.warn("Loading idline: " + idline);
        await App.getLine(idline).then(async (line) => {
          await App.drawLine(line).then(Promise.resolve());
        });
      }
    }      
  }

}



$(() => {
  App.initMap();
  App.getLines();
  App.getInterchanges();

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
        name: name,
        direction: points[0].direction == "O" ? "Outbound" : "Inbound" , 
        linecolor: linecolor,
        points: points
      }
      App.drawLine(line);
    }, err => {
      (new CoreInfo(err)).show();
    });
  });

  $('#bt-show-ic').on('click', () => {
    let lines = $('#input-interchange-id').find(':selected').attr('data-lines').split(",");
    let points = $('#input-interchange-id').find(':selected').attr('data-points').split(",");
    let interchangeId = $('#input-interchange-id').find(':selected').attr('data-id');
    App.interchangeId = interchangeId;
    App.interchangePoints = new Set(points);
    // App.markers.forEach(m => m.setMap(null));
    // App.markers.clear();
    App.markers.forEach(m => {
      // console.log(m.line);
      App.stopIcon.strokeColor = m.line.linecolor;
      m.setIcon(App.stopIcon);
    });
    lines.forEach(id => {      
      ajax.get(`m/x/mta/lineApi/getLine/${id}`).then(lpoints => { //console.log(lpoints);
        var line = {
          idline: id,
          name: lpoints[0].name,
          direction: lpoints[0].direction == "O" ? "Outbound" : "Inbound", 
          linecolor: lpoints[0].linecolor,
          points: lpoints
        }
        // console.log(line);
        App.drawLine(line).then((e) => {
          let marker = null;
          points.forEach(p => {
            marker = App.markers.get(p);
            if (marker && marker.isStop) {
              if (marker.idinterchange) {
                App.interchangeIcon.strokeColor = marker.line.linecolor;
                marker.setIcon(App.interchangeIcon);
              } else {
                App.stopIcon.strokeColor = marker.line.linecolor;
                marker.setIcon(App.stopIcon);
              }
            }

          });
          if (marker) {
            setTimeout(() => {
              App.map.setCenter(marker.position);
              App.map.setZoom(16);
            }, 1000);
          }
        });
      }, err => {
        (new CoreInfo(err)).show();
      });
    });
    
  });

  $('#bt-delete-ic').on('click', (e) => {
    // console.log(e);
    (new CoreConfirm(`Are you sure you want to <span class="text-danger">DELETE</span> this interchange?<br>This action is CANNOT be undone.`))
      .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> DELETE interchange</span>')
      .positive(e => {

        let idinterchange = $('#input-interchange-id').find(':selected').attr('data-id');
        let points = $('#input-interchange-id').find(':selected').attr('data-points').split(",");
        
        ajax.post('m/x/mta/lineApi/deleteInterchange', {
          idinterchange: idinterchange,
          points: points
        }).then((response) => { // console.log(response);
          if (response) {
            App.getInterchanges();
            App.interchangeId = null;
            App.interchangePoints = new Set();
            for(let point of points) {
              let marker = App.markers.get(point);
              if (marker) {
                App.stopIcon.strokeColor = marker.line.linecolor;
                marker.idinterchange = null;
                marker.setIcon(App.stopIcon);
              } 
            }
            (new CoreInfo("Interchange has been deleted.")).title('Information').show();

          }
        }, (err) => {
          (new CoreInfo(err)).show();
        });
        $('#mta-marker-context').removeClass('d-flex').hide();
      })
      .show();
  });

  $('#btn-clear-map').on('click', () => {
    App.polylines.forEach(poly => poly.setMap(null));
    App.markers.forEach(marker => marker.setMap(null));
    App.markers.clear();
    App.polylines.clear();
  });

  // floating right-click
  $('#btn-show-interchange').on('click', async () => {
    let idinterchange = $('#btn-show-interchange').attr('data-id');
    let node = $('#input-interchange-id').find(`option[data-id="${idinterchange}"]`).prop('selected', true);
    let points = $('#input-interchange-id').find(':selected').attr('data-points')?.split(",");
    let lines = $('#input-interchange-id').find(':selected').attr('data-lines')?.split(",");
    
    if (!lines) {
      Toast.instance("This stop is not part of an interchange.", {type: 'warning'}).show();
      return;
    }

    await App.checkShown(lines).then(() => {
      // console.warn("All lines loaded");
      if(node.length) {
        App.interchangeId = idinterchange;
        App.interchangePoints = new Set(points);
        // console.log(node);
        App.markers.forEach(m => {
          if (m.isStop) {
            App.stopIcon.strokeColor = m.line.linecolor;
            m.setIcon(App.stopIcon);
          }
        });
        let marker = null;
        points.forEach(p => {
          marker = App.markers.get(p);
          if (marker && marker.isStop) {
            if (marker.idinterchange) {
              App.interchangeIcon.strokeColor = marker.line.linecolor;
              marker.setIcon(App.interchangeIcon);
            }
          }
        });
        if (marker) {
          // console.log(marker);
          App.map.setCenter(marker.position);
          App.map.setZoom(16);
          $('#mta-interchange-context').removeClass('d-flex').hide();
        }
      }
      App.getInterchanges().then(() => {
        $('#input-interchange-id').find(`option[data-id="${idinterchange}"]`).prop('selected', true);
      });
    });
    // console.log(node);
  });

  $('#btn-create-interchange').on('click', () => {
    let idpoint = $('#btn-create-interchange').attr('data-id');
    Core.instance().ajax().get(`m/x/mta/lineApi/createInterchange/${idpoint}`).then(async (idinterchange) => {

      await App.getInterchanges();

      $('#input-interchange-id').find(`option[data-id="${idinterchange}"]`).prop('selected', true);
      let points = $('#input-interchange-id').find(':selected').attr('data-points')?.split(",");

      App.interchangeId = idinterchange;
      App.interchangePoints = new Set(points);

      for(let p of points) {
        marker = App.markers.get(p);
        if (marker) {
          App.interchangeIcon.strokeColor = marker.line.linecolor;
          marker.setIcon(App.interchangeIcon);
        }
      }

      $('#mta-interchange-context').removeClass('d-flex').hide();
    }, err => {
      (new CoreInfo(err)).show();
    });
  });

  $('#btn-nearby-lines').on('click', () => {
    let lat = $('#btn-nearby-lines').attr('data-lat');
    let lng = $('#btn-nearby-lines').attr('data-lng');
    let idline = $('#btn-nearby-lines').attr('data-idline');
    Core.instance().ajax().get(`m/x/mta/lineApi/getNearbyLineIds/${lat}/${lng}/50`).then(async (lines) => {
      for(let line of lines) {
        if (line.idline == idline) continue;
        let node = $('#input-line-id').find(`option[data-id="${line.idline}"]`).prop('selected', true);
        if (node.length) $('#btn-load-line').trigger('click');
        // for(let marker of App.polylines.get(line.idline).markers)
      }
      $('#mta-interchange-context').removeClass('d-flex').hide();
    }, err => {
      (new CoreInfo(err)).show();
    });
  })

  $('#btn-mark-stop').on('click', () => {
    let id = $('#btn-mark-stop').attr('data-id');
    let marker = App.markers.get(id);
    if(marker.isStop) return;

    ajax.post('m/x/mta/lineApi/markPointAsStop/', {
      id: id
    }).then((response) => {
      App.stopIcon.strokeColor = marker.line.linecolor;
      // console.log(marker.isStop, response);
      marker.isStop = true;
      marker.setIcon(App.stopIcon);
      // console.log(marker.isStop);
      $('#mta-interchange-context').removeClass('d-flex').hide();  
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
      // console.log(marker.isStop, response);
      marker.isStop = false;
      marker.setIcon(App.pointIcon);
      // console.log(marker.isStop);
      $('#mta-interchange-context').removeClass('d-flex').hide();  
    }, (err) => {
      (new CoreInfo(err)).show();
    });
  });

  // $('#btn-hide-line').on('click', () => {
  //   let idline = $('#btn-save-line').attr('data-id');
  //   App.polylines.get(idline).setMap(null);
  //   App.markers.forEach(marker => {
  //     if (marker.idline == idline) {
  //       marker.setMap(null);
  //       App.markers.delete(marker.idpoint);
  //     }
  //   }); 
  //   // App.markers.clear();
  //   $('#mta-marker-context').fadeOut('fast');
  // });

  // $('#btn-save-line').on('click', () => {
  //   let idline = $('#btn-save-line').attr('data-id');
  //   let path = App.polylines.get(idline).getPath();
  //   let points = [];
  //   path.forEach((p, index) => {
  //     // console.log(p, p.idpoint);
  //     points.push({
	// 			idpoint: p.idpoint,
	// 			lat: p.lat(),
	// 			lng: p.lng(),
	// 			sequence: index
	// 		});
  //   });
  //   // console.log(line);
  //   ajax.post('m/x/mta/lineApi/saveLine', {
  //     points: JSON.stringify(points),
  //     idline: idline
  //   }).then((response) => {
  //     if (response) 
  //       (new CoreInfo("Line route path has been saved.")).show();
  //   }, (err) => {
  //     (new CoreInfo(err)).show();
  //   });
  //   $('#mta-marker-context').fadeOut('fast');

  // });

  // $('#btn-delete-line').on('click', () => {
  //   let idline = $('#btn-save-line').attr('data-id');
  //   (new CoreConfirm(`Are you sure you want to <span class="text-danger">DELETE</span> this line?<br>This action is CANNOT be undone.`))
  //     .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> DELETE Line</span>')
  //     .positive(e => {
  //       ajax.post('m/x/mta/lineApi/deleteLine', {
  //         idline: idline
  //       }).then((response) => {
  //         if (response) {
  //           (new CoreInfo("Line has been deleted.")).title('Information').show();
  //           $('#btn-hide-line').trigger('click');
  //           App.getLines();
  //         }
  //       }, (err) => {
  //         (new CoreInfo(err)).show();
  //       });
  //       $('#mta-marker-context').fadeOut('fast');
  //     })
  //     .show();
  // });

  // $('#btn-open-line').on('click', () => {
  //   let id = $('#input-line-id').val();
  //   let linecolor = $('#input-line-id').find(`:selected`).data('linecolor');
  //   let name = $('#input-line-id').find(`:selected`).data('name');
  //   let direction = $('#input-line-id').find(`:selected`).data('direction');
  //   let enabled = $('#input-line-id').find(`:selected`).data('enabled')
  //   if (id == 0) {
  //     (new CoreInfo('Please select a line.')).show();
  //     return;
  //   }
  //   $('#btn-load-line').trigger('click');
  //   $('#input-color').val(linecolor);
  //   $('#input-name').val(name);
  //   $(`#input-direction-${direction.toLowerCase()[0]}`).prop('checked', true);
  //   $(`#input-enabled`).prop('checked', parseInt(enabled));
  //   $('.input-color-preview').css('background-color', linecolor);
  //   $('#mta-profile .btn-delete').show();
  //   App.dialogLineProfile = (new CoreWindow('#mta-profile', {
  //     draggable: true,
  //     width: '450px'
  //   })).show();
  //   App.dialogLineProfile.idline = id;
  // });

  // $('#btn-new-line').on('click', () => {
  //   let id = null;
  //   let linecolor = "#555";
  //   let direction = "o";
  //   let enabled = $('#input-line-id').find(`:selected`).data('enabled')
  //   $('#input-color').val(linecolor);
  //   $('#input-name').val('');
  //   $(`#input-direction-${direction.toLowerCase()[0]}`).prop('checked', true);
  //   $(`#input-enabled`).prop('checked', parseInt(enabled));
  //   $('.input-color-preview').css('background-color', linecolor);
  //   $('#mta-profile .btn-delete').hide();
  //   App.dialogLineProfile = (new CoreWindow('#mta-profile', {
  //     draggable: true,
  //     width: '450px'
  //   })).show();
  //   App.dialogLineProfile.idline = null;
  // });

  // $('#input-color').on('input', (e) => {
  //   $('.input-color-preview').css('background-color', $('#input-color').val());
  // });

  // $('#mta-profile .btn-save').on('click', () => {
  //   let id = App.dialogLineProfile.idline;
  //   let name = $('#input-name').val();
  //   let linecolor = $('#input-color').val();
  //   let direction = $('#input-direction-o').prop('checked') ? "O" : "I";
  //   let enabled = $('#input-enabled').prop(`checked`) ? 1 : 0;
  //   if (id != null) {
  //     ajax.post('m/x/mta/lineApi/updateLine', {
  //       idline: id,
  //       name: name,
  //       direction: direction,
  //       linecolor: linecolor,
  //       enabled: enabled
  //     }).then(result => {
  //       (new CoreInfo('Line profile has been saved.')).show();
  //       App.dialogLineProfile.hide();
  //       App.getLines();
  //     }, error => (new CoreInfo(error)).show());
  //   } else {
  //     ajax.post('m/x/mta/lineApi/createLine', {
  //       name: name,
  //       direction: direction,
  //       linecolor: linecolor,
  //       enabled: enabled
  //     }).then(result => {
  //       (new CoreInfo('Line profile has been created.')).show();
  //       App.dialogLineProfile.hide();
  //       App.getLines();
  //     }, error => (new CoreInfo(error)).show());
  //   }
  // });

  // $('#mta-profile .btn-delete').on('click', (e) => {
  //   let idline = App.dialogLineProfile.idline;
  //   // console.log(App.polylines, App.polylines.get(idline));
  //   // return;
  //   (new CoreConfirm(`Are you sure you want to <span class="text-danger">DELETE</span> this line?<br>This action is CANNOT be undone.`))
  //     .title('<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> DELETE Line</span>')
  //     .positive(e => {
  //       ajax.post('m/x/mta/lineApi/deleteLine', {
  //         idline: idline
  //       }).then((response) => {
  //         if (response) {
  //           (new CoreInfo("Line has been deleted.")).title('Information').show();
  //           let poly = App.polylines.get(idline);
  //           if (poly) poly.setMap(null);
  //           App.markers.forEach(marker => {
  //             if (marker.idline == idline) {
  //               marker.setMap(null);
  //               App.markers.delete(marker.idpoint);
  //             }
  //           }); 
  //           App.dialogLineProfile.hide();
  //           App.getLines();
  //         }
  //       }, (err) => {
  //         (new CoreInfo(err)).show();
  //       });
  //       $('#mta-marker-context').fadeOut('fast');
  //     })
  //     .show();
  // });



});