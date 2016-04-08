
  
  var coordonnes=[], //coord lat lon des recherches
  feature, //data postes 
  svg; //��l��ments svg 
  var mouse = {x: 0, y: 0};
  var bourgogne=0;
  var champagne=0;

  var znief=0;
  var postes=0;
  var danger=0;
  var radar=0;
  var souris=0;
  var hab=0;
  var parc=0;
  var tri=0;
  var monu=0;

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
 d3.json("http://localhost/EolAtlas-master/eol/fics_php/dataStations.php", function(collection) {
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
   }

    function LoadBourgogneMonu(){ alert("Nous n'avons aucune information concernant ce calque") 
    document.getElementById("monucheck").checked = false;
    ;}
//"Sélection" des calques
//-----------------------------------------------------------------------------------------------------------------------
     //Si on déselectionne la région, tous les calques disparaissent!!!
       $('#bourgognecheck').change(function() {
        visible["bourgogneborder"]=this.checked;
        if(this.checked){
            bourgogne=1;}//case cochée

        else {bourgogne=0;} //case décochée

        if((bourgogne==1) && (champagne==0)){ 
            LoadBourgogneBorder();
            updateBourgogne();
              //event listenner pour zoom scroll
   map.on("viewreset", updateBourgogne); //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP 
        }

        if ((bourgogne==0) && (champagne==0)){
            bourgogneborder=null;
            svg.selectAll(".bourgogneborderlayer").remove()
            // si on décoche border --> tous les calques de la région doivent disparaître
            document.getElementById("postescheck").checked = false;
            bourgogneback=null;
            svg.selectAll(".bourgognebacklayer").remove()
      
            document.getElementById("zeecheck").checked = false;
            bourgognezee=null;
            svg.selectAll(".bourgognezeelayer").remove()

            document.getElementById("tricheck").checked = false;
            bourgognetri=null;
            svg.selectAll(".bourgognetrilayer").remove()

            document.getElementById("habcheck").checked = false;
            bourgognehab=null;
            svg.selectAll(".bourgognehablayer").remove()

            document.getElementById("parccheck").checked = false;
            bourgogneparc=null;
            svg.selectAll(".bourgogneparclayer").remove()

            document.getElementById("dangercheck").checked = false;
            bourgognedanger=null;
            svg.selectAll(".bourgognedangerlayer").remove()

            document.getElementById("radarcheck").checked = false;
            bourgogneradar=null;
            svg.selectAll(".bourgogneradarlayer").remove()

            document.getElementById("sourischeck").checked = false;
            bourgognechauvesouris=null;
            svg.selectAll(".bourgognechauvesourislayer").remove()

            document.getElementById("validcheck").checked = false;
            bourgognevalid=null;
            svg.selectAll(".bourgognevalidlayer").remove()

            document.getElementById("monucheck").checked = false;
            bourgognemonu=null;
            svg.selectAll(".bourgognemonulayer").remove()
        }
      
           if((bourgogne==1) && (champagne==1))
            {alert("Vous ne pouvez sélectionner qu'une seule région à la fois");}
          });
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

    function LoadChampagneHabitations(){ alert("Nous n'avons aucune information concernant ce calque");
    document.getElementById("habcheck").checked = false;}
    
    function LoadChampagneParc(){ alert("Nous n'avons aucune information concernant ce calque");
    document.getElementById("parccheck").checked = false;}
    
    function LoadChampagneTri(){ alert("Nous n'avons aucune information concernant ce calque");
    document.getElementById("tricheck").checked = false;}

    function LoadChampagnePostes(){ alert("Nous n'avons aucune information concernant ce calque");
    document.getElementById("postescheck").checked = false;}

    function LoadChampagneValid(){ alert("Nous n'avons aucune information concernant ce calque");
    document.getElementById("validcheck").checked = false;}
   ////Sélection des calques
  //toggle selection calque-----------------------------------------------------------------------------------------------------------------------
       
     //1cas: On choisit d'abord la région puis on choisit le calque, sinon les calques ne s'affichent pas !!!
      //Sélection des calques suivant la région---------------------------------------------------------------------------------------------------------
      $('#champagnecheck').change(function() {
        visible["champagneborder"]=this.checked;
        if(this.checked){
            champagne=1;}//case cochée

        else {champagne=0;} //case décochée

        if((champagne==1) && (bourgogne==0)){ 
            LoadChampagneBorder();
            updateChampagne();
      //event listenner pour zoom scroll

   map.on("viewreset", updateChampagne);   //UTILE SINON LE ZOOM NE S'AFFECTE QU'AUX CALQUES ET STATION METEO MAIS PAS A LA MAP 

        }

        if ((champagne==0) && (bourgogne==0)){
            champagneborder=null;
            svg.selectAll(".champagneborderlayer").remove()
            // si on décoche border --> tous les calques de la région doivent disparaît
            document.getElementById("zeecheck").checked = false;
            champagnezee=null;
            svg.selectAll(".champagnezeelayer").remove()

            document.getElementById("dangercheck").checked = false;
            champagnedanger=null;
            svg.selectAll(".champagnedangerlayer").remove()

            document.getElementById("radarcheck").checked = false;
            champagneradar=null;
            svg.selectAll(".champagneradarlayer").remove()

            document.getElementById("sourischeck").checked = false;
            champagnechauvesouris=null;
            svg.selectAll(".champagnechauvesourislayer").remove()

            document.getElementById("validcheck").checked = false;
            champagnevalid=null;
            svg.selectAll(".champagnevalidlayer").remove()

            document.getElementById("monucheck").checked = false;
            champagnemonu=null;
            svg.selectAll(".champagnemonulayer").remove()
        }
      
           if((champagne==1) && (bourgogne==1))
            {alert("Vous ne pouvez sélectionner qu'une seule région à la fois");
          }
          });
        
      //-------------------------------------------------------------------------------------------------------------------------------
       $('#zeecheck').change(function() {
        visible["zee"]=this.checked;

            if(this.checked){ znief=1;}//case cochée
           else {znief=0;} //case décochée
      
        if((znief==1) && (champagne==1) && (bourgogne==0)){
            LoadChampagneZee();
            updateChampagne();}

       if((znief==1) && (champagne==0) && (bourgogne==1)){
            LoadBourgogneZee();
            updateBourgogne();
        }
      
      if((znief==0) &&(champagne==1) && (bourgogne==0)){
          champagnezee=null;
            svg.selectAll(".champagnezeelayer").remove()
        }

      if((znief==0) &&(champagne==0) && (bourgogne==1)){
          bourgognezee=null;
            svg.selectAll(".bourgognezeelayer").remove()
        }
      });

      $('#zeecheck').change(function() {  
        visible["zee"]=this.checked;
        if(this.checked&& (champagne==0) &&(bourgogne==0)){
            alert("Veuillez sélectionner d'abord une région");
            document.getElementById("zeecheck").checked = false;
        }
      });
        //-----------------------------------------------------------------------------------------------------------------------------------------
      $('#postescheck').change(function() {
        visible["postes"]=this.checked;

            if(this.checked){ postes=1;}//case cochée
           else {postes=0;} //case décochée
      
        if((postes==1) && (champagne==1) && (bourgogne==0)){
            LoadChampagnePostes();
            updateChampagne();}

       if((postes==1) && (champagne==0) && (bourgogne==1)){
            LoadBourgognePostes();
            updateBourgogne();
        }
      
      if((postes==0) &&(champagne==1) && (bourgogne==0)){
          champagneback=null;
            svg.selectAll(".champagnebacklayer").remove()
        }

      if((postes==0) &&(champagne==0) && (bourgogne==1)){
          bourgogneback=null;
            svg.selectAll(".bourgognebacklayer").remove()
        }
      });

      $('#postescheck').change(function() {  
        visible["postes"]=this.checked;
        if(this.checked&& (champagne==0) &&(bourgogne==0)){
            alert("Veuillez sélectionner d'abord une région");
            document.getElementById("postescheck").checked = false;
        }
      });
       
       //---------------------------------------------------------------------------------------------------------------------------------------
       $('#radarcheck').change(function() {
        visible["radar"]=this.checked;

            if(this.checked){ radar=1;}//case cochée
           else {radar=0;} //case décochée
      
        if((radar==1) && (champagne==1) && (bourgogne==0)){
            LoadChampagneRadar();
            updateChampagne();}

       if((radar==1) && (champagne==0) && (bourgogne==1)){
            LoadBourgogneRadar();
            updateBourgogne();
        }
      
      if((radar==0) &&(champagne==1) && (bourgogne==0)){
          champagneradar=null;
            svg.selectAll(".champagneradarlayer").remove()
        }

      if((radar==0) &&(champagne==0) && (bourgogne==1)){
          bourgogneradar=null;
            svg.selectAll(".bourgogneradarlayer").remove()
        }
      });

      $('#radarcheck').change(function() {  
        visible["radar"]=this.checked;
        if(this.checked&& (champagne==0) &&(bourgogne==0)){
            alert("Veuillez sélectionner d'abord une région");
            document.getElementById("radarcheck").checked = false;
        }
      });

      //------------------------------------------------------------------------------------------------------------------------------------
       $('#dangercheck').change(function() {
        visible["danger"]=this.checked;

            if(this.checked){ danger=1;}//case cochée
           else {danger=0;} //case décochée
      
        if((danger==1) && (champagne==1) && (bourgogne==0)){
            LoadChampagneDanger();
            updateChampagne();}

       if((danger==1) && (champagne==0) && (bourgogne==1)){
            LoadBourgogneDanger();
            updateBourgogne();
        }
      
      if((danger==0) &&(champagne==1) && (bourgogne==0)){
          champagnedanger=null;
            svg.selectAll(".champagnedangerlayer").remove()
       }

      if((danger==0) &&(champagne==0) && (bourgogne==1)){
          bourgognedanger=null;
            svg.selectAll(".bourgognedangerlayer").remove()
        }
      });

      $('#dangercheck').change(function() {  
        visible["danger"]=this.checked;
        if(this.checked&& (champagne==0) &&(bourgogne==0)){
            alert("Veuillez sélectionner d'abord une région");
            document.getElementById("dangercheck").checked = false;
        }
      });
      //---------------------------------------------------------------------------------------------------------------------------------------
       $('#sourischeck').change(function() {
        visible["souris"]=this.checked;

            if(this.checked){ souris=1;}//case cochée
           else {souris=0;} //case décochée
      
        if((souris==1) && (champagne==1) && (bourgogne==0)){
            LoadChampagneSouris();
            updateChampagne();}

       if((souris==1) && (champagne==0) && (bourgogne==1)){
            LoadBourgogneSouris();
            updateBourgogne();
        }
      
      if((souris==0) &&(champagne==1) && (bourgogne==0)){
          champagnesouris=null;
            svg.selectAll(".champagnechauvesourislayer").remove()
       }

      if((souris==0) &&(champagne==0) && (bourgogne==1)){
          bourgognesouris=null;
            svg.selectAll(".bourgognechauvesourislayer").remove()
        }
      });

      $('#sourischeck').change(function() {  
        visible["souris"]=this.checked;
        if(this.checked&& (champagne==0) &&(bourgogne==0)){
            alert("Veuillez sélectionner d'abord une région");
            document.getElementById("sourischeck").checked = false;
        }
      });
      //-------------------------------------------------------------------------------------------------------------------------------------------
         $('#validcheck').change(function() {
        visible["valid"]=this.checked;

            if(this.checked){ valid=1;}//case cochée
           else {valid=0;} //case décochée
      
        if((valid==1) && (champagne==1) && (bourgogne==0)){
            LoadChampagneValid();
            updateChampagne();}

       if((valid==1) && (champagne==0) && (bourgogne==1)){
            LoadBourgogneValid();
            updateBourgogne();
        }
      
      if((valid==0) &&(champagne==1) && (bourgogne==0)){
          champagnevalid=null;
            svg.selectAll(".champagnevalidlayer").remove()
       }

      if((valid==0) &&(champagne==0) && (bourgogne==1)){
          bourgognevalid=null;
            svg.selectAll(".bourgognevalidlayer").remove()
        }
      });

      $('#validcheck').change(function() {  
        visible["valid"]=this.checked;
        if(this.checked&& (champagne==0) &&(bourgogne==0)){
            alert("Veuillez sélectionner d'abord une région");
            document.getElementById("validcheck").checked = false;
        }
      });
      //-------------------------------------------------------------------------------------------------------------------------------------------
       $('#habcheck').change(function() {
        visible["hab"]=this.checked;

            if(this.checked){ hab=1;}//case cochée
           else {hab=0;} //case décochée
      
        if((hab==1) && (champagne==1) && (bourgogne==0)){
            LoadChampagneHabitations();
            updateChampagne();}

       if((hab==1) && (champagne==0) && (bourgogne==1)){
            LoadBourgogneHabitations();
            updateBourgogne();
        }
      
      if((hab==0) &&(champagne==1) && (bourgogne==0)){
          champagnehab=null;
            svg.selectAll(".champagnehablayer").remove()
       }

      if((hab==0) &&(champagne==0) && (bourgogne==1)){
          bourgognehab=null;
            svg.selectAll(".bourgognehablayer").remove()
        }
      });

      $('#habcheck').change(function() {  
        visible["hab"]=this.checked;
        if(this.checked&& (champagne==0) &&(bourgogne==0)){
            alert("Veuillez sélectionner d'abord une région");
            document.getElementById("habcheck").checked = false;
        }
      });
      //------------------------------------------------------------------------------------------------------------------------------------------
           $('#parccheck').change(function() {
        visible["parc"]=this.checked;

            if(this.checked){ parc=1;}//case cochée
           else {parc=0;} //case décochée
      
        if((parc==1) && (champagne==1) && (bourgogne==0)){
            LoadChampagneParc();
            updateChampagne();}

       if((parc==1) && (champagne==0) && (bourgogne==1)){
            LoadBourgogneParc();
            updateBourgogne();
        }
      
      if((parc==0) &&(champagne==1) && (bourgogne==0)){
          champagneparc=null;
            svg.selectAll(".champagneparclayer").remove()
       }

      if((parc==0) &&(champagne==0) && (bourgogne==1)){
          bourgogneparc=null;
            svg.selectAll(".bourgogneparclayer").remove()
        }
      });

      $('#parccheck').change(function() {  
        visible["parc"]=this.checked;
        if(this.checked&& (champagne==0) &&(bourgogne==0)){
            alert("Veuillez sélectionner d'abord une région");
            document.getElementById("parccheck").checked = false;
        }
      });

       //-----------------------------------------------------------------------------------------------------------------------------------------
        $('#tricheck').change(function() {
        visible["tri"]=this.checked;

            if(this.checked){ tri=1;}//case cochée
           else {tri=0;} //case décochée
      
        if((tri==1) && (champagne==1) && (bourgogne==0)){
            LoadChampagneTri();
            updateChampagne();}

       if((tri==1) && (champagne==0) && (bourgogne==1)){
            LoadBourgogneTri();
            updateBourgogne();
        }
      
      if((tri==0) &&(champagne==1) && (bourgogne==0)){
          champagnetri=null;
            svg.selectAll(".champagnetrilayer").remove()
       }

      if((tri==0) &&(champagne==0) && (bourgogne==1)){
          bourgognetri=null;
            svg.selectAll(".bourgognetrilayer").remove()
        }
      });

      $('#tricheck').change(function() {  
        visible["tri"]=this.checked;
        if(this.checked&& (champagne==0) &&(bourgogne==0)){
            alert("Veuillez sélectionner d'abord une région");
            document.getElementById("tricheck").checked = false;
        }
      });

      //--------------------------------------------------------------------------------------------------------------------------------------
      $('#monucheck').change(function() {
        visible["monu"]=this.checked;

            if(this.checked){ monu=1;}//case cochée
           else {monu=0;} //case décochée
      
        if((monu==1) && (champagne==1) && (bourgogne==0)){
            LoadChampagneMonu();
            updateChampagne();}

       if((monu==1) && (champagne==0) && (bourgogne==1)){
            LoadBourgogneMonu();
            updateBourgogne();
        }
      
      if((monu==0) &&(champagne==1) && (bourgogne==0)){
          champagnemonu=null;
            svg.selectAll(".champagnemonulayer").remove()
       }

      if((monu==0) &&(champagne==0) && (bourgogne==1)){
          bourgognemonu=null;
            svg.selectAll(".bourgognemonulayer").remove()
        }
      });

      $('#monucheck').change(function() {  
        visible["monu"]=this.checked;
        if(this.checked&& (champagne==0) &&(bourgogne==0)){
            alert("Veuillez sélectionner d'abord une région");
            document.getElementById("monucheck").checked = false;
        }
      });

       //**************************************************************************************************************************
       ////////////////////////////////////////////////ON NE PEUT SELECTIONNER QU UNE SEULE REGION A LA FOIS//////////////////////////





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
   var lon=50.15;
   var lat=0.29;
   var newCoord=map.latLngToLayerPoint(new L.LatLng(lon,lat));
   order="translate("+newCoord.x +","+newCoord.y +") scale("+zoom+") rotate(1)";
   d3.selectAll(".layer").attr("transform", function(d) { return order;});
  }

    function updateChampagne() {
   $("#pointer").css({top:-100,left:0});
    //translation claque stations: 
   feature.attr("transform", function(d) { return "translate("+ map.latLngToLayerPoint(d.LatLng).x +","+ map.latLngToLayerPoint(d.LatLng).y +")";});
   //initialization zoom en fonction du zoom de la carte
   var zoom=1.11*Math.pow(2,map.getZoom()-8);
   //points d'attache des calques
   var lon=46.802;
   var lat=-6.42;
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
  

 
    map.on('click', function(e) {
    majWeibull(e.latlng.lat, e.latlng.lng);
    majRoseDesVents(e.latlng.lat, e.latlng.lng);
    });
    
    
    $("#map").on('mouseover', function(e) {
      $("#pointer").css({top:-100,left:0});
      $("#alert").css({top:-100,left:0});
    });
 
    map.on('mousemove', function(e){ 
      $("#coord").html("Latitude: "+e.latlng.lat.toFixed(4)+" <br/>Longitude: "+e.latlng.lng.toFixed(4));
       mouse.x = e.containerPoint.x;
       mouse.y = e.containerPoint.y;
    }, false);

  
    
  