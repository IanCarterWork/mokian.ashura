export default ServiceAwakeAction = function(e){
        
    let $Config = {}, $Activity, $Messager, params = G('service-param', e);

    $Config.Name = e.attr('Service:Name');

    $Config.Method = e.attr('Service:Method')||'Get';
    
    $Config.Continue = e.attr('Service:Continue');

    $Config.CustomUrl = e.attr('Service:Custom:Url');

    $Config.Params = {};


    if(typeof MokActivityElement == 'function'){

        $Activity = new MokActivityElement();

        G('body').appendChild($Activity);

        $Activity .attr('name', 'service-awake-activity') .attr('type', ':wait') .attr('opacity', '.75') ;

        $Activity.Open(':wait', `<span class="fad fa-3x fa-circle-notch fa-spin"></span>`);

    }

    if(isElement(params)){
            
        params.each(function(){
            
            $Config.Params[this.attr('name')||''] = encodeURIComponent(this.attr('value')||this.innerHTML);

        });

    }



    return ServicesAwakeAPI[$Config.Method]({
    
        Name: $Config.Name||'Public'

        , CustomUrl: $Config.CustomUrl || false

        , Data: $Config.Params

        , Output: ':Json'

        , Success : ($Data)=>{

            let url = $Config.Continue||(`${$Settings['View:Current']}${location.search}`);
            
            console.log('Data :', $Data)

            url = ServicesAwake.URLTranscriber(url, $Data);

            if($Data.Response === true){

                setTimeout(()=>Mokian.Path(url,true),360);

            }

            else{ }

        }
        
        , Fail : (Fail)=>{ }

        , Error : (Err)=>{ }

        , Complete : (ev, $Feat)=>{

            if(isElement($Activity)){

                $Activity.attr('status', ':close');

            }

        }
            
    });

     
}