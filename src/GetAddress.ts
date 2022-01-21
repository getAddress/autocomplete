import Autocomplete from "./Autocomplete";
import { IOptions, Options } from "./Options";
import Client from 'getaddress-api';
import { IOutputFields,OutputFields } from "./OutputFields";
import Style from "./Style";
import AttributeValues from "./AttributeValues";

let index = 0;

export function autocomplete(id:string,api_key:string,output_fields?:IOutputFields, options?: IOptions){

    const textbox = document.getElementById(id) as HTMLInputElement;
    
    if(!textbox){
        return;
    }
    const client = new Client(api_key);
    const outputFields = new OutputFields(output_fields);

    const allOptions = new Options(options);
    const attributeValues = new AttributeValues(allOptions,index);
    
    const autocomplete = new Autocomplete(textbox,client,outputFields,attributeValues);
    autocomplete.build();
    if(index === 0){
        const style = new Style(attributeValues);
        style.inject();
    }
    index+=1;
}