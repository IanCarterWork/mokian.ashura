
const MokianPolyfill = {version:'0.0.1'};

String.prototype.matchAll = function(r){
    let a = [], m;

    while((m = r.exec(this)) !== null) { a[a.length] = m; }

    return a;
};


export default MokianPolyfill;