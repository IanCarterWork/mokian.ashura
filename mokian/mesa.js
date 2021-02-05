// import {MokianMesaServiceWorker} from './services/mesa.service.worker.js';

    
const Mesa = {isReady:false,CacheName:'mokian.mesa.cache',Config:{}};

Mesa.Fetcher = function(path){

    return new Promise((solve, ject) => {
            
        const x = new XMLHttpRequest();

        x.open("GET", path);
        
        x.setRequestHeader('X-REQUESTED-WITH', 'GGN:Mokian / Mesa');

        x.onload = ()=>{ try{ if(x.status == 200){ try{ solve(x); } catch($e){ ject(x); } } } catch($e){ console.log('Mesa Erreur \n ', $e) } };
        
        x.onerror = () => ject(x);
        
        x.send();
    
    });
    
};

Mesa.Run = function(){

    this

        .Initialize()
    
    ;

    return this;

};

Mesa.SplashScreen = function(){

    let e = document.createElement('div');

    let uis = {
        width: '100vw'
        ,height: '100vh'
        ,zIndex: '999'
        ,display: 'flex'
        ,flexDirection: 'column'
        ,alignItems: 'center'
        ,justifyContent: 'center'
        ,position: 'fixed'
        ,top: '0px'
        ,left: '0px'
        ,backgroundColor: '#282828'
        ,backgroundImage: 'linear-gradient(120deg, var(--Color-One), var(--Color-Two))'
        ,backgroundSize:'cover'
        ,opacity:'1'
        ,transition:'opacity 480ms ease-in'
    };

    e.id = 'mokian-mesa-splashscreen';

    e.setAttribute('Mokian:Mesa', 'SplashScreen');

    document.body.appendChild(e);

    Object.keys(uis).map((n)=>e.style[n]=uis[n]);

    if(this.Config.SplashScreen){

        if(this.Config.SplashScreen['BackImage']){
            
            e.style.backgroundImage = `url(${this.Config.SplashScreen['BackImage']})`;

        }
        
        if(this.Config.SplashScreen['Icon']){

            let icn = document.createElement('div');

            let ic = document.createElement('img');

            icn.setAttribute('Mesa:SplashScreen', 'IconBox');

            ic.setAttribute('Mesa:SplashScreen', 'Icon');

            icn.appendChild(ic);

            e.appendChild(icn);

            ic.style.maxWidth = '64px';

            ic.style.opacity = '0.0001';
            
            ic.style.transition = 'all 360ms ease-in 100ms';

            ic.onload = ()=> ic.style.opacity = '1';

            ic.src = `${this.Config.SplashScreen['Icon']}`;

        }
        
    }

    this.$SplashScreen = e;

    return this;

};

Mesa.Initialize = function(){

    this.CacheName = document.documentElement.getAttribute('mokian:mesa:name')||this.CacheName;

    this.ServiceActived = document.documentElement.getAttribute('Mokian:Mesa:Service');

        this.ServiceActived = (this.ServiceActived == 'Disable') ? false : true;

    this.Fetcher(document.documentElement.getAttribute('mokian:mesa:config')||'mesa.config.json').then((x)=>{

        let jn = JSON.parse(x.responseText)

        Object.keys(jn).map((n)=> this.Config[n]=jn[n] );

        this.SplashScreen();

        this.Payloads();

    });

    return this;

};

Mesa.AddToCache = function(uri){

    let He = new Headers({'X-REQUESTED-WITH': 'GGN:Mokian / Mesa Caching'});

    this.CacheName = document.documentElement.getAttribute('mokian:mesa:name')||this.CacheName;

    this.Caches = (caches.open(this.CacheName)).then((cache)=> {

        cache.add(new Request(uri, {headers:He}));
        
    } );

    return this;

};

Mesa.Payloads = function(){

    this.Boot();

    this.Config.Payloads = this.Config.Payloads||[];

    if(this.Config.Payloads){

        this.Caches = caches.open(this.CacheName);

        this.Caches.then((cache)=>{ 

            this.Preload(0, cache, this.Config.Payloads
                
                , null
                
                , (pl)=>{

                    this.Boot();
                
                }
                
            );
            
        });

    }
    return this;
    
};

Mesa.Preload = function(k,cacheObject, list,hit=null,done=null){

    if(k in list){

        cacheObject.add(list[k].path)
        
            .then((cdat)=>{
                if(typeof hit == 'function'){hit(list[k]);}
        
            })

        ;
             
        this.Preload(k+1,cacheObject,list,hit,done);

    }

    else{

        if(typeof done == 'function'){done(list)}
        
    }

    return this;
    
};


Mesa.Boot = function($Name){

    if('MokianMesaServiceWorker' in window && this.ServiceActived){

        MokianMesaServiceWorker.Trigger($Name||this.CacheName, ($SWReg)=>{

            Mesa.BootUnit($SWReg);

        });

    }

    else{

        Mesa.BootUnit(null);

    }

    return this;

};

Mesa.BootUnit = function($SWReg = null){

    if(this.isReady === true){return this;  }

    const index = document.documentElement.getAttribute('mokian:mesa:index')||'./index.js';

    const e = document.createElement('script');


    e.setAttribute('type', 'module');

    e.onload = ()=>{

        setTimeout(()=>{
            

            this.$SplashScreen.addEventListener('transitionend', ()=>{

                try{ this.$SplashScreen.parentNode.removeChild(this.$SplashScreen); } catch($er){}
                
            });
            
            this.$SplashScreen.style.opacity = '0.0001';

        },1962);

    };


    e.onerror = ($err)=>{

        console.error('Mokian Mesa Error detected \n', $err)

    };


    e.setAttribute('src', index);


    document.body.appendChild(e);

    this.isReady = true;
    
    return this;
    
};



document.addEventListener('DOMContentLoaded', function(){

    Mesa.Run();

});



window.MokianMesa = Mesa;


export default MokianMesa;