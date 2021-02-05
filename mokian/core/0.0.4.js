'use strict';

import $Settings from "../settings/index.js";
import { MokianNavigation } from "../overlays/navigation.js";
import MokianPolyfill from "../polyfill.js";
import MokianHooks from "../overlays/hooks.js";



/**
 * Objet Mokian
 */
let Mok = {

    Core:{ Source:'mokian/' }

    ,Style:{}

    ,Overlay:{Created:[]}

    ,Actions:{Entries:{},Using:{}}

    ,Take: function(s,o=null){ return (o||document).querySelector(s); }

    ,Takes: function(s,o=null){ return (o||document).querySelectorAll(s); }

};


Mok.Core.Dater = {};

Mok.Core.Dater.Get = function(_){

    let d = new Date(_);

    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();

};


/**
 * Atouts
 */

Mok.Core.Asset = {

    Get: function(uri,data=null){

        return new Promise((resolve, reject) => {
            
            const xhr = new XMLHttpRequest();

            xhr.open("GET", `${$Settings['Http:Host']||'./'}${Mok.Core.Source||''}${uri}`);
            
            xhr.setRequestHeader('X-REQUESTED-WITH', 'GGN:Mokian / Navigation');

            xhr.onload = () => {
                
                MokianHooks.Static.Dispatch('Asset:Load:Success', [{Target:xhr}]);

                resolve(xhr);

            }
            
            xhr.onerror = () => {
                
                MokianHooks.Static.Dispatch('Asset:Load:Error', [{Target:xhr}]);

                reject(xhr);
            
            }
            
            MokianHooks.Static.Dispatch('Asset:Load:Incoming', [{Target:xhr}]);

            xhr.send(data||null);


        });


    }

    , Path: function(dir = null, path, version = null){

        return `${dir||''}/${path}${typeof version=='string'?`-${version}`:''}`;
        
    }
    
    , Style: function(path, version){

        let uri = `${this.Path('styles', path, version||null)}.css`;

        let exist = document.querySelector(`style[Mokian\\:Style\\:URI="${uri}"]`);

        if(!exist){
            
            let get = this.Get(uri).then((xhr)=>{

                if(xhr.status==200||xhr.status==0){

                    // if('MokianMesa' in window){
                        
                    //     MokianMesa.AddToCache(xhr.responseURL);

                    // }


                    let e = document.createElement('style');

                    e.setAttribute('type', 'text/css');

                    e.setAttribute('Mokian:Style:URI', `${uri}`);

                    e.innerHTML = xhr.responseText;

                    document.head.insertAdjacentElement('afterbegin', e);

                    MokianHooks.Static.Dispatch('Asset:Style:Connected', [{Target:e}]);

                }
 
            });

        }

        return this;

    }
    
    , Palette: function(path, version){

        let uri = `${this.Path('palettes', path, version||null)}.css`;

        let exist = document.querySelector(`style[Mokian\\:Style\\:URI="${uri}"]`);

        if(!exist){
            
            let get = this.Get(uri).then((xhr)=>{

                if(xhr.status==200||xhr.status==0){

                    MokianMesa.AddToCache(xhr.responseURL);

                    let e = document.createElement('style');

                    e.setAttribute('type', 'text/css');

                    e.setAttribute('Mokian:Style:URI', `${uri}`);

                    e.innerHTML = xhr.responseText;

                    document.head.insertAdjacentElement('afterbegin', e);

                    MokianHooks.Static.Dispatch('Asset:Palette:Connected', [{Target:e}]);

                }
 
            });

        }

        return this;

    }
    
    , Tone: function(path, version){

        let uri = `${this.Path('tones', path, version||null)}.css`;

        let exist = document.querySelector(`style[Mokian\\:Style\\:URI="${uri}"]`);

        if(!exist){
            
            let get = this.Get(uri).then((xhr)=>{

                if(xhr.status==200||xhr.status==0){

                    MokianMesa.AddToCache(xhr.responseURL);

                    let e = document.createElement('style');

                    e.setAttribute('type', 'text/css');

                    e.setAttribute('Mokian:Style:URI', `${uri}`);

                    e.innerHTML = xhr.responseText;

                    document.head.insertAdjacentElement('afterbegin', e);

                    MokianHooks.Static.Dispatch('Asset:Tone:Connected', [{Target:e}]);

                }
 
            });

        }

        return this;

    }


};




