import $Settings from '../settings/index.js';

const MokNavigation = {
        
    Screen:null

    ,Screens:[]

    ,ResolveTimer: null

    ,TransitionTimeOut: 250

    ,TransitionTimingFunction: 'cubic-bezier(0.81, 0.25, 0.11, 0.82)'

    ,CurrentScreen: function(){

        return this.Screen||this.Screens[this.Screens.length - 1]||false;
        
    }

};

window.MokianNavigate = function(path, his = true){

    // console.log('Navigate to ', path, his, MokNavigation )

    MokNavigation.To(path, his);
    
}



MokNavigation.GetURI = function(path=''){

    return `${$Settings['Http:Host']}${(typeof $Settings['View:Path'] != 'undefined')?$Settings['View:Path']||'':'views/'}${path}${$Settings['View:Extension']||''}`;
    
};
        

/**
 * Mokian Navigation View
 * @param {String} path Chemin de la vue
 * @param {Boolean} his Mettre dans l'historique
 */
MokNavigation.Go = function(path='',his=true){

    let scr = MokNavigation.CurrentScreen();
            
    console.log('Navigate in ', scr )

    if(scr){

        scr.Navigate(path, his);
        
    }

    else{ console.warn('MokianNavigation.Screen : Aucun écran Mokian detecté'); }

};
      

MokNavigation.Transition = function(_screen, out = false, done = null){

    done = typeof done == 'function' ? done : ()=>{};

    out = out===true ? 'in':'out';

    const profil = _screen.getAttribute('Mokian:Fx:Bind');


    if( 'MokianFx' in window && profil ){

        _screen.$MokianFx = JSON.parse(profil);

        MokianFx.Play(
            
            _screen, _screen.$MokianFx[out]||`fx.fade.${out}`
            
            , {

                duration: this.TransitionTimeOut||250

                , 'timing-function': 'ease-in-out'

            }
        
            , ()=>{

                // console.log('----> Transition ', out, typeof _screen['$MokianFx'])
    
                setTimeout(()=>done(),60)
            
            }
        
        );
            

    }

    else{ done(); }

    return this;
    
};
  



