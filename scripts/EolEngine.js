
  
  var coordonnes=[], //coord lat lon des recherches
  feature, //data postes 
  svg; //��l��ments svg 
  var mouse = {x: 0, y: 0};

  var borderBourgogne,borderChampagne,borderAquitaine,borderCorse,borderPoitou=0;
  var zniefBourgogne,zniefChampagne,zniefCorse,zniefPoitou=0;
  var postesBourgogne=0;
  var dangerBourgogne,dangerChampagne,dangerCorse=0;
  var radarBourgogne,radarChampagne,radarAquitaine,radarCorse,radarPoitou=0;
  var sourisBourgogne,sourisChampagne,sourisCorse=0;
  var habBourgogne, habAquitaine=0;
  var parcBourgogne,parcAquitaine,parcPoitou=0;
  var triBourgogne=0;
  var monuBourgogne,monuChampagne,monuAquitaine,monuCorse,monuPoitou=0;
  var validBourgogne,validAquitaine,validPoitou=0;

  //cr��ation carte
    var map = L.map('map').setView([47.22,4.3], 6);
        mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo( map );
        
        L.control.scale({"imperial":false}).addTo(map);

        L.BingLayer = L.TileLayer.extend({
            options: {
              subdomains: [0, 1, 2, 3],
              type: 'Aerial',
              attribution: 'Bing',
              culture: ''
            },

            initialize: function(key, options) {
              L.Util.setOptions(this, options);

              this._key = key;
              this._url = null;
              this.meta = {};
              this.loadMetadata();
            },

            tile2quad: function(x, y, z) {
              var quad = '';
              for (var i = z; i > 0; i--) {
                var digit = 0;
                var mask = 1 << (i - 1);
                if ((x & mask) !== 0) digit += 1;
                if ((y & mask) !== 0) digit += 2;
                quad = quad + digit;
              }
              return quad;
            },

            getTileUrl: function(p, z) {
              var zoom = this._getZoomForUrl();
              var subdomains = this.options.subdomains,
                s = this.options.subdomains[Math.abs((p.x + p.y) % subdomains.length)];
              return this._url.replace('{subdomain}', s)
                  .replace('{quadkey}', this.tile2quad(p.x, p.y, zoom))
                  .replace('{culture}', this.options.culture);
            },

            loadMetadata: function() {
              var _this = this;
              var cbid = '_bing_metadata_' + L.Util.stamp(this);
              window[cbid] = function (meta) {
                _this.meta = meta;
                window[cbid] = undefined;
                var e = document.getElementById(cbid);
                e.parentNode.removeChild(e);
                if (meta.errorDetails) {
                  return;
                }
                _this.initMetadata();
              };
              var url = document.location.protocol + '//dev.virtualearth.net/REST/v1/Imagery/Metadata/' + this.options.type + '?include=ImageryProviders&jsonp=' + cbid +
                        '&key=' + this._key + '&UriScheme=' + document.location.protocol.slice(0, -1);
              var script = document.createElement('script');
              script.type = 'text/javascript';
              script.src = url;
              script.id = cbid;
              document.getElementsByTagName('head')[0].appendChild(script);
            },

            initMetadata: function() {
              var r = this.meta.resourceSets[0].resources[0];
              this.options.subdomains = r.imageUrlSubdomains;
              this._url = r.imageUrl;
              this._providers = [];
              if (r.imageryProviders) {
                for (var i = 0; i < r.imageryProviders.length; i++) {
                  var p = r.imageryProviders[i];
                  for (var j = 0; j < p.coverageAreas.length; j++) {
                    var c = p.coverageAreas[j];
                    var coverage = {zoomMin: c.zoomMin, zoomMax: c.zoomMax, active: false};
                    var bounds = new L.LatLngBounds(
                        new L.LatLng(c.bbox[0]+0.01, c.bbox[1]+0.01),
                        new L.LatLng(c.bbox[2]-0.01, c.bbox[3]-0.01)
                    );
                    coverage.bounds = bounds;
                    coverage.attrib = p.attribution;
                    this._providers.push(coverage);
                  }
                }
              }
              this._update();
            },

            _update: function() {
              if (this._url === null || !this._map) return;
              this._update_attribution();
              L.TileLayer.prototype._update.apply(this, []);
            },

            _update_attribution: function() {
              var bounds = this._map.getBounds();
              var zoom = this._map.getZoom();
              for (var i = 0; i < this._providers.length; i++) {
                var p = this._providers[i];
                if ((zoom <= p.zoomMax && zoom >= p.zoomMin) &&
                    bounds.intersects(p.bounds)) {
                  if (!p.active && this._map.attributionControl)
                    this._map.attributionControl.addAttribution(p.attrib);
                  p.active = true;
                } else {
                  if (p.active && this._map.attributionControl)
                    this._map.attributionControl.removeAttribution(p.attrib);
                  p.active = false;
                }
              }
            },

            onRemove: function(map) {
              for (var i = 0; i < this._providers.length; i++) {
                var p = this._providers[i];
                if (p.active && this._map.attributionControl) {
                  this._map.attributionControl.removeAttribution(p.attrib);
                  p.active = false;
                }
              }
                    L.TileLayer.prototype.onRemove.apply(this, [map]);
            }
          });

          L.bingLayer = function (key, options) {
              return new L.BingLayer(key, options);
          };

          var bing = new L.BingLayer("Aq4xvZkzTmc0kegk4hHGC43vhPG2OlDZkoD8oLBK2JnsjyJ0-TgGVfmnPNVMW6RG");
          map.addControl(new L.Control.Layers({'Plan':layer,"Satellite":bing}, {}));
    
 // initialization leaflet de la couche D3
 map._initPathRoot()


 // liaison carte D3
 svg = d3.select("#map").select("svg"),
 g = svg.append("g");
 
