import { Mokian, MokianOverlay, MokianProps, MokianState } from "../core/0.0.4.js";
import { MokianModal } from "./modal.js";
import { MokianOverlayCreateScene, MokianOverlayScene } from "./overlay.scenes.js";
import MokianFormData from "./formdata.js";
import { ServicesAwakeController } from "./service.awake.controller.js";
import ServiceAwake from "./service.awake.js";
import { MokianNavigation } from "./navigation.js";




Mokian.Core.Asset.Style('button', '0.0.1');


const overlay = MokianOverlay.Create('form', function(layer){

    const modalWait = (new MokianOverlay.Elements['modal']);

        modalWait.setAttribute('Mode', 'Float');

        modalWait.setAttribute('Status', 'Close');

        modalWait.setAttribute('Locked', '1');

        
        
        
        const modalDial = (new MokianOverlay.Elements['modal']);
        
        modalDial.setAttribute('Mode', 'Float');
        
        modalDial.setAttribute('Status', 'Close');
        
        // modalDial.setAttribute('Locked', '1');
        



    const waitBox = (txt)=>`

        <mok-dialbox >

            <div Ui:Content="" Stack:Flex="Column" Stack:Align="Center" >

                <mok-glyph name="circle-notch spin" size="2x" ></mok-glyph>

                <div Text:Size="x1" class="">${txt||''}</div>

            </div>

        </mok-dialbox>
        
    `;


    const messageBox = (type, label = '', txt = '', glyph = null)=>`

        <mok-dialbox label="${label||'Information'}" glyph="comment-alt-lines" can:close >

            <div Ui:Content="" Stack:Flex="Column" Stack:Align="Center" >

                <div Text:Color="${type||'Error'}" class=""><mok-glyph name="${glyph||'exclamation-circle'}" size="3x" ></mok-glyph></div>

                <div Ui:Content Text:Size="x3" class="">${txt||''}</div>

            </div>

        </mok-dialbox>

    `;

    
    const setWait = (txt)=>{

        modalWait.setAttribute('Status', 'Open');

        modalWait.innerHTML = waitBox(txt);

        layer.appendChild(modalWait);

    }


    const setMessage = (type, label = '', txt = '', glyph = null)=>{

        modalWait.setAttribute('Status', 'Close');

        modalDial.setAttribute('Status', 'Open');

        modalDial.innerHTML = messageBox(type, label, txt, glyph);

        layer.appendChild(modalDial);

    }

    
    const hook = new MokianHooks.Dynamic(layer);

    const props = MokianProps.Define(layer, { });

    const state = MokianState.Define(layer, {});


    layer.LockField = ()=>{

        Object.values(layer.FormLayer.elements).forEach((input)=>{

            if(input.getAttribute('disabled') && input.getAttribute('origin:disabled') == 'Active'){  }

            else{ input.setAttribute('disabled', '1'); }

        });
        
        return this;
        
    };
    

    layer.UnlockField = ()=>{

        Object.values(layer.FormLayer.elements).forEach((input)=>{

            if(input.getAttribute('origin:disabled')){  }

            else{ input.removeAttribute('disabled'); }

        });

        return this;
        
    };
    

    hook.Listen('WhenReady', (ev)=>{

        const init = MokianOverlayCreateScene(layer);

        const f = Mokian.Take('form');


        if('Section' in init){

            f.appendChild(init.Section);

            layer.Scenes = new MokianOverlayScene(init);

        }

        f.onsubmit = (ev)=>{

            let meth = (layer.Props.method||layer.Props['service:method']||'Get');

            
            meth = `${meth[0].toUpperCase()}${meth.substr(1).toLowerCase()}`;
            
            layer.LockField();

            setWait('Traitement en cours...');

            ServicesAwakeController[meth]({

                Name: layer.Props['service:name']||'Public'

                ,Data: new MokianFormData(f).Transaction

                ,Output: ':Json'

                ,Success: ($Json)=>{

                    console.log('Success Data', $Json)

                    if($Json.Response === true){

                        let goto;

                        setMessage(
                            
                            'Success'
                            
                            , `${$Json.Title||'Erreur inconnue'}`
                            
                            , `${$Json.About||'Erreur inconnue'}`
                            
                            , 'check-circle'
                            
                        );

                        if(layer.Props['service:done:link']){

                            goto = ServiceAwake.URLTranscriber(layer.Props['service:done:link'], $Json);

                            setTimeout(()=>location.href=goto,360);
                            
                        }

                        if(layer.Props['service:done:view']){

                            goto = ServiceAwake.URLTranscriber(layer.Props['service:done:view'], $Json);

                            setTimeout(()=>MokianNavigation.Go(goto),360);
                            
                        }

                    }
                    
                    else{

                        setMessage(
                            
                            'Warning'
                            
                            , `${$Json.Title||'Erreur inconnue'}`
                            
                            , `${$Json.About||'Erreur inconnue'}`
                            
                            , 'exclamation-triangle'
                            
                        );

                    }

                }

                ,Error: ($Er)=>{

                    setMessage('Error', 'Erreur Observée', $Er, 'exclamation-circle');

                    // console.error('Error ', $Er)

                }

                ,Fail: ($Fa)=>{

                    setMessage('Warning', 'Echec Observée', $Fa, 'exclamation-triangle');

                    // console.log('Fail', $Fa)

                }

                ,Complete:($Res)=>{

                    layer.UnlockField();

                }
                
            });

            return false;

        };


        layer.FormLayer = f;


    });

    return layer.View(`

        <form Form:Container Stack:Flex="Column" action="#" method="post" onsubmit="return false;" >

            ${layer.innerHTML}

        </form>
    
    `);

});


export const MokianForm = overlay;