MokNavigation.ParamToObject = function($String){

    if($String.length > 0){

        return JSON.parse('{"' + decodeURI($String).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

    }

    return null;

};
  



MokNavigation.ParseURI = function(uri, $Update = true){

    let u, up;

    
    if($Settings['Navigation:UseHash'] === true){
        
        u = new URL(`${uri}`, location.origin);

        u = new URL(`${u.pathname}${u.hash.substr(1)}`, location.origin);
        
    }
    
    else{

        u = new URL(`${uri}`, location.origin);
        
    }

    u.queryObject = this.ParamToObject(u.search.substr(1));

    return u;
    
};

/**
 * Mokian Navigation View
 * @param {HTMLElement} scrn Cible
 * @param {?String} path Chemin de la vue
 * @param {Boolean} his Mettre dans l'historique
 * @param {Object} config Configuration
 */


MokNavigation.Resolve = function(scrn, path=null,his=true,config=false){

    scrn = this.CurrentScreen();
        
    path = path.substr(0,1) == "#" ? path.substr(1) : path;
            
    config = typeof config=='object'?config:{};
    
    const uri = this.GetURI(path);

    const _uri = this.ParseURI(path);

    const overlay = scrn.Overlay;

    clearTimeout(this.ResolveTimer);
    

    // console.log('Parse URI ', `${this.GetURI(_uri.pathname.substr(1))}` )

    this.Transition(scrn, false, ()=>{ 

        this.ResolveTimer = setTimeout(()=>{ console.log('Loading...'); }, 1000);

        this.Load(`${this.GetURI(_uri.pathname.substr(1))}`, {
            
            data: (_uri.query||'').substr(1)
            
            , $success: (x)=>{

                $Settings['View:Current'] = `${this.GetURI(_uri.pathname.substr(1))}`;

                // console.log('XHR Success ', x)

                document.documentElement.scrollTop = 0;

                scrn.ChangeView(x.responseText);

                clearTimeout(this.ResolveTimer);

                setTimeout(()=>{

                    if(overlay instanceof HTMLElement){

                        // scrn.style.animationName = null;
    
                        // let nscreen = overlay.querySelector('mok-screen');
    
                        // if(scrn instanceof HTMLElement){
    
                            MokNavigation.Transition(scrn, true, ()=>{
    
                                MokianHooks.Static.Dispatch('NavigateChange', [{
                            
                                    URI: uri
                    
                                    ,Target: x
                                    
                                    ,Path: path
                    
                                    ,UseHistory: his
                    
                                    ,Config: config
                    
                                    ,Screen: scrn
                                    
                                }], this);
                                
                                if(typeof config.success=='function'){config.success(x);} 
                    
                            });
                            
                        // }
    
                        // console.warn('New screen : ', overlay, nscreen)
    
                    }
    
                },100)
    
            }

            , $fail: (x)=>{ 

                console.warn('Echec', x)

                setTimeout(()=>{

                    scrn.ChangeView(`

                        <mok-fx  in="fx.fade.in" out="fx.fade.out" ></mok-fx>

                        <screen-param name="ToggleScreen" value="Empty" parameter-sheet="Landing" ></screen-param>

                        <div Stack:Flex="Column" Stack:Align="Center" Bg:Color="Warning" Text:Color="WarningText" class="width-v10 height-v10">
                        
                            <mok-glyph name="page-break" size="5x"></mok-glyph>
                        
                            <div Ui:Content Text:Align="Center" >

                                <h1>Oops</h1>

                                <h5>Quelque chose est cassé</h5>
                        
                            </div>

                        </div>
                    
                    `);
                    
                }, this.TransitionTimeOut||300)

            }

            , $error: (x)=>{

                console.error('Error', x)

                setTimeout(()=>{

                    scrn.ChangeView(`

                        <mok-fx  in="fx.fade.in" out="fx.fade.out" ></mok-fx>

                        <screen-param name="ToggleScreen" value="Empty" parameter-sheet="Landing" ></screen-param>

                        <div Stack:Flex="Column" Stack:Align="Center" Bg:Color="Error" Text:Color="ErrorText" class="width-v10 height-v10">
                        
                            <mok-glyph name="debug" size="5x"></mok-glyph>
                        
                            <div Ui:Content >

                                <h3>Erreur</h3>

                                ${(typeof x == 'object') ? JSON.stringify(x) : x}
                        
                            </div>

                        </div>
                    
                    `);
                    
                }, this.TransitionTimeOut||300)

                
            }
            
            // , done: (x)=>{if(typeof config.done=='function'){config.done(x);}}
            
        });


    });
    
    
    return this; 
    
};
        
        

/**
 * Mokian Navigation View
 * @param {String} path Chemin de la vue
 * @param {Boolean} his Mettre dans l'historique
 * @param {Object} config Configuration
 */

MokNavigation.To = function(path, his=true,config=false){
        
    path = path||location.hash||$Settings['View:Boot'];

        path = path.substr(0,1) == "#" ? path.substr(1) : path;
            
    config = typeof config=='object'?config:{};
    
    const uri = this.GetURI(path);


    $Settings['Navigation:UseHash'] = typeof $Settings['Navigation:UseHash'] == 'boolean' 
    
    ? $Settings['Navigation:UseHash'] : true;
    



    if($Settings['Navigation:UseHash'] === true){ 

        console.log('Change Hash', path, location.hash.substr(1) )

        if(location.hash.substr(1) != path){

            location.href = `#${path}`; 

        }

        else{

            this.Resolve(false, path, his, config);

        }
        
    
    }

    else{ 

        if((`${$Settings['Http:Host']}${$Settings['View:Path']}${path}` != location.href)){

            console.log('To ', path)

            history.pushState(
            
                {path:path,useHistory:his}
                
                , document.title
                
                , `${$Settings['App:URL']||$Settings['Http:Host']||'./'}${path}`
                
            ); 
            
            this.Resolve(false, path, his, config);

        }

        else{

            this.Resolve(false, path, his, config);

        }
        
    
    }



    // console.log('Navigate To -> ', path, uri);

    return this; 
    
};

MokNavigation.Replace = function(path, pop = null){

    let uri;
        
    path = location.hash||$Settings['View:Boot'];

        path = path.substr(0,1) == "#" ? path.substr(1) : path;
            

    $Settings['Navigation:UseHash'] = typeof $Settings['Navigation:UseHash'] == 'boolean' 
    
    ? $Settings['Navigation:UseHash'] : true;
    

    if($Settings['Navigation:UseHash'] === true){ uri = `${location.href}#${path}`; }

    else{ uri = `${$Settings['Http:Host']}${path}`; }

    history.replaceState(pop||{},document.title, uri);

    return this; 
    
};

MokNavigation.Load = function(uri, config){

    config = typeof config=='object'?config:{};

    const x = new XMLHttpRequest();

    x.open("GET", uri);

    x.setRequestHeader('X-REQUESTED-WITH', 'GGN:Mokian / Navigation');

    x.onload=()=>{ 

        console.log('XHR Status', x.status)
    
        if(x.status == 200||x.status == 0){
        
            // MokianMesa.AddToCache(x.responseURL);

            if(typeof config.$success=='function'){config.$success(x);}
            
        }
    
        if(x.status==404){ 

            if(typeof config.$fail=='function'){config.$fail(x);}
            
        }
    
        if(typeof config.$done=='function'){config.$done('@DataNotFound');}

    };
    
    x.onerror=(x)=>{ if(typeof config.$error=='function'){config.$error(x);} };
    
    x.send(config.data||null);


    return this; 
    
};

MokNavigation.Initialize = function(){

    $Settings['Navigation:UseHash'] = typeof $Settings['Navigation:UseHash'] == 'boolean' 
        
        ? $Settings['Navigation:UseHash'] : true;
    

    
    if($Settings['Navigation:UseHash'] === true){

    //     window.addEventListener('hashchange', (ev)=>{ 

    //         const _scrn = MokNavigation.CurrentScreen();

    //         this.Resolve(_scrn, location.hash); 
        
    //     });

    //     window.addEventListener('load',  (ev)=> { 

    //         if(location.hash){
                
    //             const _scrn = MokNavigation.CurrentScreen();

    //             this.Resolve(_scrn, location.hash); 

    //         }

    //     });

    }

    else{
       
        window.addEventListener('load',  (ev)=> { 

            console.log('Get Current Path ', location )

            // if('View:Current' in $Settings){
                
                // const _scrn = MokNavigation.CurrentScreen();

                // this.Resolve(_scrn, $Settings['View:Current'], true); 

            // }

        });

        window.addEventListener('popstate',  (ev)=> {

            let _scrn = MokNavigation.CurrentScreen();

            
            if(_scrn instanceof HTMLElement){
                
                const pop = ev.state||null;

                if(pop){

                    this.Resolve(_scrn, pop.path, pop.useHistory );

                    // this.To(false, pop.path, false)

                    // target.Navigate(pop.path,false);
                    
                }
    
            }

        });
     
    }
       
     
    return this;
            
};

MokNavigation.Initialize();



export const MokianNavigation = MokNavigation;