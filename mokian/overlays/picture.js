
import { MokianOverlay, MokianProps } from "../core/0.0.4.js";
import MokianHooks from "./hooks.js";






const overlay = MokianOverlay.Create('picture', function(layer){

    const props = MokianProps.Define(layer, { });

    const hook = new MokianHooks.Dynamic(layer);

    const UpdateUi = (status = false)=>{


        if('src' in layer.Props){

            let img = document.createElement('img');

            img.style.opacity = '.0';
            
            img.style.transition = 'opacity 360ms ease-out';

            img.onload = ()=>{

                if('caches' in window){

                    caches.open('mokian.qi.pictures').then(c=> c.add(layer.Props.src) );

                    setTimeout(()=>{
    
                        layer.appendChild(layer.View(img));
    
                        setTimeout(()=> img.style.opacity = '1' , 60);
    
                        hook.Dispatch('WhenLoaded', [{Target:img}])
        
                    },60);
    
                }
                
            };
            
            img.onerror = ()=>{

                setTimeout(()=>{

                    layer.appendChild(
                        
                        layer.View(`<mok-glyph name="image" style="opacity:.5" size="3x"></mok-glyph>`)
    
                    );
    
                },30);

            };

            img.src = layer.Props.src;
            
        }

    }

    let isReady = false;
    
    hook.Listen('WhenReady', (ev)=> UpdateUi(false) );

    hook.Listen('WhenPropsChanged', (ev)=> UpdateUi(true) );

    return layer.View(`

        <mok-glyph name="circle-notch spin" size="lg"></mok-glyph>

    `);


});




export const MokianPicture = overlay;

