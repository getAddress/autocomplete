import Autocomplete from "./Autocomplete";
import { IOptions, Options } from "./Options";
import Client from 'getaddress-api';
import { IOutputFields,OutputFields } from "./OutputFields";
import Style from "./Style";
import AttributeValues from "./AttributeValues";

class InstanceCounter
{
    private static index = 0;
    static Next(){
        const returnValue =  InstanceCounter.index;
        InstanceCounter.index+=1;
        return returnValue;
    }
}

export function autocomplete(id:string,api_key:string,output_fields?:IOutputFields, options?: IOptions){

    const textbox = document.getElementById(id) as HTMLInputElement;
    
    if(!textbox){
        return;
    }
    const allOptions = new Options(options);
    const client = new Client(api_key, allOptions.alt_autocomplete_url,allOptions.alt_get_url);
    const outputFields = new OutputFields(output_fields);

    const index = InstanceCounter.Next();

    const attributeValues = new AttributeValues(allOptions,index);
    
    const autocomplete = new Autocomplete(textbox,client,outputFields,attributeValues);
    autocomplete.build();
    if(index === 0){
        const style = new Style(attributeValues);
        style.inject();
    }
    
}