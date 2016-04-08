function show_appropriate_form()
{
    var selectedbourgogne=0;
    var selectedchampagne=0;
    var selectedaquitaine=0;
    var selectedcorse=0;
    var selectedpoitou=0;

	var cach= document.getElementById("select_region");
	var div=document.getElementById("couches");

	var option= cach.value;
   
	if(cach.value == "Bourgogne")
         {
         	selectedbourgogne=1;}
 
    else if(cach.value == "Champagne")
    	{ selectedchampagne=1;}

    else if(cach.value == "Aquitaine")
    	{ selectedaquitaine=1;}

    else if(cach.value=="Corse")
        { selectedcorse=1;}

    else if(cach.value=="Poitou-Charentes")
        { selectedpoitou=1;}

    if((selectedbourgogne==1)||(selectedchampagne==1)||(selectedaquitaine==1)||(selectedcorse==1)||(selectedpoitou==1))
    	{ 
            div.className="";
    	 }
    else 
    {
           div.className="hide";
    }
   
    if(selectedbourgogne==1){
    //alert("Bourgogne");
    var formbourgogne= document.getElementById("myform_bourgogne");
    formbourgogne.className="";

    }

    //else {
     if(selectedbourgogne==0){
    var formbourgogne= document.getElementById("myform_bourgogne");
    formbourgogne.className="hide";
    //si on délselectionne région tous les calques de celle-ci disparaît !!
     document.getElementById("bordercheckBourgogne").checked = false;
     bourgogneborder=null;
    svg.selectAll(".bourgogneborderlayer").remove()
     // si on décoche border --> tous les calques de la région doivent disparaître

            // si on décoche border --> tous les calques de la région doivent disparaître
            document.getElementById("postescheckBourgogne").checked = false;
            bourgogneback=null;
            svg.selectAll(".bourgognebacklayer").remove()
      
            document.getElementById("zeecheckBourgogne").checked = false;
            bourgognezee=null;
            svg.selectAll(".bourgognezeelayer").remove()

            document.getElementById("tricheckBourgogne").checked = false;
            bourgognetri=null;
            svg.selectAll(".bourgognetrilayer").remove()

            document.getElementById("habcheckBourgogne").checked = false;
            bourgognehab=null;
            svg.selectAll(".bourgognehablayer").remove()

            document.getElementById("parccheckBourgogne").checked = false;
            bourgogneparc=null;
            svg.selectAll(".bourgogneparclayer").remove()

            document.getElementById("dangercheckBourgogne").checked = false;
            bourgognedanger=null;
            svg.selectAll(".bourgognedangerlayer").remove()

            document.getElementById("radarcheckBourgogne").checked = false;
            bourgogneradar=null;
            svg.selectAll(".bourgogneradarlayer").remove()

            document.getElementById("sourischeckBourgogne").checked = false;
            bourgognechauvesouris=null;
            svg.selectAll(".bourgognechauvesourislayer").remove()

            document.getElementById("validcheckBourgogne").checked = false;
            bourgognevalid=null;
            svg.selectAll(".bourgognevalidlayer").remove()

        }
     

     if(selectedchampagne==1){
    //alert("Champagne");
    var formchampagne= document.getElementById("myform_champagne");
    formchampagne.className="";}

    //else {
    if(selectedchampagne==0){
    var formchampagne= document.getElementById("myform_champagne");
    formchampagne.className="hide";
   //si on délselectionne région tous les calques de celle-ci disparaît !!
     document.getElementById("bordercheckChampagne").checked = false;
     champagneborder=null;
    svg.selectAll(".champagneborderlayer").remove()
     // si on décoche border --> tous les calques de la région doivent disparaître

            // si on décoche border --> tous les calques de la région doivent disparaître
         
            document.getElementById("zeecheckChampagne").checked = false;
            champagnezee=null;
            svg.selectAll(".champagnezeelayer").remove()

            document.getElementById("dangercheckChampagne").checked = false;
            champagnedanger=null;
            svg.selectAll(".champagnedangerlayer").remove()

            document.getElementById("radarcheckChampagne").checked = false;
            champagneradar=null;
            svg.selectAll(".champagneradarlayer").remove()

            document.getElementById("sourischeckChampagne").checked = false;
            champagnechauvesouris=null;
            svg.selectAll(".champagnechauvesourislayer").remove()

            document.getElementById("monucheckChampagne").checked = false;
            champagnemonu=null;
            svg.selectAll(".champagnemonulayer").remove()
        
    }

     if(selectedaquitaine==1){
    //alert("Aquitaine");
    var formaquitaine= document.getElementById("myform_aquitaine");
    formaquitaine.className="";}

    //else {
    if(selectedaquitaine==0){
    var formaquitaine= document.getElementById("myform_aquitaine");
    formaquitaine.className="hide";

    document.getElementById("bordercheckAquitaine").checked = false;
     aquitaineborder=null;
    svg.selectAll(".aquitaineborderlayer").remove()
     // si on décoche border --> tous les calques de la région doivent disparaître

            // si on décoche border --> tous les calques de la région doivent disparaître
            document.getElementById("habcheckAquitaine").checked = false;
            aquitainehab=null;
            svg.selectAll(".aquitainehablayer").remove()

            document.getElementById("parccheckAquitaine").checked = false;
            aquitaineparc=null;
            svg.selectAll(".aquitaineparclayer").remove()

            document.getElementById("radarcheckAquitaine").checked = false;
            aquitaineradar=null;
            svg.selectAll(".aquitaineradarlayer").remove()

            document.getElementById("validcheckAquitaine").checked = false;
            aquitainevalid=null;
            svg.selectAll(".aquitainevalidlayer").remove()

            document.getElementById("monucheckAquitaine").checked = false;
            aquitainemonu=null;
            svg.selectAll(".aquitainemonulayer").remove()
    }

     if(selectedcorse==1){
    //alert("Corse");
    var formcorse= document.getElementById("myform_corse");
    formcorse.className="";}

    //else {
    if(selectedcorse==0){
    var formcorse= document.getElementById("myform_corse");
    formcorse.className="hide";
    //si on délselectionne région tous les calques de celle-ci disparaît !!
     document.getElementById("bordercheckCorse").checked = false;
     corseborder=null;
    svg.selectAll(".corseborderlayer").remove()
     // si on décoche border --> tous les calques de la région doivent disparaître

            // si on décoche border --> tous les calques de la région doivent disparaître
            document.getElementById("zeecheckCorse").checked = false;
            corsezee=null;
            svg.selectAll(".corsezeelayer").remove()

            document.getElementById("dangercheckCorse").checked = false;
            corsedanger=null;
            svg.selectAll(".corsedangerlayer").remove()

            document.getElementById("radarcheckCorse").checked = false;
            corseradar=null;
            svg.selectAll(".corseradarlayer").remove()

            document.getElementById("sourischeckCorse").checked = false;
            corsechauvesouris=null;
            svg.selectAll(".corsechauvesourislayer").remove()

            document.getElementById("monucheckCorse").checked = false;
            corsemonu=null;
            svg.selectAll(".corsemonulayer").remove()
    }

    if(selectedpoitou==1){
    //alert("Poitou-Charentes");
    var formpoitou= document.getElementById("myform_poitou");
    formpoitou.className="";}

    //else {
    if(selectedpoitou==0){
    var formpoitou= document.getElementById("myform_poitou");
    formpoitou.className="hide";
    //si on délselectionne région tous les calques de celle-ci disparaît !!
     document.getElementById("bordercheckPoitou").checked = false;
     poitouborder=null;
    svg.selectAll(".poitouborderlayer").remove()
            // si on décoche border --> tous les calques de la région doivent disparaître
            document.getElementById("zeecheckPoitou").checked = false;
            poitouzee=null;
            svg.selectAll(".poitouzeelayer").remove()

            document.getElementById("parccheckPoitou").checked = false;
            poitouparc=null;
            svg.selectAll(".poitouparclayer").remove()

            document.getElementById("radarcheckPoitou").checked = false;
            poitouradar=null;
            svg.selectAll(".poitouradarlayer").remove()

            document.getElementById("validcheckPoitou").checked = false;
            poitouvalid=null;
            svg.selectAll(".poitouvalidlayer").remove()

            document.getElementById("monucheckPoitou").checked = false;
            poitoumonu=null;
            svg.selectAll(".poitoumonulayer").remove()
    }
}

 
 function show(){

var cach= document.getElementById("presentation") ;//cach récupère contenu de see

if(cach.className == "hide")  //si cach est invisible alors il redevient visible

cach.className ="";

else cach.className = "hide";//sinon il devient invisible
 }