/**
 * Code d'evaluation
 * @param {String} code Chaine de caractère du code à executer
 * @param {HTMLElement} $this Surcouche Mokian
 * @param {Arguments} args Arguments
 */
Mok.Core.Evaluate = function(code, $this, args){

    return function(){ return eval(`${code}`); }.apply($this, args||arguments);

};



/**
 * Construction des attributs
 * @param {object} o Objet à analyser
 * @param {string} ns namespace des attributs
 */
Mok.Core.SetAttributes = function(o,ns = false){

    let r = {};

    if(typeof o == 'object'){

        Object.keys(o).forEach((k)=>{

            let v = o[k];

            if(typeof v == 'object'){

                let oi = Mok.Core.SetAttributes(v,`${(typeof ns=='string'?(`${ns}:`):'')}${k}`);

                Object.assign(r, oi);

            }

            if(typeof v == 'string'){

                let oe = {};

                oe[ (`${(typeof ns=='string'?(`${ns}:`):'')}${k}`) ] = v;

                Object.assign(r, oe);
                
            }

        });
        
    }

    return r;

};



/**
 * Mokian Style
 */

Mok.Style = {

    GetVariable(name){ return getComputedStyle(document.documentElement).getPropertyValue(`${name}`); }

    , SetVariable(name, value){ return getComputedStyle(document.documentElement).setPropertyValue(`${name}`, value||''); }

    , HexToRGB(hex){

        let r = 0, g = 0, b = 0;

        if(hex.length == 4){

           r = "0x" + hex[1] + hex[1];

           g = "0x" + hex[2] + hex[2];
           
           b = "0x" + hex[3] + hex[3];

        }
        
        else if (hex.length == 7){
     
           r = "0x" + hex[1] + hex[2];
           
           g = "0x" + hex[3] + hex[4];
           
           b = "0x" + hex[5] + hex[6];

        };
     
        return [+r,+g,+b];
    }

    , ParseFromString(txt){

        let output = {};

        const dh = (new DOMParser()).parseFromString('','text/html');

        const ds = document.createElement('style');

        ds.innerHTML = txt;

        dh.body.appendChild(ds);

        MokianHooks.Static.Dispatch('Style:Connected', [{Target:ds}]);

        return ds.sheet;

    }

    , SafeJSSelector(selector){

        // const _selector = selector;

        const rex = /\[(.*)\]/gimu;

        const selectors = selector.split(' ');

        let output = selector;

        Object.values(selectors).forEach((sel)=>{

            const parses = [...sel.matchAll(rex)];
    
            if(parses.length){
    
                Object.values(parses).forEach((i)=>{

                    if(!i[0].match(/\\:/gi)){

                        const sp = i[1].split('=');

                        sp[0] = sp[0].replace(/:/gi, '\\:');

                        output = output.replace(i[1], `${sp.join('=')}`)

                    }
    

                })
                
            }
    
        })
        
        return output;
        
    }

};



const MokAct = {Entries:{},Using:{},Fn:{}};

MokAct.Add = function(layer, target, $n, $fn){

    // if(!($n in this.Fn)){

        let k = `${(Object.values(this.Entries).length + 1000)}`;

        this.Entries[k] = {Name:$n, Ref:k, Fn:$fn};
    
        target.removeAttribute(`@${$n}`);
    
        target.setAttribute(`Mok:${$n}`, k);
    
        layer.setAttribute(`MAOR:${$n}:${k}`, `${k}`);
    
        this.Using[$n] = this.Using[$n]||[];
    
        this.Using[$n].push(k);

        this.Fn[$n] = k;
    
        return k;
    
    // }

    // return;
    
}

/**
 * Analyse des Surcouche Mokian
 */
const MokPar = {

    Rex:{

        State: function(rex){ return new RegExp(`{${typeof rex=='string'?rex:'(.[a-zA-Z0-9.]*)'}}`, 'gi'); }

        // ,Props: function(rex){ return new RegExp(`{{${typeof rex=='string'?rex:'(.*)'}}}`, 'gi'); }

        ,Meths: function(){ return /\{%(.*)%\}/gimu; }
        
        ,Action: function(rex){ return new RegExp(`@${typeof rex=='string'?rex:'(.[a-zA-Z0-9.]*)'}`, 'gi'); }

        ,CSSRule: function(rex){ return new RegExp('(.*){(.*)}', 'gi'); }

    }

};



