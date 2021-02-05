import { Mokian, MokianOverlay, MokianProps } from "../core/0.0.4.js";
import MokianHooks from "./hooks.js";





Mokian.Core.Asset.Style('slidebox', '0.0.1');



const overlay = MokianOverlay.Create('slidebox', function(layer){

    const hook = new MokianHooks.Dynamic(layer);

    const props = MokianProps.Define(layer,{});

    const setTitle = (i)=>(layer.Props['provider:hide:title']) ? '' : `

        <div Thumb:Face >

            <mok-glyph name="play-circle" size="7x" Text:Color="One" ></mok-glyph>

        </div>

        <div Thumb:Info Stack:Flex="Row" Stack:HAlign="Start" >

            <div Layout:Box >

                ${i}
                
            </div>

        </div>

    `;

    const _construct = ()=>{


        if('provider' in layer.Props){
            
            layer.Props['provider:order'] = layer.Props['provider:order'] || 'Desc';

            layer.innerHTML = '';

            if(typeof layer.Props.provider == 'string'){

                QiServiceDataStack.Dispatch(layer.Props.provider, ($Data)=>{

                    const _Data = JSON.parse($Data);

                    if('Items' in _Data){
                        
                        let _Items = Object.entries(_Data.Items);

                        if(_Items.length){

                            if('provider:order' in layer.Props){

                                if(layer.Props['provider:order'] == 'Asc'){ _Items = _Items.reverse(); }
                                    
                            }
                            
                        }

                        // layer._construct(_Items);

                        if(_Items.length){

                            Object.values(_Items).forEach((ix)=>{

                                const key = ix[0];

                                const post = ix[1];

                                let _bx = Mokian.Take(`[SlideBox\\:Item="${post.slug}"]`, layer );

                                if(!_bx){

                                    _bx = document.createElement('div');

                                    _bx.setAttribute('SlideBox:Item', `${post.slug}`);

                                    // _bx.setAttribute('Ui:Size', `${layer.Props['height:size']||'x7'}`);

                                    _bx.innerHTML = layer.Mount(`

                                        <div>
                
                                            <div Item:Thumb >
                    
                                                <div Thumb:Back Text:Size="H2" >
                    
                                                    <mok-qi-picture src="${$Settings['Service:Provider:URL']}images/${layer.Props['provider:thumb:path']||''}/${post.thumb||post.logo}" ></mok-qi-picture>
                    
                                                </div>
                    
                                                ${setTitle(post.title||false)}
                    
                                            </div>
                                            
                                        </div>
                                    
                                    `).innerHTML;
                                    

                                    // console.log('Set ', _bx, post.title )

                                    layer.appendChild(_bx);

                                    _bx.style.minWidth = `${layer.Props['width:size']||'256px'}`;
                                    
                                }
                                
                                // const item = document.createElement('div');

                                
                            });
                            
                        }

                        if(!_Items.length){

                            layer.innerHTML = `Aucune Donnée`;

                        }


                    }

                    
                });
                

            }

        }

        else{

            const items = Mokian.Takes(`[SlideBox\\:Item]`, layer);

            if(items.length){
    
                Object.values(items).forEach((i)=>{
    
                    let thu = Mokian.Take(`[Item\\:Thumb]`, i);
    
                    if(!thu){
    
                        i.innerHTML = `
    
                            <div Item:Thumb >
    
                                <div Thumb:Back Text:Size="H2" >
    
                                    <img src="${i.getAttribute('SlideBox:Thumb')}" >
    
                                </div>
    
                                <div Thumb:Face >
    
                                    <mok-glyph name="play-circle" size="5x" Text:Color="One" ></mok-glyph>
                
                                </div>
    
                                <div Thumb:Info Stack:Flex="Row" Stack:HAlign="Start" >
    
                                    <div Layout:Box >
                
                                        ${i.getAttribute('SlideBox:Label')}
                                        
                                    </div>
                
                                </div>
    
                            </div>
                        
                        `;
                        
                    }
    
                    // console.log('Item SLide Is', i)
                    
                })
                
            }
            
        }

    }


    // hook.Listen('WhenReady', ()=>{ })

    _construct();

});



export const MokianSlideBox = overlay;


