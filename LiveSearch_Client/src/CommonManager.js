import {URL, PATHES} from './environment'

export const  manageLogin = () => {

    var body = document.getElementById('allLive');
   var login = document.getElementById("loginWindow");
   if(login) {
       login.className = "loginWindow";
    }

     var icons = document.querySelectorAll(".entity");

    for(var i=0;i<icons.length;i++) {
        icons[i].className = "entityDis";
    }

    if(body) {
        body.addEventListener("click", 
        hideLogin, false);
    }
}


export const  manageLiveSearchLogin = () => {

    
   var login = document.getElementById("loginLivesearch");
   if(login) {
       login.className = "loginWindow";
    }

     var icons = document.querySelectorAll(".entity");

    for(var i=0;i<icons.length;i++) {
        icons[i].className = "entityDis";
    }

}

export const hideLiveSearchLogin = () => {

    var icons = document.querySelectorAll(".entityDis");

    for(var i=0;i<icons.length;i++) {
        icons[i].className = "entity";
    }

    var login = document.getElementById("loginLivesearch");
    if(login) {
        login.className = "disable";
    }
}



export const  removeHiding = () => {

    var body = document.getElementById('allLive');
   
    if(body) {
        body.removeEventListener("click", 
        hideLogin, false);
    }
}

export const hideLogin = () => {

    var icons = document.querySelectorAll(".entityDis");

    for(var i=0;i<icons.length;i++) {
        icons[i].className = "entity";
    }

    var login = document.getElementById("loginWindow");
    if(login) {
        login.className = "disable";
    }
    removeHiding();
}



export const bottomIcon = (id, top_) => {
    var entity = document.getElementById(id);

    if(entity) {

        var top = entity.style.top;
        if(top.includes("px")) {
            var topH = ((parseFloat(top) / document.documentElement.clientHeight) * 100);
            if(topH > 80) {
                return true;
            }
        }
        else {
            if(parseFloat(top) > 80) {
                return true;
            }
        }
    }
    else {
        if(parseFloat(top_) > 80) {
            return true;
        }
    }

    return false;
}




export const getQuarter = (id, _left, _top) => {
    var entity = document.getElementById(id);
    var top = parseFloat(_top);
    var left = parseFloat(_left);
    
    var quarter = 1;
    
    if(entity) {
        var top_ = entity.style.top;
        var left_ = entity.style.left;
        if(top_.includes("px")) {
            top = ((parseFloat(top_) / document.documentElement.clientHeight) * 100); 
            left = ((parseFloat(left_) / document.documentElement.clientWidth) * 100); 
        }
    }
    if(left<=50 && top<=50) {
       
        quarter = 1;
    }
    if(left>=50 && top<=50) {
        
        quarter = 2;
    }
    if(left>=50 && top>=50) {
       
        quarter = 3;
    }
    if(left<=50 && top>=50) {
      
        quarter = 4;
     }
     //console.log("positions:" + top + "   " + left);
   return quarter;
}


export const getIconFromUrl = (url) => {

    var search = new URLSearchParams(url);

    var iconId= search.get("iconId");
    var iconType= search.get("iconType");
    var iconTitle= search.get("iconTitle");
    var iconTags= search.get("iconTags");
    var iconLeft= search.get("iconLeft");
    var iconTop= search.get("iconTop");
    var tagsArr = [];
    if(iconTags !== null) {
         tagsArr = iconTags.split(',');
    }


    var icon = [{
        id: unescape(iconId),
        left: iconLeft,
        tags: tagsArr,
        title: unescape(iconTitle),
        top: iconTop,
        type: iconType,
        source: iconId
    }]

    return icon;
}

export const getUrlByIcon = (icon) => {
   var url = PATHES.live + PATHES.explore;

   if(icon) {
    var query = "?iconId=" + escape(icon.id) +
    "&iconTitle="+escape(icon.title) + 
    "&iconTop="+icon.top + 
    "&iconLeft="+icon.left + 
    "&iconType=" + icon.type +
    "&iconTags="+ escape(icon.tags)

    url = url + query;
   }

   return url;
}