/**
 * Moteur des Attributs
 * @param {MokianOverlay} layer Surcouche Mokian
 * @param {HTMLElement} node Element HTML
 * @param {Rexgex} $Syntax Syntax à utliser pour analyser
 * @param {HTMLElement.Attributes} att Attributs HTML
 * @param {Function} $Fu Callback d'analyse
 * @param {Booloean} bfly BeFly
 */
MokPar.AttributeEngine = function(layer, node, $Syntax, att, $Fu, bfly = false){

    const rexa = [...((bfly===true) ? att.name : att.value||'').matchAll($Syntax)];

    // if(node.tagName == 'A'){

    //     console.trace('Detect Action ', node, rexa, $Syntax, bfly)

    // }
                    

    if(rexa.length > 0){

        Object.values(rexa).forEach((m)=> {

            m[1] = m[1].trim();

            att.value = $Fu.apply(layer, [{
        
                Type:'Attribute'
                
                , Target: node
                
                , Features: att

                , Match:m
                
                ,Overlay: layer
            
            }])||(att.value);

        } );
        
    }

};


/**
 * Usine de l'analyse des Surcouche Mokian
 * @param {MokianOverlay} $node Surcouche Mokian
 * @param {HTMLElement.NodeList} $Collection Liste des noeud HTMLElement à analyser
 * @param {Regex} $Syntax Syntax à utliser pour analyser
 * @param {Function} $Fu Callback de lecture
 * @param {Booloean} bfly BeFly
 */

MokPar.Factory = function($node, e, $Syntax, $Fu, bfly = false){

    const hasCode = new RegExp(`<(“[^”]*”|'[^’]*’|[^'”>])*>`, 'g');

    if(e.attributes.length){

        Object.values(e.attributes).forEach((att)=> this.AttributeEngine($node, e, $Syntax, att, $Fu, bfly) );

    }
    
    if(hasCode.test(e.innerHTML)){ return; }


    const rexi = [...(e.innerHTML||'').matchAll($Syntax)];

    if(rexi.length > 0){

        Object.values(rexi).forEach((m)=> {
            
            m[1] = m[1].trim();

            e.innerHTML = $Fu.apply($node, [{
                
                Type:'TextContent'
                
                , Target:e
                
                , Features:e.innerHTML

                , Match:m
                
                ,Overlay: $node
            
            }])||(e.innerHTML);
        
        });

    }

};

/**
 * Moteur de l'analyse des Surcouche Mokian
 * @param {MokianOverlay} $node Surcouche Mokian
 * @param {HTMLElement.NodeList} $Collection Liste des noeud HTMLElement à analyser
 * @param {Regex} $Syntax Syntax à utliser pour analyser
 * @param {Function} $Fu Callback de lecture
 * @param {Booloean} bfly BeFly
 */

MokPar.Engine = function($node, $Collection, $Syntax, $Fu, bfly = false){

    if($Collection instanceof HTMLElement){

        // console.trace('Set Engine On', $node, $Collection, $Syntax, bfly)


        if($Collection.attributes.length){
        
            Object.values($Collection.attributes).forEach((att)=> this.AttributeEngine($node, $Collection, $Syntax, att, $Fu, bfly) );
    
        }

        if($Collection.children.length){

            Object.values($Collection.children).forEach(($Child)=>{


                if($Child.tagName.substr(0,('MOK-').length) == 'MOK-'){

                    if($Child.attributes.length){
        
                        Object.values($Child.attributes).forEach((att)=> this.AttributeEngine($node, $Child, $Syntax, att, $Fu, bfly) );
                
                    }

                }

                else if($Child instanceof HTMLElement && $Child.children.length){


                    if($Child.attributes.length){
        
                        Object.values($Child.attributes).forEach((att)=> this.AttributeEngine($node, $Child, $Syntax, att, $Fu, bfly) );
                
                    }

                    this.Engine($node, $Child, $Syntax, $Fu, bfly);
                    
                }

                else{

                    if(!$Child.children.length){

                        if($Child.attributes.length){
        
                            Object.values($Child.attributes).forEach((att)=> this.AttributeEngine($node, $Child, $Syntax, att, $Fu, bfly) );
                    
                        }
    
                    }

                    this.Factory($node, $Child, $Syntax, $Fu, bfly);
                    
                }
                
            });
            
        }
        
        else{

        }
        
    }

};


/**
 * Analyse des Methodes de la surcouche
 * @param {HTMLElement} layer Surcouche Mokian
 * @param {HTMLElement} node Element HTML à analyser
 */