//fetch data json
 d3.json("http://localhost/ppe/eol/fics_php/dataStations.php", function(collection) {
  collection.stations.forEach(function(d) {   //remettre collection.stations
   d.LatLng = new L.LatLng(d.latitude,d.longitude)
   d.id = d.nom;
   d.alt= d.altitude;
  })
  var load=true;

//cr��ation cercles stations
  feature = g.selectAll("circle")
   .data(collection.stations) //remettre collection.stations
   .enter().append("circle")
   .style("stroke", "grey")  
   .style("opacity", .8) 
   .style("fill", "#58e1ff")
   .attr("r", 4)
   .attr("name",function(d){d.nom})
   .on("mousemove",function(d){
    //pointeur nom station
    var e = window.event;
    M = mouse.x ;
    N = mouse.y ;
    $("#pointer").css({top:N,left:M});
    $("#pointer").html("Station: "+d.id+"<br/>Altitude: "+d.alt+" m");
   });

   //initialisation de chaque couche svg
   // var plane,plane2,plane3,relief, radar;
   // var bourgognedanger, champagnedanger;
   // var border,back,chauvesouris,zee,tri,parc,hab,valid;

   var visible={};
   if(load){

    //*******************************************************BOURGOGNE*******************************************************************
//toutes les fonctions pour la région de Bourgogne
    
    updateBourgogne();
    map.on("viewreset", updateBourgogne); 

  function LoadBourgogneBorder()
  { d3.xml("CSV/bourgogne/border.svg", "image/svg+xml", function(xml) {  
      //transaltion xml en noeuds svg D3
      plane4 = document.importNode(xml.documentElement, true);
      //cr��ation couche classe css 
      bourgogneborder=svg.append("g").attr('class','bourgogneborderlayer layer')
      .each(function(d, i){ 
        //attache noeud svg 
          this.appendChild(plane4.cloneNode(true)); 
      }).on("mousemove",function(){
      if(visible["bourgogneborder"]){
        
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Frontière");
      }
    }).style("opacity", 0.8);  
    visible["bourgogneborder"]=true;
      updateBourgogne();
    });
}
  

  function LoadBourgognePostes(){
     d3.xml("CSV/bourgogne/postes.svg", "image/svg+xml", function(xml) {  
  plane5 = document.importNode(xml.documentElement, true);
    bourgogneback=svg.append("g").attr('class','bourgognebacklayer layer')
    .each(function(d, i){ 
        this.appendChild(plane5.cloneNode(true)); 
    }).on("mousemove",function(){
      if(visible["bourgogneback"]){
        
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Hors poste source");
      }
    }).style("opacity", 0.8);  
    visible["bourgogneback"]=true;
    updateBourgogne();
    });
   }


   function LoadBourgogneDanger(){
  d3.xml("CSV/bourgogne/danger.svg", "image/svg+xml", function(xml) {  
  plane6 = document.importNode(xml.documentElement, true);
    bourgognedanger=svg.append("g").attr('class','bourgognedangerlayer layer')
    .each(function(d, i){ 
        this.appendChild(plane6.cloneNode(true)); 
    }).on("mousemove",function(){
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Avifaune");}).style("opacity",0.6); 
    visible["bourgognedanger"]=true;
    updateBourgogne();
    });
    }

    function LoadBourgogneHabitations(){
    d3.xml("CSV/bourgogne/habitations.svg", "image/svg+xml", function(xml) {  
      plane7 = document.importNode(xml.documentElement, true);
      bourgognehab=svg.append("g").attr('class','bourgognehablayer layer')
      .each(function(d, i){ 
          this.appendChild(plane7.cloneNode(true)); 
      }).on("mousemove",function(){
        
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Habitations");
      }).style("opacity",0.6);
      visible["bourgognehab"]=true;  
      updateBourgogne();

    });
    }
    function LoadBourgogneValid(){
     d3.xml("CSV/bourgogne/valid.svg", "image/svg+xml", function(xml) {  
      plane1 = document.importNode(xml.documentElement, true);
      bourgognevalid=svg.append("g").attr('class','bourgognevalidlayer layer')
      .each(function(d, i){ 
          this.appendChild(plane1.cloneNode(true)); 
      }).on("mousemove",function(){

        
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Zone valide");
      }).style("opacity",0.5);
      visible["bourgognevalid"]=true;  
     updateBourgogne();

    });
   }
   function LoadBourgogneSouris(){
    d3.xml("CSV/bourgogne/chauvesouris.svg", "image/svg+xml", function(xml) {  
      plane8 = document.importNode(xml.documentElement, true);
      bourgognechauvesouris=svg.append("g").attr('class','bourgognechauvesourislayer layer')
      .each(function(d, i){ 
          this.appendChild(plane8.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["bourgognechauvesouris"])
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Chiroptères");
      }).style("opacity", 0.6);
      visible["bourgognechauvesouris"]=true;
      updateBourgogne();
 
    })
  }
  function LoadBourgogneRadar(){
    d3.xml("CSV/bourgogne/radar.svg", "image/svg+xml", function(xml) {  
      plane9 = document.importNode(xml.documentElement, true);
      bourgogneradar=svg.append("g").attr('class','bourgogneradarlayer layer')
      .each(function(d, i){ 
          this.appendChild(plane9.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["bourgogneradar"])
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Aviation");
      }).style("opacity", 0.6);;
      visible["bourgogneradar"]=true;
      updateBourgogne();
 
    });
    }
    function LoadBourgogneParc(){
     d3.xml("CSV/bourgogne/parc.svg", "image/svg+xml", function(xml) {  
      plane10 = document.importNode(xml.documentElement, true);
      bourgogneparc=svg.append("g").attr('class','bourgogneparclayer layer')
      .each(function(d, i){ 
          this.appendChild(plane10.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["parc"])
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Parc naturel");
console.log(mouse.x);
      }).style("opacity",0.6);  
      visible["bourgogneparc"]=true;
      updateBourgogne();

    });
   }
   function LoadBourgogneZee(){
     d3.xml("CSV/bourgogne/zee.svg", "image/svg+xml", function(xml) {  
      plane11 = document.importNode(xml.documentElement, true);
      bourgognezee=svg.append("g").attr('class','bourgognezeelayer layer')
      .each(function(d, i){ 
          this.appendChild(plane11.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["bourgognezee"])
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("ZNIEFF");
    console.log(mouse.x);
      }).style("opacity", 0.4); 
      visible["bourgognezee"]=true;
      updateBourgogne();

    });
   }
   function LoadBourgogneTri(){
     d3.xml("CSV/bourgogne/tri.svg", "image/svg+xml", function(xml) {  
      plane12 = document.importNode(xml.documentElement, true);
      bourgognetri=svg.append("g").attr('class','bourgognetrilayer layer')
      .each(function(d, i){ 
          this.appendChild(plane12.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["bourgognetri"])
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Station radioélectrique");
console.log(mouse.x);
      }).style("opacity",0.6);  
      visible["bourgognetri"]=true;
      updateBourgogne();

    });
   }

   //************************************************************CHAMPAGNE ARDENE****************************************************

       function LoadChampagneBorder()
  { d3.xml("CSV/champagne/border.svg", "image/svg+xml", function(xml) {  
      //transaltion xml en noeuds svg D3
      planeChampagne= document.importNode(xml.documentElement, true);
      //cr��ation couche classe css 
      champagneborder=svg.append("g").attr('class','champagneborderlayer layer')
      .each(function(d, i){ 
        //attache noeud svg 
          this.appendChild(planeChampagne.cloneNode(true)); 
      }).on("mousemove",function(){
      if(visible["champagneborder"]){
        
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Frontière");
      }
    }).style("opacity", 0.8);  
    visible["champagneborder"]=true;
      updateChampagne();
    });
}
     
      function LoadChampagneZee(){
     d3.xml("CSV/champagne/zee.svg", "image/svg+xml", function(xml) {  
      plane13 = document.importNode(xml.documentElement, true);
      champagnezee=svg.append("g").attr('class','champagnezeelayer layer')
      .each(function(d, i){ 
          this.appendChild(plane13.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["champagnezee"])
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("ZNIEFF");
    console.log(mouse.x);
      }).style("opacity", 0.4); 
      visible["champagnezee"]=true;
      updateChampagne();

    });
   }

   function LoadChampagneRadar(){
     d3.xml("CSV/champagne/radar.svg", "image/svg+xml", function(xml) {  
      plane14 = document.importNode(xml.documentElement, true);
      champagneradar=svg.append("g").attr('class','champagneradarlayer layer')
      .each(function(d, i){ 
          this.appendChild(plane14.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["champagneradar"])
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Radar");
    console.log(mouse.x);
      }).style("opacity", 0.4); 
      visible["champagneradar"]=true;
      updateChampagne();

    });
   }

     function LoadChampagneDanger(){
  d3.xml("CSV/champagne/danger.svg", "image/svg+xml", function(xml) {  
  plane15 = document.importNode(xml.documentElement, true);
    champagnedanger=svg.append("g").attr('class','champagnedangerlayer layer')
    .each(function(d, i){ 
        this.appendChild(plane15.cloneNode(true)); 
    }).on("mousemove",function(){
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Avifaune");}).style("opacity",0.6); 
    visible["champagnedanger"]=true;
    updateChampagne();
    });
    }

    function LoadChampagneSouris(){
    d3.xml("CSV/champagne/chauvesouris.svg", "image/svg+xml", function(xml) {  
      plane16 = document.importNode(xml.documentElement, true);
      champagnechauvesouris=svg.append("g").attr('class','champagnechauvesourislayer layer')
      .each(function(d, i){ 
          this.appendChild(plane16.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["champagnechauvesouris"])
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Chiroptères");
      }).style("opacity", 0.6);
      visible["champagnechauvesouris"]=true;
      updateChampagne();
 
    });
  }

    function LoadChampagneMonu(){
  d3.xml("CSV/champagne/monu.svg", "image/svg+xml", function(xml) {  
  plane13 = document.importNode(xml.documentElement, true);
    champagnemonu=svg.append("g").attr('class','champagnemonulayer layer')
    .each(function(d, i){ 
        this.appendChild(plane13.cloneNode(true)); 
    }).on("mousemove",function(){
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Patrimoine");}).style("opacity",0.6); 
    visible["champagnemonu"]=true;
    updateChampagne();
    });
    }


 // ---------------------------------------------------- AQUITAINE ------------------------------------------------------------------------------------------------

 function LoadAquitaineBorder()
  { d3.xml("CSV/aquitaine/border.svg", "image/svg+xml", function(xml) {  
      //transaltion xml en noeuds svg D3
      plane4 = document.importNode(xml.documentElement, true);
      //cr��ation couche classe css 
      aquitaineborder=svg.append("g").attr('class','aquitaineborderlayer layer')
      .each(function(d, i){ 
        //attache noeud svg 
          this.appendChild(plane4.cloneNode(true)); 
      }).on("mousemove",function(){
      if(visible["aquitaineborder"]){
        
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Frontière");
      }
    }).style("opacity", 0.8);  
    visible["aquitaineborder"]=true;
      updateAquitaine();
    });
}
  
    function LoadAquitaineHabitations(){
    d3.xml("CSV/aquitaine/habitations.svg", "image/svg+xml", function(xml) {  
      plane7 = document.importNode(xml.documentElement, true);
      aquitainehab=svg.append("g").attr('class','aquitainehablayer layer')
      .each(function(d, i){ 
          this.appendChild(plane7.cloneNode(true)); 
      }).on("mousemove",function(){
        
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Habitations");
      }).style("opacity",0.6);
      visible["aquitainehab"]=true;  
      updateAquitaine();

    });
    }
    function LoadAquitaineValid(){
     d3.xml("CSV/aquitaine/valid.svg", "image/svg+xml", function(xml) {  
      plane1 = document.importNode(xml.documentElement, true);
      aquitainevalid=svg.append("g").attr('class','aquitainevalidlayer layer')
      .each(function(d, i){ 
          this.appendChild(plane1.cloneNode(true)); 
      }).on("mousemove",function(){

        
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Zone valide");
      }).style("opacity",0.5);
      visible["aquitainevalid"]=true;  
     updateAquitaine();

    });
   }
   
  function LoadAquitaineRadar(){
    d3.xml("CSV/aquitaine/radar.svg", "image/svg+xml", function(xml) {  
      plane9 = document.importNode(xml.documentElement, true);
      aquitaineradar=svg.append("g").attr('class','aquitaineradarlayer layer')
      .each(function(d, i){ 
          this.appendChild(plane9.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["aquitaineradar"])
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Aviation");
      }).style("opacity", 0.6);;
      visible["aquitaineradar"]=true;
      updateAquitaine();
 
    });
    }
    function LoadAquitaineParc(){
     d3.xml("CSV/aquitaine/parc.svg", "image/svg+xml", function(xml) {  
      plane10 = document.importNode(xml.documentElement, true);
      aquitaineparc=svg.append("g").attr('class','aquitaineparclayer layer')
      .each(function(d, i){ 
          this.appendChild(plane10.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["parc"])
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Parc naturel");
console.log(mouse.x);
      }).style("opacity",0.6);  
      visible["aquitaineparc"]=true;
      updateAquitaine();

    });
   }
  
     function LoadAquitaineMonu(){
  d3.xml("CSV/aquitaine/monu.svg", "image/svg+xml", function(xml) {  
  plane13 = document.importNode(xml.documentElement, true);
    aquitainemonu=svg.append("g").attr('class','aquitainemonulayer layer')
    .each(function(d, i){ 
        this.appendChild(plane13.cloneNode(true)); 
    }).on("mousemove",function(){
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Patrimoine");}).style("opacity",0.6); 
    visible["aquitainemonu"]=true;
    updateAquitaine();
    });
   }


//*******************************************************CORSE*******************************************************************
//toutes les fonctions pour la région de Bourgogne

 function LoadCorseBorder()
  { d3.xml("CSV/corse/border.svg", "image/svg+xml", function(xml) {  
      //transaltion xml en noeuds svg D3
      plane4 = document.importNode(xml.documentElement, true);
      //cr��ation couche classe css 
      corseborder=svg.append("g").attr('class','corseborderlayer layer')
      .each(function(d, i){ 
        //attache noeud svg 
          this.appendChild(plane4.cloneNode(true)); 
      }).on("mousemove",function(){
      if(visible["corseborder"]){
        
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Frontière");
      }
    }).style("opacity", 0.8);  
    visible["corseborder"]=true;
      updateCorse();
    });
}
  
   function LoadCorseDanger(){
  d3.xml("CSV/corse/danger.svg", "image/svg+xml", function(xml) {  
  plane6 = document.importNode(xml.documentElement, true);
    corsedanger=svg.append("g").attr('class','corsedangerlayer layer')
    .each(function(d, i){ 
        this.appendChild(plane6.cloneNode(true)); 
    }).on("mousemove",function(){
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Avifaune");}).style("opacity",0.6); 
    visible["corsedanger"]=true;
    updateCorse();
    });
    }

    
   function LoadCorseSouris(){
    d3.xml("CSV/corse/chauvesouris.svg", "image/svg+xml", function(xml) {  
      plane8 = document.importNode(xml.documentElement, true);
      corsechauvesouris=svg.append("g").attr('class','corsechauvesourislayer layer')
      .each(function(d, i){ 
          this.appendChild(plane8.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["corsechauvesouris"])
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Chiroptères");
      }).style("opacity", 0.6);
      visible["corsechauvesouris"]=true;
      updateCorse();
 
    })
  }
  function LoadCorseRadar(){
    d3.xml("CSV/corse/radar.svg", "image/svg+xml", function(xml) {  
      plane9 = document.importNode(xml.documentElement, true);
      corseradar=svg.append("g").attr('class','corseradarlayer layer')
      .each(function(d, i){ 
          this.appendChild(plane9.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["corseradar"])
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Aviation");
      }).style("opacity", 0.6);;
      visible["corseradar"]=true;
      updateCorse();
 
    });
    }
   
   function LoadCorseZee(){
     d3.xml("CSV/corse/zee.svg", "image/svg+xml", function(xml) {  
      plane11 = document.importNode(xml.documentElement, true);
      corsezee=svg.append("g").attr('class','corsezeelayer layer')
      .each(function(d, i){ 
          this.appendChild(plane11.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["corsezee"])
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("ZNIEFF");
    console.log(mouse.x);
      }).style("opacity", 0.4); 
      visible["corsezee"]=true;
      updateCorse();

    });
   }

    function LoadCorseMonu(){
  d3.xml("CSV/corse/monu.svg", "image/svg+xml", function(xml) {  
  plane13 = document.importNode(xml.documentElement, true);
    corsemonu=svg.append("g").attr('class','corsemonulayer layer')
    .each(function(d, i){ 
        this.appendChild(plane13.cloneNode(true)); 
    }).on("mousemove",function(){
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Patrimoine");}).style("opacity",0.6); 
    visible["corsemonu"]=true;
    updateCorse();
    });
    }

//----------------------------------------- POITOU CHARENTES -----------------------------------------------------------------------------------------   

 function LoadPoitouBorder()
  { d3.xml("CSV/poitou/border.svg", "image/svg+xml", function(xml) {  
      //transaltion xml en noeuds svg D3
      plane4 = document.importNode(xml.documentElement, true);
      //cr��ation couche classe css 
      poitouborder=svg.append("g").attr('class','poitouborderlayer layer')
      .each(function(d, i){ 
        //attache noeud svg 
          this.appendChild(plane4.cloneNode(true)); 
      }).on("mousemove",function(){
      if(visible["poitouborder"]){
        
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Frontière");
      }
    }).style("opacity", 0.8);  
    visible["poitouborder"]=true;
      updatePoitou();
    });
}
  

    function LoadPoitouValid(){
     d3.xml("CSV/poitou/valid.svg", "image/svg+xml", function(xml) {  
      plane1 = document.importNode(xml.documentElement, true);
      poitouvalid=svg.append("g").attr('class','poitouvalidlayer layer')
      .each(function(d, i){ 
          this.appendChild(plane1.cloneNode(true)); 
      }).on("mousemove",function(){

        
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Zone valide");
      }).style("opacity",0.5);
      visible["poitouvalid"]=true;  
     updatePoitou();

    });
   }

   
  function LoadPoitouRadar(){
    d3.xml("CSV/poitou/radar.svg", "image/svg+xml", function(xml) {  
      plane9 = document.importNode(xml.documentElement, true);
      poitouradar=svg.append("g").attr('class','poitouradarlayer layer')
      .each(function(d, i){ 
          this.appendChild(plane9.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["poitouradar"])
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Aviation");
      }).style("opacity", 0.6);;
      visible["poitouradar"]=true;
      updatePoitou();
 
    });
    }
    function LoadPoitouParc(){
     d3.xml("CSV/poitou/parc.svg", "image/svg+xml", function(xml) {  
      plane10 = document.importNode(xml.documentElement, true);
      poitouparc=svg.append("g").attr('class','poitouparclayer layer')
      .each(function(d, i){ 
          this.appendChild(plane10.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["parc"])
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Parc naturel");
console.log(mouse.x);
      }).style("opacity",0.6);  
      visible["poitouparc"]=true;
      updatePoitou();

    });
   }
   function LoadPoitouZee(){
     d3.xml("CSV/poitou/zee.svg", "image/svg+xml", function(xml) {  
      plane11 = document.importNode(xml.documentElement, true);
      poitouzee=svg.append("g").attr('class','poitouzeelayer layer')
      .each(function(d, i){ 
          this.appendChild(plane11.cloneNode(true)); 
      }).on("mousemove",function(){
        if(visible["poitouzee"])
      $("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("ZNIEFF");
    console.log(mouse.x);
      }).style("opacity", 0.4); 
      visible["poitouzee"]=true;
      updatePoitou();

    });
   }
  
   function LoadPoitouMonu(){
  d3.xml("CSV/poitou/monu.svg", "image/svg+xml", function(xml) {  
  plane13 = document.importNode(xml.documentElement, true);
    poitoumonu=svg.append("g").attr('class','poitoumonulayer layer')
    .each(function(d, i){ 
        this.appendChild(plane13.cloneNode(true)); 
    }).on("mousemove",function(){
$("#alert").css({top:mouse.y,left:mouse.x});$("#alert").html("Patrimoine");}).style("opacity",0.6); 
    visible["poitoumonu"]=true;
    updatePoitou();
    });
    }


   }


   ////Sélection des calques//////////////////////////     BOURGOGNE   //////////////////////////////////////////////////////////////////////////////////////////////
       $('#zeecheckBourgogne').change(function() {
        visible["zee"]=this.checked;

            if(this.checked){ zniefBourgogne=1;}//case cochée
           else {zniefBourgogne=0;} //case décochée
      
        if(zniefBourgogne==1){
            LoadBourgogneZee();
            updateBourgogne();}
      
      if(zniefBourgogne==0) {
          bourgognezee=null;
            svg.selectAll(".bourgognezeelayer").remove()
        }
      });

        //-----------------------------------------------------------------------------------------------------------------------------------------

         $('#bordercheckBourgogne').change(function() {
        visible["border"]=this.checked;

            if(this.checked){ borderBourgogne=1;}//case cochée
           else {borderBourgogne=0;} //case décochée
      
        if(borderBourgogne==1){
            LoadBourgogneBorder();
            //updateBourgogne();
              //ON REGLE LE ZOOM
        map.on("viewreset", updateBourgogne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
      }
      
      if(borderBourgogne==0) {
          bourgogneborder=null;
            svg.selectAll(".bourgogneborderlayer").remove()
        }
      });

         //----------------------------------------------------------------------------------------------------------------------------------------
      $('#postescheckBourgogne').change(function() {
        visible["postes"]=this.checked;

            if(this.checked){ postesBourgogne=1;}//case cochée
           else {postesBourgogne=0;} //case décochée
      
        if(postesBourgogne==1) {
            LoadBourgognePostes();
            updateBourgogne();
            //ON REGLE LE ZOOM
        map.on("viewreset", updateBourgogne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
      }

      if(postesBourgogne==0) {
          bourgogneback=null;
            svg.selectAll(".bourgognebacklayer").remove()
        }
      });

       //---------------------------------------------------------------------------------------------------------------------------------------
       $('#radarcheckBourgogne').change(function() {
        visible["radar"]=this.checked;

            if(this.checked){ radarBourgogne=1;}//case cochée
           else {radarBourgogne=0;} //case décochée
      
        if(radarBourgogne==1){
            LoadBourgogneRadar();
            updateBourgogne();
             //ON REGLE LE ZOOM
        map.on("viewreset", updateBourgogne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
          }

    
      if(radarBourgogne==0){
          bourgogneradar=null;
            svg.selectAll(".bourgogneradarlayer").remove()
        }
          });

      //------------------------------------------------------------------------------------------------------------------------------------
       $('#dangercheckBourgogne').change(function() {
        visible["danger"]=this.checked;

            if(this.checked){ dangerBourgogne=1;}//case cochée
           else {dangerBourgogne=0;} //case décochée
      
        if(dangerBourgogne==1) {
            LoadBourgogneDanger();
            updateBourgogne(); //ON REGLE LE ZOOM
        map.on("viewreset", updateBourgogne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
      }

      if(dangerBourgogne==0){
          bourgognedanger=null;
            svg.selectAll(".bourgognedangerlayer").remove()
       }
      });

      //---------------------------------------------------------------------------------------------------------------------------------------
       $('#sourischeckBourgogne').change(function() {
        visible["souris"]=this.checked;

            if(this.checked){ sourisBourgogne=1;}//case cochée
           else {sourisBourgogne=0;} //case décochée
      
        if(sourisBourgogne==1){
            LoadBourgogneSouris();
            updateBourgogne();
           //ON REGLE LE ZOOM
        map.on("viewreset", updateBourgogne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
      }

      if(sourisBourgogne==0){
         bourgognesouris=null;
            svg.selectAll(".bourgognechauvesourislayer").remove()
       }
      });

      //-------------------------------------------------------------------------------------------------------------------------------------------
         $('#validcheckBourgogne').change(function() {
        visible["valid"]=this.checked;

            if(this.checked){ validBourgogne=1;}//case cochée
           else {validBourgogne=0;} //case décochée
      
        if(validBourgogne==1){
            LoadBourgogneValid();
            updateBourgogne();
           //ON REGLE LE ZOOM
        map.on("viewreset", updateBourgogne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
      }

      if(validBourgogne==0){
          bourgognevalid=null;
            svg.selectAll(".bourgognevalidlayer").remove()
       }
      });
      //-------------------------------------------------------------------------------------------------------------------------------------------
       $('#habcheckBourgogne').change(function() {
        visible["hab"]=this.checked;

            if(this.checked){ habBourgogne=1;}//case cochée
           else {habBourgogne=0;} //case décochée
      
        if(habBourgogne==1){
            LoadBourgogneHabitations();
            updateBourgogne(); //ON REGLE LE ZOOM
        map.on("viewreset", updateBourgogne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
      }

      if(habBourgogne==0){
          bourgognehab=null;
            svg.selectAll(".bourgognehablayer").remove()
       }

      });
      //------------------------------------------------------------------------------------------------------------------------------------------
           $('#parccheckBourgogne').change(function() {
        visible["parc"]=this.checked;

            if(this.checked){ parcBourgogne=1;}//case cochée
           else {parcBourgogne=0;} //case décochée

       if(parcBourgogne==1){
            LoadBourgogneParc();
            updateBourgogne();
             //ON REGLE LE ZOOM
        map.on("viewreset", updateBourgogne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }
      
      if(parcBourgogne==0){
          bourgogneparc=null;
            svg.selectAll(".bourgogneparclayer").remove()
        }
      });
       //-----------------------------------------------------------------------------------------------------------------------------------------
        $('#tricheckBourgogne').change(function() {
        visible["tri"]=this.checked;

            if(this.checked){ triBourgogne=1;}//case cochée
           else {triBourgogne=0;} //case décochée
      
       if(triBourgogne==1){
            LoadBourgogneTri();
            updateBourgogne();
             //ON REGLE LE ZOOM
        map.on("viewreset", updateBourgogne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }
      
      if(triBourgogne==0){
          bourgognetri=null;
            svg.selectAll(".bourgognetrilayer").remove()
        }
      });
     
////////////////////////////////// FIN CASES A COCHER BOURGOGNE /////////////////////////////////////////////////////////////////////////////////////////////

     

   ////Sélection des calques////////////   CHAMPAGNE  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
       
       $('#zeecheckChampagne').change(function() {
        visible["zee"]=this.checked;

            if(this.checked){ zniefChampagne=1;}//case cochée
           else {zniefChampagne=0;} //case décochée
      
        if(zniefChampagne==1){
            LoadChampagneZee();
            updateChampagne();
           //ON REGLE LE ZOOM
        map.on("viewreset", updateChampagne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
      }
      
      if(zniefChampagne==0) {
          champagnezee=null;
            svg.selectAll(".champagnezeelayer").remove()
        }
      });

        //-----------------------------------------------------------------------------------------------------------------------------------------

         $('#bordercheckChampagne').change(function() {
        visible["border"]=this.checked;

            if(this.checked){ borderChampagne=1;}//case cochée
           else {borderChampagne=0;} //case décochée
      
        if(borderChampagne==1){
            LoadChampagneBorder();
            updateChampagne();
           //ON REGLE LE ZOOM
        map.on("viewreset", updateChampagne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
      }
      
      if(borderChampagne==0) {
          champagneborderborder=null;
            svg.selectAll(".champagneborderlayer").remove()
        }
      });

       //---------------------------------------------------------------------------------------------------------------------------------------
       $('#radarcheckChampagne').change(function() {
        visible["radar"]=this.checked;

            if(this.checked){ radarChampagne=1;}//case cochée
           else {radarChampagne=0;} //case décochée
      
        if(radarChampagne==1){
            LoadChampagneRadar();
            updateChampagne();
          map.on("viewreset", updateChampagne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }

    
      if(radarChampagne==0){
          champagneradar=null;
            svg.selectAll(".champagneradarlayer").remove()
        }
          });

      //------------------------------------------------------------------------------------------------------------------------------------
       $('#dangercheckChampagne').change(function() {
        visible["danger"]=this.checked;

            if(this.checked){ dangerChampagne=1;}//case cochée
           else {dangerChampagne=0;} //case décochée
      
        if(dangerChampagne==1) {
            LoadChampagneDanger();
            updateChampagne();
          map.on("viewreset", updateChampagne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }

      if(dangerChampagne==0){
          champagnedanger=null;
            svg.selectAll(".champagnedangerlayer").remove()
       }
      });

      //---------------------------------------------------------------------------------------------------------------------------------------
       $('#sourischeckChampagne').change(function() {
        visible["souris"]=this.checked;

            if(this.checked){ sourisChampagne=1;}//case cochée
           else {sourisChampagne=0;} //case décochée
      
        if(sourisChampagne==1){
            LoadChampagneSouris();
            updateChampagne();
          map.on("viewreset", updateChampagne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }

      if(sourisChampagne==0){
         champagnesouris=null;
            svg.selectAll(".champagnechauvesourislayer").remove()
       }
      });

      //--------------------------------------------------------------------------------------------------------------------------------------
      $('#monucheckChampagne').change(function() {
        visible["monu"]=this.checked;

            if(this.checked){ monuChampagne=1;}//case cochée
           else {monuChampagne=0;} //case décochée
      
       if(monuChampagne==1){
            LoadChampagneMonu();
            updateChampagne();
            map.on("viewreset", updateChampagne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }
      
      if(monuChampagne==0){
          champagnemonu=null;
            svg.selectAll(".champagnemonulayer").remove()
        }
      });

      ///////////////////////////////////////////////////////////////// FIN CASES A COSER CHAMPAGNE /////////////////////////////////////////////////////////////////
      
    
    ////Sélection des calques//////////////////////////     AQUITAINE   //////////////////////////////////////////////////////////////////////////////////////////////
        
         $('#bordercheckAquitaine').change(function() {
        visible["border"]=this.checked;

            if(this.checked){ borderAquitaine=1;}//case cochée
           else {borderAquitaine=0;} //case décochée
      
        if(borderAquitaine==1){
            LoadAquitaineBorder();
            updateAquitaine();
          map.on("viewreset", updateAquitaine); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }
      
      if(borderAquitaine==0) {
          aquitaineborder=null;
            svg.selectAll(".aquitaineborderlayer").remove()
        }
      });

       //---------------------------------------------------------------------------------------------------------------------------------------
       $('#radarcheckAquitaine').change(function() {
        visible["radar"]=this.checked;

            if(this.checked){ radarAquitaine=1;}//case cochée
           else {radarAquitaine=0;} //case décochée
      
        if(radarAquitaine==1){
            LoadAquitaineRadar();
            updateAquitaine();
          map.on("viewreset", updateChampagne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }

    
      if(radaAquitaineourgogne==0){
          aquitaineradar=null;
            svg.selectAll(".aquitaineradarlayer").remove()
        }
          });

      //-------------------------------------------------------------------------------------------------------------------------------------------
         $('#validcheckAquitaine').change(function() {
        visible["valid"]=this.checked;

            if(this.checked){ validAquitaine=1;}//case cochée
           else {validAquitaine=0;} //case décochée
      
        if(validAquitaine==1){
            LoadAquitaineValid();
            updateAquitaine();
          map.on("viewreset", updateChampagne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }

      if(validAquitaine==0){
          aquitainevalid=null;
            svg.selectAll(".aquitainevalidlayer").remove()
       }
      });
      //-------------------------------------------------------------------------------------------------------------------------------------------
       $('#habcheckAquitaine').change(function() {
        visible["hab"]=this.checked;

            if(this.checked){ habAquitaine=1;}//case cochée
           else {habAquitaine=0;} //case décochée
      
        if(habAquitaine==1){
            LoadAquitaineHabitations();
            updateAquitaine();
          map.on("viewreset", updateChampagne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }

      if(habAquitaine==0){
          aquitainehab=null;
            svg.selectAll(".aquitainehablayer").remove()
       }

      });
      //------------------------------------------------------------------------------------------------------------------------------------------
           $('#parccheckAquitaine').change(function() {
        visible["parc"]=this.checked;

            if(this.checked){ parcAquitaine=1;}//case cochée
           else {parcAquitaine=0;} //case décochée

       if(parcAquitaine==1){
            LoadAquitaineParc();
            updateAquitaine();
            map.on("viewreset", updateChampagne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP

        }
      
      if(parcAquitaine==0){
          aquitaineparc=null;
            svg.selectAll(".aquitaineparclayer").remove()
        }
      });
       
      //--------------------------------------------------------------------------------------------------------------------------------------
      $('#monucheckAquitaine').change(function() {
        visible["monu"]=this.checked;

            if(this.checked){ monuAquitaine=1;}//case cochée
           else {monuAquitaine=0;} //case décochée
      
       if(monuAquitaine==1){
            LoadAquitaineMonu();
            updateAquitaine();
            map.on("viewreset", updateChampagne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }
      
      if(monuAquitaine==0){
          aquitainemonu=null;
            svg.selectAll(".aquitainemonulayer").remove()
        }
      });
////////////////////////////////// FIN CASES A COCHER AQUITAINE /////////////////////////////////////////////////////////////////////////////////////////////


 

   ////Sélection des calques//////////////////////////    CORSE  //////////////////////////////////////////////////////////////////////////////////////////////
    
       $('#zeecheckCorse').change(function() {
        visible["zee"]=this.checked;

            if(this.checked){ zniefCorse=1;}//case cochée
           else {zniefCorse=0;} //case décochée
      
        if(zniefCorse==1){
            LoadCorseZee();
            updateCorse();
          map.on("viewreset", updateCorse); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }
      
      if(zniefCorse==0) {
          corsezee=null;
            svg.selectAll(".corsezeelayer").remove()
        }
      });

        //-----------------------------------------------------------------------------------------------------------------------------------------

         $('#bordercheckCorse').change(function() {
        visible["border"]=this.checked;

            if(this.checked){ borderCorse=1;}//case cochée
           else {borderCorse=0;} //case décochée
      
        if(borderCorse==1){
            LoadCorseBorder();
            //updateCorse();
          map.on("viewreset", updateCorse); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }
      
      if(borderCorse==0) {
          corseborder=null;
            svg.selectAll(".corseborderlayer").remove()
        }
      });

       //---------------------------------------------------------------------------------------------------------------------------------------
       $('#radarcheckCorse').change(function() {
        visible["radar"]=this.checked;

            if(this.checked){ radarCorse=1;}//case cochée
           else {radarCorse=0;} //case décochée
      
        if(radarCorse==1){
            LoadCorseRadar();
            updateCorse();
          map.on("viewreset", updateCorse); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }

    
      if(radarCorse==0){
          corseradar=null;
            svg.selectAll(".corseradarlayer").remove()
        }
          });

      //------------------------------------------------------------------------------------------------------------------------------------
       $('#dangercheckCorse').change(function() {
        visible["danger"]=this.checked;

            if(this.checked){ dangerCorse=1;}//case cochée
           else {dangerCorse=0;} //case décochée
      
        if(dangerCorse==1) {
            LoadCorseDanger();
            updateCorse();
          map.on("viewreset", updateCorse); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }

      if(dangerCorse==0){
          corsedanger=null;
            svg.selectAll(".corsedangerlayer").remove()
       }
      });

      //---------------------------------------------------------------------------------------------------------------------------------------
       $('#sourischeckCorse').change(function() {
        visible["souris"]=this.checked;

            if(this.checked){ sourisCorse=1;}//case cochée
           else {sourisCorse=0;} //case décochée
      
        if(sourisCorse==1){
            LoadCorseSouris();
            updateCorse();
          map.on("viewreset", updateCorse); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }

      if(sourisCorse==0){
         corsesouris=null;
            svg.selectAll(".corsechauvesourislayer").remove()
       }
      });
 //--------------------------------------------------------------------------------------------------------------------------------------------------------
  
    $('#monucheckCorse').change(function() {
        visible["monu"]=this.checked;

            if(this.checked){ monuCorse=1;}//case cochée
           else {monuCorse=0;} //case décochée
      
       if(monuCorse==1){
            LoadCorseMonu();
            updateCorse();
            map.on("viewreset", updateCorse); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }
      
      if(monuCorse==0){
          corsemonu=null;
            svg.selectAll(".corsemonulayer").remove()
        }
      });
////////////////////////////////// FIN CASES A COCHER CORSE ///////////////////////////////////////////////////////////////////////////////////////////// 


   ////Sélection des calques//////////////////////////    POITOU CHARENTES   //////////////////////////////////////////////////////////////////////////////////////////////
       
       $('#zeecheckPoitou').change(function() {
        visible["zee"]=this.checked;

            if(this.checked){ zniefPoitou=1;}//case cochée
           else {zniefPoitou=0;} //case décochée
      
        if(zniefPoitou==1){
            LoadPoitouZee();
            updatePoitou();
          map.on("viewreset", updatePoitou); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }
      
      if(zniefPoitou==0) {
          poitouzee=null;
            svg.selectAll(".poitouzeelayer").remove()
        }
      });

        //-----------------------------------------------------------------------------------------------------------------------------------------

         $('#bordercheckPoitou').change(function() {
        visible["border"]=this.checked;

            if(this.checked){ borderPoitou=1;}//case cochée
           else {borderPoitou=0;} //case décochée
      
        if(borderPoitou==1){
            LoadPoitouBorder();
            updatePoitou();
          map.on("viewreset", updatePoitou); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }
      
      if(borderPoitou==0) {
          poitouborder=null;
            svg.selectAll(".poitouborderlayer").remove()
        }
      });

       //---------------------------------------------------------------------------------------------------------------------------------------
       $('#radarcheckPoitou').change(function() {
        visible["radar"]=this.checked;

            if(this.checked){ radarPoitou=1;}//case cochée
           else {radarPoitou=0;} //case décochée
      
        if(radarPoitou==1){
            LoadPoitouRadar();
            updatePoitou();
          map.on("viewreset", updatePoitou); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }

    
      if(radarPoitou==0){
          poitouradar=null;
            svg.selectAll(".poitouradarlayer").remove()
        }
          });

      
      //-------------------------------------------------------------------------------------------------------------------------------------------
         $('#validcheckPoitou').change(function() {
        visible["valid"]=this.checked;

            if(this.checked){ validPoitou=1;}//case cochée
           else {validPoitou=0;} //case décochée
      
        if(validPoitou==1){
            LoadPoitouValid();
            updatePoitou();
          map.on("viewreset", updatePoitou); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }

      if(validPoitou==0){
          poitouvalid=null;
            svg.selectAll(".poitouvalidlayer").remove()
       }
      });
     
      //------------------------------------------------------------------------------------------------------------------------------------------
           $('#parccheckPoitou').change(function() {
        visible["parc"]=this.checked;

            if(this.checked){ parcPoitou=1;}//case cochée
           else {parcPoitou=0;} //case décochée

       if(parcPoitou==1){
            LoadPoitouParc();
            updatePoitou();
            map.on("viewreset", updatePoitou); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }
      
      if(parcPoitou==0){
          poitouparc=null;
            svg.selectAll(".poitouparclayer").remove()
        }
      });

      //-------------------------------------------------------------------------------------------------------------------------------------------------------

       $('#monucheckPoitou').change(function() {
        visible["monu"]=this.checked;

            if(this.checked){ monuPoitou=1;}//case cochée
           else {monuPoitou=0;} //case décochée
      
       if(monuPoitou==1){
            LoadPoitouMonu();
            updatePoitou();
            map.on("viewreset", updatePoitou); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP
        }
      
      if(monuPoitou==0){
          poitoumonu=null;
            svg.selectAll(".poitoumonulayer").remove()
        }
      });
      
////////////////////////////////// FIN CASES A COCHER POITOU CHARENTES /////////////////////////////////////////////////////////////////////////////////////////////
       //**************************************************************************************************************************
       ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

       ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      $('#all').change(function() {
        if(this.checked){
          d3.select(".layer").style("opacity",0.5);
        }else{
          d3.select(".layer").style("opacity",0);
        }
      });


      $('#onoffswitch').change(function() {
        if(this.checked){
          
        }else{
          //console.log(map);
        }
      });

  

   /* function passThru(d) {

        var e = d3.event;

        var prev = this.style.pointerEvents;
        this.style.pointerEvents = 'none';

        var el = document.elementFromPoint(d3.event.x, d3.event.y);

        var e2 = document.createEvent('MouseEvent');
        e2.initMouseEvent(e.type,e.bubbles,e.cancelable,e.view, e.detail,e.screenX,e.screenY,mouse.x,mouse.y,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget);

        el.dispatchEvent(e2);

        this.style.pointerEvents = prev;
    }*/
  

  function updateBourgogne() {
    $("#pointer").css({top:-100,left:0});
    //translation claque stations: 
   feature.attr("transform", function(d) { return "translate("+ map.latLngToLayerPoint(d.LatLng).x +","+ map.latLngToLayerPoint(d.LatLng).y +")";});
   //initialization zoom en fonction du zoom de la carte
   var zoom=0.818*Math.pow(2,map.getZoom()-8); //UTILISE SINON CALQUE PAS ADAPTE A LA DIMENSION DE LA CARTE !!!
   //points d'attache des calques
   var lon=48.7;
   var lat=2.58;
   var newCoord=map.latLngToLayerPoint(new L.LatLng(lon,lat));
   order="translate("+newCoord.x +","+newCoord.y +") scale("+zoom+") rotate(1)";
   d3.selectAll(".layer").attr("transform", function(d) { return order;});
  }

    function updateChampagne() {
   $("#pointer").css({top:-100,left:0});
    //translation claque stations: 
   feature.attr("transform", function(d) { return "translate("+ map.latLngToLayerPoint(d.LatLng).x +","+ map.latLngToLayerPoint(d.LatLng).y +")";});
   //initialization zoom en fonction du zoom de la carte
   var zoom=0.79*Math.pow(2,map.getZoom()-8);
   //points d'attache des calques
   var lon=50.35;
   var lat=0.44;
   var newCoord=map.latLngToLayerPoint(new L.LatLng(lon,lat));
   order="translate("+newCoord.x +","+newCoord.y +") scale("+zoom+") rotate(0)";
   d3.selectAll(".layer").attr("transform", function(d) { return order;});
  }

   function updateAquitaine() {
   $("#pointer").css({top:-100,left:0});
    //translation claque stations: 
   feature.attr("transform", function(d) { return "translate("+ map.latLngToLayerPoint(d.LatLng).x +","+ map.latLngToLayerPoint(d.LatLng).y +")";});
   //initialization zoom en fonction du zoom de la carte
    var zoom=1.07*Math.pow(2,map.getZoom()-8);
   //points d'attache des calques
   var lon=46.76;
   var lat=-6.27;
   var newCoord=map.latLngToLayerPoint(new L.LatLng(lon,lat));
   order="translate("+newCoord.x +","+newCoord.y +") scale("+zoom+") rotate(0)";
   d3.selectAll(".layer").attr("transform", function(d) { return order;});
  }

  function updateCorse() {
   $("#pointer").css({top:-100,left:0});
    //translation claque stations: 
   feature.attr("transform", function(d) { return "translate("+ map.latLngToLayerPoint(d.LatLng).x +","+ map.latLngToLayerPoint(d.LatLng).y +")";});
   //initialization zoom en fonction du zoom de la carte
   var zoom=0.435*Math.pow(2,map.getZoom()-8);
   //points d'attache des calques
   var lon=43.048;
   var lat=6.70;
   var newCoord=map.latLngToLayerPoint(new L.LatLng(lon,lat));
   order="translate("+newCoord.x +","+newCoord.y +") scale("+zoom+") rotate(0)";
   d3.selectAll(".layer").attr("transform", function(d) { return order;});
  }

  function updatePoitou() {
   $("#pointer").css({top:-100,left:0});
    //translation claque stations: 
   feature.attr("transform", function(d) { return "translate("+ map.latLngToLayerPoint(d.LatLng).x +","+ map.latLngToLayerPoint(d.LatLng).y +")";});
   //initialization zoom en fonction du zoom de la carte
   var zoom=0.620*Math.pow(2,map.getZoom()-8);
   //points d'attache des calques
   var lon=47.36;
   var lat=-3.12;
   var newCoord=map.latLngToLayerPoint(new L.LatLng(lon,lat));
   order="translate("+newCoord.x +","+newCoord.y +") scale("+zoom+") rotate(0)";
   d3.selectAll(".layer").attr("transform", function(d) { return order;});
  }


  function zoomHeight(mapScale,latitude,ppi){
    var MetersPerInch = 2.54 / 100;
    var EarthCircumference = 6378137 * Math.PI * 2;
    var realLengthInMeters = EarthCircumference * Math.cos(latitude* Math.PI / 180);
    var zoomLevelExp = (realLengthInMeters*ppi) / (256*MetersPerInch*mapScale);
    return Math.log(zoomLevelExp, 2);
  }
 }) 

  $(".close").click(function(){
    $("#intro").fadeOut(300);
  });

  var currentQuery;
  $("#search").keyup(function(e){
    var query=$("#terms").val();
    query.replace(/ */g,'+');
    console.log(query);
    coordonnes=[];
    $("#resultat").html("patientez...");
    if(currentQuery)currentQuery.abort();
    currentQuery=$.getJSON("http://nominatim.openstreetmap.org/search?q="+query+"&format=json&countrycodes=fr",function(json){
      console.log(json);
      var html="";
      $.each(json,function(key){
        var val= json[key];
        html+='<a href="#" class="destination" id='+key+'>'+val.display_name+'</a><br/>';
        coordonnes[key]={"lat":val.boundingbox[0],"lat2":val.boundingbox[1],"lon":val.boundingbox[2],"lon2":val.boundingbox[3]};
      });
      $("#resultat").html(html);
    });
  });

  $("#resultat").on("click",".destination",function(){
    var id=$(this).prop('id');

    console.log(coordonnes[id]);
    var co=coordonnes[id];
    /*map.fitBounds([
      [parseInt(co["lat"]), parseInt(co["lon"])]
      [parseInt(co["lat2"]), parseInt(co["lon2"])]
    ]);*/
    map.setView([co["lat"],co["lon"]]);
  });
  
  ////// REGLER HISTOIRE REDUIRE/ AGRANDIR FENETRE POUR LES REGIONS //////////////////////////////////////////////////////////////////////////////////////////
 
    map.on('click', function(e) {
    majWeibull(e.latlng.lat, e.latlng.lng);
    majRoseDesVents(e.latlng.lat, e.latlng.lng);
    });
    
    
    $("#map").on('mouseover', function(e) {
      $("#pointer").css({top:-100,left:0});
      $("#alert").css({top:-100,left:0});
    });
 
    map.on('mousemove', function(e){ 
      $("#coord").html("Longitude: "+e.latlng.lat.toFixed(4)+" <br/>Latitude: "+e.latlng.lng.toFixed(4));
       mouse.x = e.containerPoint.x;
       mouse.y = e.containerPoint.y;
    }, false);

  

  