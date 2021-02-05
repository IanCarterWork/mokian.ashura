
window.MokianHooks = {};


MokianHooks.Static = {

	$State : []

	, Listen: function($Slugs, $Fn){

		Object.values($Slugs.split(' ')).forEach(($Slug)=>this.$State[this.$State.length]={Slug:$Slug, Fn:$Fn});

		return this;

	}

	, Dispatch: function($Slug, $Args = null, $Element = null){

		if(this.$State.length > 0){

            let sx = [];

            this.$State.forEach((State)=>{

                if(State.Slug == $Slug){

                    if(typeof State.Fn == 'function'){

                        let fk = `${$Slug}@${State.Fn.toString()}`;

                        // if(!(fk in sx)){

                            sx[fk] = true;

                            State.Fn.apply($Element||document,$Args);
                    
                        // }

                    }

                }

            });
			
		}

		return this;

	}

};


MokianHooks.Dynamic = class{

    constructor($Host = null){

        if($Host instanceof HTMLElement){

            this.$Host = $Host||this;

            this.$State = {};
            
            $Host['@Hook'] = $Host['@Hook']||this;

        }
        
    }

    Listen($Slugs, $Fn){
        
        Object.values($Slugs.split(' ')).forEach(($Slug)=>{

            let k = `${$Slug}@${$Fn}`;

			this.$State[k] = {Slug:$Slug, Fn:$Fn};

		});

		return this;

    }
    
	Dispatch($Slug, $Args = null){

        let $State = Object.values(this.$State);

		if($State.length > 0){

            $State.forEach((State)=>{

                if(State.Slug == $Slug){

                    if(typeof State.Fn == 'function'){

                        State.Fn.apply(this.$Host,$Args);
                
                    }

                    
                }
                
            });
			
        }
        
        // MokianHooks.Static.Dispatch(`@${$Slug}`, [{'@Target': this, Args: $Args}])

		return this;

	}

}


export default MokianHooks;