
import { Mokian, MokianOverlay, MokianProps, MokianState } from "../core/0.0.4.js";
import { MokianNavigation } from "./navigation.js";

Mokian.Core.Asset.Style('sidebox', '0.0.1');


const overlay = MokianOverlay.Create('sidebox', function(layer){

    const content = layer.innerHTML;

    const props = MokianProps.Define(layer, {

    });

    const state = MokianState.Define(layer,{

        Label: layer.Props.label

    });


    layer.ToggleStatus = (_,org)=>{

        let scrn = MokianNavigation.CurrentScreen();

        let view = scrn.querySelector('mok-view');

        let status = layer.getAttribute('Status');

        // console.log('SideBox status', status)

        if(!status){

            let area = document.createElement('div');

            area.setAttribute('Ui:Sidebox:Area', 'Float');
            
            area.innerHTML = content;
            
            // console.log('SideBox ', area)
            
            layer.setAttribute('Status', 'Open');

            view.appendChild(area);
            
        }
        
        else{
            
            layer.removeAttribute('Status');
            
        }

    };
    

    return layer.View(`

        <div Ui:Sidebox >

            <a href="javascript:void(0)" @Click="this.ToggleStatus" >
                
                <mok-glyph name="${layer.Props.glyph||'bars'}" gstyle="fal" size="2x"></mok-glyph>

            </a>

        </div>

    `);


});




export const MokianSideBox = overlay;
