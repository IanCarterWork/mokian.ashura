
import { Mokian, MokianOverlay, MokianProps, MokianState } from "../core/0.0.4.js";

import MokianHooks from "./hooks.js";



Mokian.Core.Asset.Style('activities.tasks', '0.0.1');

const overlay = MokianOverlay.Create('activities-tasks', function(layer){

    const props = MokianProps.Define(layer, { });

    const hook = new MokianHooks.Dynamic(layer);

    // const UpdateUi = ()=>{

    //     if('sync:service' in layer.Props){



    //     }

    // };


    let wait,accept,reject;


    MokianHooks.Static.Listen('Activities:Service:Wait',(ev)=>{

        wait = new MokianOverlay.Elements['glyph'];

        wait.setAttribute('name', 'circle-notch spin');

        wait.setAttribute('gstyle', 'fas');

        wait.setAttribute('Activity:Task', 'Wait');
        
        layer.appendChild(layer.View(wait));
        
    });
    


    MokianHooks.Static.Listen('Activities:Service:200',(ev)=>{

        accept = new MokianOverlay.Elements['glyph'];

        accept.setAttribute('name', 'check-circle');

        accept.setAttribute('Activity:Task', 'Found');

        // accept.setAttribute('Text:Color', 'Success');
        
        layer.appendChild(layer.View(accept));

        // layer.innerHTML = '';

    });
    
    


    MokianHooks.Static.Listen('Activities:Service:Error',(ev)=>{

        reject = new MokianOverlay.Elements['glyph'];

        reject.setAttribute('name', 'exclamation-circle');

        reject.setAttribute('Activity:Task', 'Error');
        
        layer.appendChild(layer.View(reject));
        
        console.warn('Error', ev)
        
    });
    

    // hook.Listen('WhenReady', (ev)=> hook.Listen('WhenPropsChanged', ()=> UpdateUi() ) );
    
    return layer.View(``);


});

export const MokianActivitiesTasks = overlay;

