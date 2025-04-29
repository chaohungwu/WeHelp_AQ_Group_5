function addScript(url){
    let script_dom = document.createElement("script");
    script_dom.defer = true;
    script_dom.setAttribute("src",url);
    document.querySelector('head').appendChild(script_dom);
}

addScript("./static/js/wu_test.js")