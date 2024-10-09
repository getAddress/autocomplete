import Autocomplete from "./Autocomplete";
import { Options } from "./Options";
import Client from 'getaddress-api';
import Style from "./Style";
import AttributeValues from "./AttributeValues";
import { modal, isTouchEnabled,screenWidth, Options as FSoptions } from "getaddress-autocomplete-modal";
import { AddressSelectedEvent, SuggestionsEvent,AddressSelectedFailedEvent,SuggestionsFailedEvent  } from "./Events";

class InstanceCounter
{
    public static instances:Autocomplete[] = [];

    static add(autocomplete:Autocomplete){
        this.instances.push(autocomplete);
    }

}

function autocomplete(id:string,api_key:string, options: Partial<Options>)
{

    if(!id){
        return;
    }
    
    let textbox = document.getElementById(id) as HTMLInputElement;
    if(!textbox){
        textbox = document.querySelector(id) as HTMLInputElement;
    }
    if(!textbox){
        return;
    }
    
    const fullOptions = new Options(options);
    
    const client = new Client(api_key, fullOptions.alt_autocomplete_url,fullOptions.alt_get_url);
    
    const index = InstanceCounter.instances.length;

    const attributeValues = new AttributeValues(fullOptions,index);
    
    if(fullOptions.full_screen_on_mobile && screenWidth() <= fullOptions.max_mobile_screen_width && isTouchEnabled())
    {
        var fsOptions=  new FSoptions(fullOptions.full_screen_options);

        fsOptions.max_screen_width = fullOptions.max_mobile_screen_width;
        fsOptions.debug = fullOptions.debug;
        fsOptions.alt_autocomplete_url = fullOptions.alt_autocomplete_url;
        fsOptions.alt_get_url = fullOptions.alt_get_url;
        fsOptions.suggestion_count = fullOptions.suggestion_count;

        if(!fsOptions.filter)
        {
            fsOptions.filter = fullOptions.filter;
        }
        if(!fsOptions.placeholder)
        {
            fsOptions.placeholder = textbox.placeholder;
        }

        const modalInstance = modal(id,api_key, fsOptions);
        if(modalInstance)
        {
            modalInstance.addEventListener("getaddress-autocomplete-modal-suggestions", function(e:any){
                SuggestionsEvent.dispatch(textbox,e.data,e.suggestions);
            });
        
            modalInstance.addEventListener("getaddress-autocomplete-modal-selected", function(e:any){
                AddressSelectedEvent.dispatch(textbox,e.id,e.address);
            });

            modalInstance.addEventListener("getaddress-autocomplete-modal-selected-failed", function(e:any){
                AddressSelectedFailedEvent.dispatch(textbox,e.id,e.status,e.message);
            });

             modalInstance.addEventListener("getaddress-autocomplete-modal-suggestions-failed", function(e:any){
                SuggestionsFailedEvent.dispatch(textbox,e.id,e.status,e.message);
            });

            return textbox;
        }
    }



    const autocomplete = new Autocomplete(textbox,client,attributeValues);
    
    if(index === 0){
        const style = new Style(attributeValues);
        style.inject();
    }
    
    InstanceCounter.add(autocomplete);

    return textbox;
}

function destroy()
{
    for(const instance of InstanceCounter.instances){
        instance.destroy();
    }
    InstanceCounter.instances = [];
}

export {autocomplete, destroy,Options};