MokPar.Methods = function(layer, node){

    this.Engine(layer, node, this.Rex.Meths(), (Re)=>{

        if(Re.Type == 'TextContent'){

            const render = Mok.Core.Evaluate(`${Re.Match[1]}||''`, layer );

            if(typeof render == 'string'){

                return Re.Target.innerHTML.replace( Re.Match[0] , `${ render }` );

            }

            else if(render instanceof HTMLElement){

                return Re.Target.innerHTML.replace( Re.Match[0] , `${ render.innerHTML }` );
                
            }
            
            return;
            
        }
        
        if(Re.Type == 'Attribute'){

            return (Re.Features).value.replace( Re.Match[0] , `${ Mok.Core.Evaluate(`${Re.Match[1]}||''`, layer ) }` )

        }
        
    });

    return this;
    
};


/**
 * Profilage des états
 * @param {HTMLElement} layer Surcouche Mokian
 * @param {HTMLElement} node Element HTML à analyser
 */
MokPar.Profiling = function(layer, node){

    layer.$StatesTargets = {};

    this.Engine(layer, node, this.Rex.State(), (Re)=>{

        const k = Re.Match[1];

        layer.$StatesTargets[k] = layer.$StatesTargets[k]||[];
                  
        if(Re.Type == 'TextContent'){
            
            layer.$StatesTargets[k].push({ Target:Re.Target ,Content:Re.Features ,Match:Re.Match });

        }
        
        if(Re.Type == 'Attribute'){

            layer.$StatesTargets[k].push({ Target:Re.Target ,Attribute:{ Name:Re.Features.name ,Value:Re.Features.value } ,Match:Re.Match });

        }
        
        return;
        
    });

    return this;
    
};


/**
 * Analyse & Mise à jour des Etats
 * @param {HTMLElement} layer Surcouche Mokian
 */
MokPar.SetStates = function(layer){

    if(layer instanceof HTMLElement){

        if('$StatesTargets' in layer && typeof layer.$StatesTargets == 'object'){

            Object.keys(layer.$StatesTargets).forEach((kn)=>MokSt.Update(layer, kn));
            
        }

    }

    return this;
    
};

/**
 * Detection des actions
 * @param {HTMLElement} layer Surcouche Mokian
 * @param {HTMLElement} node Element HTML
 */
MokPar.DetectActions = function(layer, node){

    if(layer instanceof HTMLElement){

        this.Engine(layer, node, this.Rex.Action(), (Re)=>{

            if(Re.Type == 'Attribute'){

                let MonitoringAction = MokAct.Add(Re.Overlay, Re.Target, Re.Match[1], function(){

                    try{

                        return `${ 
                        
                            Mok.Core.Evaluate(
    
                                `(${Re.Features.value}).apply(this, arguments)`
    
                                // `(()=>{return ${a.value}; }).apply(this, arguments)`
    
                                , Re.Overlay
                                
                                , arguments
                            
                            )
                        
                        }`;
                        
                    }

                    catch($e){

                        console.log('Mokian Actions > ', Re.Features.value )

                    }

                    
                });

                return;
    
            }
            
        }, true);
    
    }

    return this;
    
};

/**
 * Liaison des actions
 * @param {HTMLElement} layer Surcouche Mokian
 * @param {HTMLElement} node Element HTML
 */
MokPar.BindActions = function(layer, node){

    Object.keys(MokAct.Using).forEach((u)=>{

        let g = node.querySelectorAll(`[Mok\\:${u}]`);
        
        if(g.length){

            g.forEach((e)=>{

                const k = e.getAttribute(`Mok:${u}`);

                const $tagger = `$ActionLounge${u}${k}`;

                // console.log('Bind Action ',e, u, k)
                
                if(e[$tagger] === true){return;}

                // console.log('-- Bind Action ',e, u, k)

                e.addEventListener(u, (_)=>{

                    let ki = e.getAttribute(`Mok:${u}`)||null;
        
                    if(ki != null && ki == k){
    
                        let ent = MokAct.Entries[ki]||false;
    
                        if(ent){ ent.Fn.apply(layer,[_,e]); }
                        
                    }
    
                }, true);
            
                e[$tagger] = true;

            });
            
        }

    });

    return this;
    
};

/**
 * Démarrage de l'analyse de la surcouche
 * @param {HTMLElement} layer Surcouche Mokian
 * @param {HTMLElement} node Element HTML à analyser
 */
