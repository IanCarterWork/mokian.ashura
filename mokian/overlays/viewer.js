// const jc = {};

import { Mokian } from "../core/0.0.4.js";
import { MokianNavigation } from "./navigation.js";


Mokian.Core.Asset.Style('viewer', '0.0.1');
Mokian.Core.Asset.Style('screen', '0.0.1');

/**
 * Mokian Screen Element
 */

Mokian.Core.ScreenEntries = 0;

class mScreenElement extends HTMLElement{

    
    constructor(){

        super();

        // this.Hooks = new MokianHooks.Dynamic(this);

        this.Overlay = arguments[0]||MokianNavigation.CurrentScreen().Overlay;

        this.Parameters = arguments[1]||{};


        MokianNavigation.Screens.push(this);

        if('@Hook' in this.Overlay){

            this.Overlay['@Hook'].Listen('WhenMounted', (ev)=>{

                if(ev.Target){

                    const params = ev.Target.querySelectorAll('screen-param');

                    if(params.length){
    
                        params.forEach((Pa)=>{
    
                            Pa['@Screen'] = this;

                            // Pa.appendChild( this.Overlay.Mount(`<div>${Pa.innerHTML}</div>`) );
    
                        });
                        
                    }

                }

                
            });
            
        }


        this.Navigate();

    }


    Navigate(path=false, his=true){

        // console.warn('Screen Navigate ', path, location.hash, `#${path}`)

        
        if($Settings['Navigation:UseHash'] === true){ 

            if(!location.hash){

                if('Navigate' in this.Parameters){

                    MokianNavigation.Replace(this.Parameters.Navigate,his);

                }

                else{

                    console.warn('Screen No Navigation State', this)
                    
                }
                
            }
            
            else{

                MokianNavigation.To(path||location.hash||$Settings['View:Boot'],his);

            }

        }

        else{ 

            if((`${$Settings['Http:Host']}${path}` != location.href)){

                MokianNavigation.To(path,his);

            }
            
        
        }


        return this;
        
    }


    ChangeView(content){

        let v = this.querySelector('mok-view');

        if(!v){ v = new mViewElement(); this.appendChild(v); }

        // console.log('ChangeView for \n', content)

        v.innerHTML = '';

        v.appendChild(
            
            this.Overlay.Mount(`<div Overlay:View >${content}</div>`) 
            
        );

        return this;

    }


    connectedCallback(){

        this.setAttribute('tabindex', '0');
        
        this.setAttribute('Screen:PiD', `${Mokian.Core.ScreenEntries}`);

        Mokian.Core.ScreenEntries++;

        this.addEventListener('focus',()=>{

            MokianNavigation.Screen = this;
            
        });
        

        // if('@Hook' in this){ this['@Hook'].Dispatch('WhenConnected', [null]); }

    }

    disconnectedCallback(){

        // if('@Hook' in this){ this['@Hook'].Dispatch('WhenDisconnected', [null]); }

    }


}

customElements.define(`mok-screen`, mScreenElement );



/**
 * Mokian Screen Paramaters Element
 */

class mScreenParamsElement extends HTMLElement{

    constructor(){

        super();

        this.Screen;

        this.style.display = 'none';

    }

    connectedCallback(){

        if('@Screen' in this){

            if(this['@Screen'] instanceof HTMLElement){

                const n = this.getAttribute('name');

                const s = this.getAttribute('section')||'';

                const v = this.getAttribute('value')||this.innerHTML||false;

                const ov = this['@Screen'].Overlay;


                const secs = ov.querySelectorAll(`[Ui\\:Section="${s}"]:not(screen-param)`);

                // console.log('New Screen Param', this )



                
                if(s.toLowerCase() == 'header:titlebar'){

                    document.title = MokianTemplate.SetTitle(
                        
                        (v.replace(new RegExp('\n','g'), '')).trim()
                        
                        , $Settings['App:Title']||false
                        
                    );
                    
                }


                if(n == 'ToggleScreen'){

                    const a = this.getAttribute('parameter-sheet')||false;

                    if('$CurrentTemplateBrick' in ov){

                        if(ov.$CurrentTemplateBrick == v){ this.parentNode.removeChild(this); return false; }

                    }

                    this.parentNode.removeChild(this);

                    MokianTemplate.Toggle(
                        
                        this['@Screen']
                        
                        , this['@Screen'].$Template
                        
                        , v
                        
                        , MokianTemplate.$Parameters[a]||null
                        
                    );
                    

                }
                
                
                if(secs.length){

                    Object.values(secs).forEach(sec=>{

                        sec.innerHTML='';

                        sec.innerHTML=v;

                    });
                    
                }

                
            }
            
        }
        
    }

}

customElements.define(`screen-param`, mScreenParamsElement );



/**
 * Mokian View Element
 */

class mViewElement extends HTMLElement{

    
    constructor(){

        super();

        this.Props = arguments;

        // console.log('Mokian View', this)

    }



}

customElements.define(`mok-view`, mViewElement );



export const MokianView = mViewElement;

export const MokianScreen = mScreenElement;

export const MokianScreenParams = mScreenParamsElement;