import { Mokian } from "../core/0.0.4.js";
import $Settings from "../settings/index.js";



window.MokianTemplate = { Installed:{}, $Parameters:{} };


MokianTemplate.SetTitle = function(title, base){

    title = (title||base).replace(/(<([^>]+)>)/gi, "");

    const hasCode = new RegExp(`<(“[^”]*”|'[^’]*’|[^'”>])*>`, 'g');

    if(!hasCode.test(title.innerHTML)){ 

        base = base || $Settings['App:Title'];

        return (title == base) ? (title) : `${title} - ${base}`;
    
    }

    return document.title;

};


MokianTemplate.Check = function(overlay, tpl){

    this.OkBinder = true;

    if('$CurrentTemplateBrick' in overlay){

        if(overlay.$CurrentTemplateBrick == tpl){

            this.OkBinder = false;

        }

    }

    overlay['$CurrentTemplateBrick'] = tpl||false;

    return this;

};


MokianTemplate.Bind = function(master, brick){

    // console.log('Bind Template ', this.OkBinder, master, brick );

    if(this.OkBinder){

        brick['$Template'] = master;

        return brick;

    }

    return null;

};


MokianTemplate.Parameters = function(name, param){

    this.$Parameters[name] = param;

    return this;

};


MokianTemplate.Use = function(name, version){

    let root = document.documentElement;

    root.setAttribute('mokian:template:using', `${name||'UnKwnon'}@${version||'UnKwnon'}`);

    return this;

};

MokianTemplate.Toggle = function(_screen, tpl, brick, params){

    if(_screen instanceof HTMLElement){
        
        if(brick in tpl){

            const view = _screen.querySelector('mok-view');

            const _nscreen = tpl[brick](
            
                _screen.Overlay
                
                , params||{}
                
            );

            if(view instanceof HTMLElement){ _nscreen.appendChild(view); }

            _screen.Overlay.replaceChild(_nscreen, _screen);
            
        }
        
    }

    return this;
    
};

// MokianTemplate.Toggle = function(){

//     if(
                                
//         'MokianFx' in window 
        
//         && '$MokianFx' in this['@Screen'] 
        
//         && (
            
//             this['@Screen']['$MokianFx']

//             && typeof this['@Screen']['$MokianFx'] == 'object'
            
//         )
        
//     ){
        
//         console.warn('Fx Moment', this['@Screen'].$MokianFx )

//         // MokianFx.Play();
        
//     }

//     else{
        
//     }

//     return this;
    
// };

MokianTemplate.Install = function(tpl = false, fragment = false){

    if('Name' in tpl){
        
        let uri = `${Mokian.Core.Asset.Path(`styles`, `${tpl.Name}`, tpl.Version||null)}/${fragment||'Index'}.css`;

        let exist = document.querySelector(`style[Mokian\\:Style\\:URI="${uri}"]`);

        if(!exist){

            let get = Mokian.Core.Asset.Get(uri).then((xhr)=>{
                
                if(xhr.status==200||xhr.status==0){
                    
                    this.Installed[tpl.Name] = tpl;

                    const sel = `:root[Mokian\\:Template\\:Using="${tpl.Name}@${tpl.Version||''}"]`;
                    
                    const ds = Mokian.Style.ParseFromString(xhr.responseText);

                    const rules = ds.rules||ds.cssRules;

                    let prs = [];

                    
                    if('MokianMesa' in window){
                        
                        // MokianMesa.AddToCache(xhr.responseURL);

                    }
                    
                    let e = document.createElement('style');

                    e.setAttribute('type', 'text/css');
                    
                    e.setAttribute('Mokian:Style:URI', `${uri}`);

                    e.setAttribute('Mokian:Template:Name', `${tpl.Name||'UnKwnon'}`);

                    e.setAttribute('Mokian:Template:Version', `${tpl.Version||'UnKwnon'}`);

                    document.head.insertAdjacentElement('beforeend',e);
                    
                    for(let x=0; x < rules.length; x++){

                        const r = rules[x];

                        const ru = r.selectorText.split(','); 

                        const val = r.cssText.replace(r.selectorText, '');
                        
                        let sr = [];
                        
                        ru.forEach((rn,k)=>{
                        
                            let matc = rn.match(new RegExp(':root', 'gi')), selname;

                            if(matc){ selname = rn.replace(new RegExp(':root', 'gi'), `${sel}`); }

                            else{ selname = (`${sel} ${rn.replace(new RegExp('^\[:\]$', 'giu'), '\\:')}`); }

                            sr[sr.length] = Mokian.Style.SafeJSSelector(selname);

                        });

                        prs[prs.length] = `${sr.join(',')} \n${val}\n`;

                    }

                    e.innerHTML = `${prs.join('')}`;

                }

            });

        }


    }
    
    return this;

};



export default MokianTemplate;