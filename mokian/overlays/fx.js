import { Mokian, MokianOverlay, MokianProps, MokianState } from "../core/0.0.4.js";
import { MokianNavigation } from "./navigation.js";


Mokian.Core.Asset.Style('fx', '0.0.1');


window.MokianFx = {

    Entries:[]

    , Stop(e){

        if(!(e instanceof HTMLElement)){return this;}
        
        e.setAttribute('Mok:Fx:Status','0');

        setTimeout(()=>{
            
            // e.style.animationName = null;
            
            // e.onanimationend = null;

        },60);

        return this;

    }

    , Play:function(e, $Slug = '', $Config = {}, $done = null){

        // console.warn('>sTransition ', e)

        if(!(e instanceof HTMLElement)){return this;}
        
        // let status = e.getAttribute('Mok:Fx:Status');

        // if(status == '1'){return this;}

        $Config = $Config||{};

        $done = typeof $done == 'function' ? $done : ()=>{};

        e.setAttribute('Mok:Fx:Status','1');
        

        let $Name = ($Slug||'').replace(/\./g, '-')||'fx-fade';

        let $Duration = $Config['duration'] || 360;

        
        $Config['duration'] = `${($Duration)}ms`;
        
        $Config['fill-mode'] = $Config['fill-mode']||'forwards';

        $Config['timing-function'] = $Config['timing-function']||'ease-in-out';

        Object.keys($Config).forEach((k)=> e.style[`animation-${k}`] = $Config[k] );

        e.onanimationend = (_)=> {

            $done(e,_); 

            setTimeout(()=> this.Stop(e), 60);

            // this.Stop(e);
            
        };

        e.style.animationName = $Name;



        return this;
        
    }


}


const overlay = MokianOverlay.Create('fx', (layer)=>{

    const appHook = new MokianHooks.Dynamic(layer);

    const props = MokianProps.Define(layer,{});

        layer.Props['in'] = layer.Props['in']||'fx.fade.in'

        layer.Props['out'] = layer.Props['out']||'fx.fade.out'

        // layer.Props['moment'] = layer.Props['moment']||null

        layer.Props['target'] = layer.Props['target']||null
        


    
    const construct = ()=>{

        let host = ('target' in layer.Props) ? layer.Props.target : MokianNavigation.CurrentScreen();


        if(host instanceof HTMLElement){ 
            
            host.setAttribute('Mokian:Fx:Bind', JSON.stringify(layer.Props)); 
        
        }

        else {

            host = document.querySelectorAll(layer.Props.target);

            if(host instanceof NodeList && host.length){ host.forEach((e)=> { 
                
                e.setAttribute('Mokian:Fx:Bind', JSON.stringify(layer.Props)) 
            
            } ); }

            else{

                host = MokianNavigation.CurrentScreen();
                
                host.setAttribute('Mokian:Fx:Bind', JSON.stringify(layer.Props)); 
        
            }

        }

        // console.warn('Fx > ', host)
        
    }

    appHook.Listen('WhenConnected', (ev)=>construct());

    appHook.Listen('WhenPropsChanged', (ev)=>{

        construct()

    });

    return layer.Mount(`${construct()}`);

});







export const MokianFxOverlay = overlay;