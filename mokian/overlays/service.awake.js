
/* ServiceAwake */

import MokianHooks from "./hooks.js";
import { MokianNavigation } from "./navigation.js";

export default class ServiceAwake{

    constructor($Settings){

        this.Settings = $Settings||{};

        this.Settings.Vendor = $Settings.Vendor || (`${$Settings['Vendor:Http:Host'] || './'}ServicesAwake/`);

        this.Settings.Lang = $Settings.Lang || ('Fr-fr');

        // console.log('Set ServicesAwake ///', this.Settings)

    }



    static URLTranscriber($URL, $Data){

        if(typeof $Data == 'object'){

            Object.keys($Data).forEach(($Key)=>{

                $URL = $URL.replace(new RegExp(`%${$Key}%`, 'g'), ($Data[$Key]||'').toString() );

            });
            
        }

        return $URL;
        
    }


    ReadFile($File, $Load = null, $Fail = null, $Progress = null){

        let $Reader = new FileReader();

        $Reader.onload = ()=>{
            
            if(typeof $Load == 'function'){ $Load($Reader); }
        
        };

        $Reader.onprogress = (ev)=>{
            
            if(typeof $Progress == 'function' && ev.lengthComputable === true){$Progress(ev);}
        
        };

        $Reader.onerror = (ev)=>{
            
            if(typeof $Fail == 'function'){$Fail(ev);}
        
        };

        $Reader.readAsDataURL($File);
        
        return this;

    }



    async Send($Features = null){

        $Features = $Features || {};

        $Features.Response = null;

        $Features.Method = $Features.Method || null;

        $Features.Output = $Features.Output || null;

        $Features.ContentType = $Features.ContentType || 'application/json;charset=utf-8';

        $Features.Options = this.SetFetchOptions($Features);

        $Features.Url = $Features.CustomUrl || this.SetFetchURL($Features);


        // if(isElement($Features.Upload)){

        //     $Features.Options.body = new FormData($Features.Upload);

        //     $Features.Listener = await fetch($Features.Url, $Features.Options);

        // }

        // else{


            MokianHooks.Static.Dispatch('Activities:Service:Wait',[{Features: $Features}]);

            $Features.Listener = await fetch($Features.Url, $Features.Options);

        // }


        $Features.Handler = this.SetFetchOutput($Features);
    
        this.SetEvents($Features);

        return $Features;

    }


    EventTrigger($Features, $Name, $Args = null){

        if(typeof $Features[$Name] == 'function'){

            return $Features[$Name].apply($Features, [$Args, $Features]);
            
        }

        return null;

    }


    SaveLocalStorage($Data){

        if(typeof $Data == 'object'){

            Object.keys($Data).forEach((k)=> localStorage.setItem(k,$Data[k]) );
            
        }

        return this;

    }


    GetLocalDatabaseTable($Req, $Table){

        let t = null;

        try { t = $Req.transaction.objectStore($Table); }

        catch(e) { }

        return t;

    }

    
    SetEvents($Features = {}){
        
        $Features.Handler

            .then((r)=>{

                $Features.Response = r;

                this.EventTrigger($Features, 'Complete', r);

                if($Features.Listener.status === 0 || $Features.Listener.status == 200){ 

                    MokianHooks.Static.Dispatch('Activities:Service:200',[{Features: $Features}]);

                    if(typeof r['Awake:Local:Storage'] == 'object'){ this.SaveLocalStorage(r['Awake:Local:Storage']); }
                    
                    (this.EventTrigger($Features, 'Success', r)); 
                
                }
                
                else if($Features.Listener.status == 404){ 
                    
                    MokianHooks.Static.Dispatch('Activities:Service:404',[{Features: $Features}]);

                    (this.EventTrigger($Features, 'Fail', null)); 
                
                }
                
                else{ 
                    
                    MokianHooks.Static.Dispatch(`Activities:Service:${r.status||0}`,[{Features: $Features}]);

                    (this.EventTrigger($Features, 'Error', null)); 
                
                }

                return r;

            })
        
            .catch(($e)=>{

                MokianHooks.Static.Dispatch(`Activities:Service:Error`,[{Features: $Features, Detail: $e}]);

                if('ActiveServiceUi' in $Features){

                    if($Features.ActiveServiceUi === true){

                        let scrn = MokianNavigation.CurrentScreen();

                        if(scrn instanceof HTMLElement){
        
                            setTimeout(()=>{ 
        
                                scrn.ChangeView(`
            
                                    <mok-fx  in="fx.fade.in" out="fx.fade.out" ></mok-fx>
            
                                    <screen-param name="ToggleScreen" value="Empty" parameter-sheet="Landing" ></screen-param>
            
                                    <div Stack:Flex="Column" Stack:Align="Center" Bg:Color="Error" Text:Color="ErrorText" class="width-v10 height-v10">
                                    
                                        <mok-glyph name="chart-network" size="5x"></mok-glyph>
                                    
                                        <div Ui:Content >
            
                                            <h3>Echec Service</h3>
            
                                            ${(typeof $e == 'object') ? JSON.stringify($e) : $e}
                                    
                                        </div>
            
                                    </div>
                                
                                `);
                                
                            }, this.TransitionTimeOut||300);
        
                            // return false;
                            
                        }
                        
                    }
                
                }


                console.trace('--- Mokian Service Awake Error :\n', $e);

                this.EventTrigger($Features, 'Error', $e);

            })

        ;

        return $Features;

    }


