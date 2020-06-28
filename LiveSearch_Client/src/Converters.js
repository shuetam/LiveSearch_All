export const parseBool = (value) => {
    if(value == 'true') {
        return true;
    }
    if(value == 'false') {
        return false;
    }
    return false;
}

export const leftToVw = (leftEl) => {

    if(leftEl.includes("vw")) {
        return leftEl;
    }

    var leftFlo = (parseFloat(leftEl) / document.documentElement.clientWidth) * 100;
    if(leftFlo>99) {
        leftFlo = 90;
    }
    var left = leftFlo + "vw";
    return left;
}

export const topToVh = (topEl) => {
    if(topEl.includes("vh")) {
        return topEl;
    }
   
    var topFlo = (parseFloat(topEl) / document.documentElement.clientHeight) * 100;
    if(topFlo>99) {
        topFlo = 90;
    }

    var top = topFlo +"vh";
    return top;
}

