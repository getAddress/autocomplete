export class OutputFields{
    formatted_address_0:string="";
    formatted_address_1:string="formatted_address_1";
    formatted_address_2:string="formatted_address_2";
    formatted_address_3:string="formatted_address_3";
    formatted_address_4:string="formatted_address_4";
    line_1= "line_1";
    line_2= "line_2";
    line_3= "line_3";
    line_4 = "line_4";
    town_or_city= "town_or_city";
    county= "county";
    country= "country";
    postcode= "postcode";
    latitude= "latitude";
    longitude= "longitude";
    building_number= "building_number";
    building_name= "building_name";
    sub_building_number= "sub_building_number";
    sub_building_name= "sub_building_name";
    thoroughfare= 'thoroughfare'; 
    locality = "locality";
    district = "district";
    residential = "residential"

    constructor(outputFields:IOutputFields = {})
    {
        for (const prop in outputFields) {
            if (outputFields.hasOwnProperty(prop) && typeof outputFields[prop] !== 'undefined') {
                this[prop] = outputFields[prop];
            }
        }
    }
}
         
export interface IOutputFields{
    formatted_address_0?:string;
    formatted_address_1?:string;
    formatted_address_2?:string;
    formatted_address_3?:string;
    formatted_address_4?:string;
    line_1?:string;
    line_2?:string;
    line_3?:string;
    line_4?:string;
    town_or_city?:string;
    county?:string;
    country?:string;
    postcode?:string;
    latitude?:string;
    longitude?:string;
    building_number?:string;
    building_name?:string;
    sub_building_number?:string;
    sub_building_name?:string;
    thoroughfare?:string;
    locality?:string;
    district?:string;
    residential?:string;
}