MokPar.Run = function(layer,node){

    if(layer instanceof HTMLElement && node instanceof HTMLElement){

        if('@Hook' in layer){ layer['@Hook'].Dispatch('WhenBeforeParsed',[{Target:node}]); }

        this
                    
            .Methods(layer, node)
        
            .Profiling(layer, node)

            .DetectActions(layer, node)

            .BindActions(layer, node)

            .Monitor(layer, node)
            
        ;

        if('@Hook' in layer){ layer['@Hook'].Dispatch('WhenAfterParsed',[{Target:node}]); }

        return node.tagName.toLowerCase() == 'body' ? node.children[0] : node;
        
    }

    return;

};



MokPar.Monitor = function(layer, node){

    /* Observateur de Mutation */
        
    const o = new MutationObserver((m)=>{

        m.forEach((m)=>{

            const n = m.target;

            // if (m.addedNodes.length) {

            //     m.addedNodes.forEach((n)=>{

                    // console.log('Parsing Monitor', layer, node, n)

                    this
                    
                        .SetStates(layer)

                        .DetectActions(layer, n)
                        
                        .BindActions(layer, n)
                        
                    ;

                    if('@Hook' in layer){ layer['@Hook'].Dispatch('WhenMigrate',[{Overlay:layer, Target:n}]); }

                    
            //     })

            // }

        });

    });

    o.observe(layer, { childList: true, attributes: true })

    return this;
    
};



/**
 * Propriétés des Surcouche Mokian
 */
const MokProps = {};

MokProps.Use = class{

    constructor(layer, scheme = null){

        this.Layer = layer;

        this.Layer['Props'] = this.Layer['Props']||{};
        
        
        let $Observer = new MutationObserver((ms)=>{

            let chged = false;
        
            ms.forEach((m)=>{

                if(m.type == "attributes") {

                    const atn = m.attributeName;

                    const val = this.Layer.getAttribute(atn);

                    chged = true; 
                    
                    this.Layer['Props'][atn] = val;

                    if('@Hook' in this.Layer){ 
                
                        this.Layer['@Hook'].Dispatch('WhenPropChanged',[{
                            
                            Overlay:this.Layer

                            , Name: atn

                            , Value: val
                        
                        }]); 
                    
                    }

                }

            });

            if(chged===true){ 

                if('@Hook' in this.Layer){ 
                    
                    this.Layer['@Hook'].Dispatch('WhenPropsChanged',[{
                        
                        Overlay:this.Layer
                    
                    }]); 
                
                }

            }

        });

        $Observer.observe(this.Layer, {
        
            attributes: true,
        
            attributeOldValue: true
        
        });
        
    }

    Set(scheme){
        
        if(typeof scheme == 'object'){

            Object.keys(scheme).forEach((kn)=>{

                this.Layer.setAttribute(kn, scheme[kn]);

                this.Layer.Props[kn] = scheme[kn];

            }); 
            
        }

        return this;
        
    }
    
};

MokProps.Define = function(layer, scheme){

    layer['Props'] = layer['Props']||{};

    scheme = typeof scheme == 'object' ? scheme : {};

    Object.values(layer.attributes).forEach((att)=>{

        layer.Props[att.name] = scheme[att.name]||att.value;

    });

    return new MokProps.Use(layer, scheme);

};


/**
 * Etat des Surcouche Mokian
 */
const MokSt = {};


MokSt.Use = class{

    constructor(layer){

        this.Layer = layer;
        
    }

    Set(scheme){

        if(typeof scheme == 'object'){

            Object.keys(scheme).forEach((kn)=>{

                this.Layer.State[kn] = scheme[kn];

                MokSt.Update(this.Layer, `this.${kn}`);

            }); 
            
        }

        return this;
        
    }
    
};

/**
 * Analyse des Methodes de la surcouche
 * @param {HTMLElement} layer Surcouche Mokian
 * @param {Object} scheme Schema des états à injecter
 */

MokSt.Define = function(layer, scheme){

    if(layer instanceof HTMLElement&&typeof scheme == 'object'){

        layer['State'] = layer['State']||{};

        Object.keys(scheme).forEach(k=>layer.State[k]=scheme[k]);

    }

    return new MokSt.Use(layer);

};


/**
 * Mise à jour de l'etat de la surcouche
 * @param {HTMLElement} layer Surcouche Mokian
 * @param {String} kn Nom de la variable référence
 */

