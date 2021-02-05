import { MokianNavigation } from "./navigation.js";


window.MokianRequest = {};

MokianRequest.Get = function(k){

    const p = MokianNavigation.ParseURI(location.href);

    return p.queryObject[k]||'';
    
};



export default MokianRequest;