    SetFetchHeaders($Features){

        let $Headers = new Headers();

        // 'Content-Type': 'application/x-www-form-urlencoded'

        $Features.Headers = Object.assign({
            
            'Content-Type':$Features.ContentType.toString()
            
            ,"API-KEY":this.Settings.APIKey

            ,"API-CLIENT-LANG":this.Settings.Lang
        
        }, $Features.Headers);

        Object.keys($Features.Headers).forEach(($k)=> $Headers.append($k,$Features.Headers[$k]) )
        
        return $Headers;

    }


    SetFetchOptions($Features){

        let $Headers = this.SetFetchHeaders($Features);
        
        return {
               
            method:($Features.Method || 'GET').toUpperCase(),
            
            mode:'cors',
            
            cache:$Features.Cache||'no-cache',
            
            credentials:$Features.Credentials||'same-origin',
            
            headers:$Headers,
            
            redirect:$Features.Redirect||'follow',
            
            referrerPolicy:$Features.ReferrerPolicy||'unsafe-url'
            
        };

    }


    SetFetchURL($Features){

        let $URL = $Features.Url||(`${this.Settings.Vendor}/${$Features.Name||''}`)


        $Features.Data = typeof $Features['Data'] == 'object' ? $Features.Data : {};

        if($Settings['App:iD']){ $Features.Data['App:iD'] = $Settings['App:iD']; }

        if($Settings['App:Version']){ $Features.Data['App:Version'] = $Settings['App:Version']; }

        if($Settings['App:PiD']){ $Features.Data['App:PiD'] = $Settings['App:PiD']; }



        switch( $Features.Method.toString().toUpperCase() ) {

            case 'GET':

                let $Param = [];

                if($Features.Data && typeof $Features.Data == 'object'){

                    Object.keys($Features.Data).forEach(($k)=> {

                        if(typeof $Features.Data[$k] == 'string'){

                            $Param[$Param.length] = `${$k}=${encodeURIComponent($Features.Data[$k])}` 

                        }
                        
                    });

                }

                $URL = `${$URL}${($URL.indexOf('?') >= 0 ) ? '&' : '?'}${$Param.join('&')}&send-now=done`;

            break;

            default:

                $Features.Options.body = $Features.FormData || JSON.stringify($Features.Data);

            break;
            
        }

        return $URL;

    }



    async SetFetchOutput($Features){

        switch($Features.Output){

            case ':ArrayBuffer': return $Features.Listener.arrayBuffer(); break;
            
            case ':Blob': return $Features.Listener.blob(); break;

            case ':Text': return $Features.Listener.text(); break;

            case ':FormData': return $Features.Listener.getFormData(); break;

            case null: return $Features.Handler; break;
            
            case ':Json': default: return $Features.Listener.json(); break;

        }

    }
    


    async Get($f = null){

        $f = typeof $f == 'object' ? $f : {}; $f.Method = 'GET';

        return await this.Send($f);

    }
    


    async Post($f = null){

        $f = typeof $f == 'object' ? $f : {}; $f.Method = 'POST';

        return await this.Send($f);

    }
    


    async Put($f = null){

        $f = typeof $f == 'object' ? $f : {}; $f.Method = 'PUT';

        return await this.Send($f);

    }
    


    async Delete($f = null){

        $f = typeof $f == 'object' ? $f : {}; $f.Method = 'DELETE';

        return await this.Send($f);

    }
    


    async Toggle($f = null){

        $f = typeof $f == 'object' ? $f : {}; $f.Method = 'TOGGLE';

        return await this.Send($f);

    }
    


    async Options($f = null){

        $f = typeof $f == 'object' ? $f : {}; $f.Method = 'OPTIONS';

        return await this.Send($f);

    }
    


    async Patch($f = null){

        $f = typeof $f == 'object' ? $f : {}; $f.Method = 'PATCH';

        return await this.Send($f);

    }
    


    async Dispatch($f = null){

        $f = typeof $f == 'object' ? $f : {}; $f.Method = 'DISPATCH';

        return await this.Send($f);

    }
    


    async Head($f = null){

        $f = typeof $f == 'object' ? $f : {}; $f.Method = 'HEAD';

        return await this.Send($f);

    }
    


    async Connect($f = null){

        $f = typeof $f == 'object' ? $f : {}; $f.Method = 'CONNECT';

        return await this.Send($f);

    }
    


    async Trace($f = null){

        $f = typeof $f == 'object' ? $f : {}; $f.Method = 'TRACE';

        return await this.Send($f);

    }
    



}