MokSt.Update = function(layer, kn){

    if(!('$StatesTargets' in layer)){return this;}

    if(typeof  layer.$StatesTargets[kn] == 'object'){

        let up = layer.$StatesTargets[kn].map((Re)=>{

            // console.log('Update State', Re)

            if(Re.Target instanceof HTMLElement){


                if('Content' in Re){

                    let render = Mok.Core.Evaluate(`${Re.Match[1]}||''`, layer.State );

                    if(render instanceof HTMLElement){
        
                        Re.Target.innerHTML = Re.Content.replace( Re.Match[0] , `${ render.innerHTML }` );
        
                    }
                    
                    else{
        
                        Re.Target.innerHTML = Re.Content.replace( Re.Match[0] , `${ render }` );
        
                    }

                }

                if('Attribute' in Re){

                    let render = Mok.Core.Evaluate(`${Re.Match[1]}||''`, layer.State );

                    Re.Target.setAttribute(Re.Attribute.Name, Re.Attribute.Value.replace( Re.Match[0] , `${ render }` ));
        
                }

                return Re;

            }

            return;
            
        });

    }

    return this;
    
};



/**
 * Surcouche Mokian
 */
let MokOv = {Elements:{}};

MokOv.ShadowEdge = (i,t)=>new DOMParser().parseFromString(i,t||'text/html');

MokOv.Element = main=> class extends HTMLElement{

    constructor(){

        super();

        // console.log('Main is', typeof main, main )

        if(typeof main == 'function'){

            this.Main = ()=>main.apply(this,[this]);

        }
        
    }
    
    
    connectedCallback(){

        const m = this.Main();

        // console.log('Connected > ', m instanceof HTMLCollection, m instanceof NodeList, m instanceof HTMLElement)
        
        if(
            
            m instanceof HTMLCollection

            || m instanceof NodeList
            
        ){

            Object.values(m).forEach((e)=>this.appendChild(e));

        }

        if(m instanceof HTMLElement){

            this.appendChild(m);
            
        }

        else if(typeof m == 'string'){

            this.innerHTML = m;
            
        }

        if('@Hook' in this){ this['@Hook'].Dispatch('WhenReady',[{Target:m}]); }

        if('@Hook' in this){ this['@Hook'].Dispatch('WhenConnected',null); }

        // console.log('Connected with', m)
        
    }


    adoptedCallback(){

        if('@Hook' in this){ this['@Hook'].Dispatch('WhenReConnected',null); }

    }


    disconnectedCallback(){

        if('@Hook' in this){ this['@Hook'].Dispatch('WhenDisConnected',null); }

    }
    

    Main(){ return `<h1>${this.tagName} is Mokian Overlay</h1>`; }
    
    
    Mount(input){

        let out;

        if('@Hook' in this){ this['@Hook'].Dispatch('BeforeMount',[{Target:input}]); }


        if(typeof input == 'string'){

            const Hi = MokOv.ShadowEdge(input);

            if(Hi.body.children.length > 1){

                throw `${this.tagName} doit etre contenu dans une seule et même balise!`;
                
            }
            
            out = MokPar.Run(this, Hi.body);
            
        }

        if(input instanceof HTMLElement){

            out = MokPar.Run(this, input);
            
        }

        // console.log('Mount > ', this, out.innerHTML );
        
        if('@Hook' in this){ this['@Hook'].Dispatch('WhenMounted',[{Target:out}]); }

        return out;
        
    }



    View(input){

        this.innerHTML = '';

        return this.Mount(input);
        
    }




    Navigate(path, his = true, done = null, fail = null){

        let scr = MokianNavigation.Screen||MokianNavigation.Screens[0];
        
        // console.log('Navigate in ', scr )

        if(scr){

            scr.Navigate(path, his, done, fail);
            
        }

        else{

            console.warn('MokianNavigation.Screen : Aucun écran Mokian detecté')

        }

    }

    
    
    
};

/**
 * Creation de la couche
 * @param {string} name Nom de la surcouche
 * @param {mixed} main Caratéristique de la couche
 */
MokOv.Create = function(name, main = null){

    
    if(typeof name == 'string'){
        
        const $name = `mok-${(name).toLowerCase()}`;

        if(typeof main == 'function'){

            this.Elements[name] = MokOv.Element(main);

            // let whn = customElements.whenDefined($name);

            // whn.then(()=>{

            //     console.log($name, 'is Defined');
                
            // });

            customElements.define($name, this.Elements[name]);

            return this.Elements[name];
            
        }

    }

    return null;

};




export const MokianParse = MokPar;

export const MokianProps = MokProps;

export const MokianState = MokSt;

export const MokianOverlay = MokOv;

export const Mokian = Mok;