
export default class MokianFormData{

    constructor(form){

        this.Form = form;

        this.Transaction = null;


        if(this.Form instanceof HTMLElement){

            let d={};
            
            Object.values(this.Form.elements).forEach((el)=>{

                let $n = (el.name||'');

                let $t = (el.type||'').toLowerCase();

                if($n){

                    if(el.multiple){

                        if($t == 'checkbox'){

                            d[$n] = d[$n]||[];

                            d[$n][d[$n].length] = encodeURIComponent(el.value);

                        }

                        else if('selectedOptions' in el){

                            if(el.selectedOptions.length >= 1){
            
                                d[el.name] = d[el.name]||[];
            
                                Object.values(el.selectedOptions).forEach((op)=> d[el.name].push(encodeURIComponent(op.value)) );
                                
                            }
                            
                        }

                        else{

                            let $ne = this.Form.querySelectorAll(`${el.tagName}[type="${el.type}"]`);

                            if($ne){

                                d[el.name] = d[el.name]||[];
            
                                Object.values($ne).forEach(($nd)=> d[el.name].push(encodeURIComponent($nd.value)) );
                                
                            }

                        }
                        
                    }

                    else{ 

                        if($t == 'checkbox' || $t == 'radio'){

                            if(el.checked){

                                d[el.name] = (el.value) ? encodeURIComponent(el.value) : 'on'; 

                            }

                        }

                        else{
                            
                            d[el.name] = encodeURIComponent(el.value); 

                        }
                        
                    
                    }

                }

            });
 
            this.Transaction = d;

        }


    }

    toObject(){return this.Transaction||{};}

}
