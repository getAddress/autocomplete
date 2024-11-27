Javascript - Autocomplete.

## Install

###  From NPM
```
npm install getaddress-autocomplete
```
### Or CDN
```
<script src="https://cdn.getaddress.io/scripts/getaddress-autocomplete-2.0.2.min.js"></script>
```

## Usage
```
  <label>Address Line 1</label>
  <div><input id="line1" type="text"></div>

  <label>Address Line 2</label>
  <div><input id="line2" type="text"></div>

  <label>Address Line 3</label>
  <div><input id="line3" type="text"></div>

  <label>Address Line 4</label>
  <div><input id="line4" type="text"></div>

  <label>Address Line 5</label>
  <div><input id="line5" type="text"></div>

  <label>Postcode</label>
  <div><input id="postcode" type="text"></div>
  
  <script>
    const autocomplete = getAddress.autocomplete("line1","API Key");
    
    autocomplete.addEventListener("getaddress-autocomplete-address-selected", function(e){
      document.getElementById('line1').value = e.address.formatted_address[0];
      document.getElementById('line2').value = e.address.formatted_address[1];
      document.getElementById('line3').value = e.address.formatted_address[2];
      document.getElementById('line4').value = e.address.formatted_address[3];
      document.getElementById('line5').value = e.address.formatted_address[4];
      document.getElementById('postcode').value = e.address.postcode;
    })
  </script>
```
## Options
The full list of options, and their defaults:
```
getAddress.autocomplete(
        'textbox_id',
        'API_KEY',
        /*options*/{
          id_prefix:'getAddress-autocomplete' ,  /* The id of the textbox and list container */
          css_prefix:'getAddress_autocomplete',  /* The class name prefix */
          delay:200, /* millisecond delay between keypress and API call */
          minimum_characters:2,  /* minimum characters to initiate an API call */
          clear_list_on_select:true, /* if true, clears list on suggestion selected */
          select_on_focus:true,  /* if true, highlights textbox characters on focus*/
          show_all_for_postcode:false, /* if true, shows all addresses for postcode*/
          show_all_for_postcode_text:'Show all..',  /* show all suggestion text*/
          alt_autocomplete_url:undefined,  /* alterative local autocomplete URL (when API key is not used) */
          alt_get_url:undefined,  /* alterative local get URL (when API key is not used) */
          input_class_names:[],  /* textbox class names */
          list_class_names:[],  /* list class names */
          list_show_all_class_names:[], /* list show all class names */
          container_class_names:[], /* container class names */
          container_focused_class_names:[], /* container focused class names */
          suggestion_class_names:[], /* suggestion class names */
          suggestion_show_all_class_names:[], /* suggestion show all class names */
          highlight_suggestion:true, /* if true, highlights matched suggestion text */
          highlight_suggestion_start_tag:'<b>',  /* highlighted suggestion text start tag */
          highlight_suggestion_end_tag:'</b>',  /* highlighted suggestion text end tag */
          list_width:undefined,   /* if true, set the list width */
          suggestion_count:6, /* number of retreived suggestions */
          auto_calc_list_height:true,   /* if true, calculates the list's height */
          suggestion_template:undefined, /* the suggestion template (see Autocomplete API)*/
          filter:undefined, /* the suggestion filter (see Autocomplete API)*/
          input_focus_on_select:true,  /* if true, sets the focus to the textbox after selecting an address*/
          debug:false, /* if true, logs behavior */
          enable_get:true, /* if true, retreives address on select */,
          full_screen_on_mobile:true, /* if true, opens full screen on mobile devices*/;
          max_mobile_screen_width:500, /* max mobile screen width*/;
          full_screen_options:undefined /* full screen display options*/

        }
    );
```
## Events
```
document.addEventListener("getaddress-autocomplete-suggestions", function(e){
    console.log(e.suggestions);
})

document.addEventListener("getaddress-autocomplete-suggestions-failed", function(e){
    console.log(e.status);
    console.log(e.message);
})

document.addEventListener("getaddress-autocomplete-address-selected", function(e){
    console.log(e.address);
})

document.addEventListener("getaddress-autocomplete-find-selected-failed", function(e){
    console.log(e.status);
    console.log(e.message);
})
```
