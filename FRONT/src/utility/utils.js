
export function ConvertCollectionInKeyValueArray(collection, keyProperty, labelProperty) {
    let arr = [];
    if(collection==undefined){return arr;}

    for (let i = 0; i < collection.length; i++)
    {
        arr.push({
            value: collection[i][keyProperty],
            label: collection[i][labelProperty],
        });
    }
    return  arr;
};


export function FindFieldInArray(arr, id,field) {
    if(arr==undefined){return '';}
    for (let i = 0; i < arr.length; i++)
    {
        if(arr[i].id==id){
            return arr[i][field];
        }
    }
    return  '';
};

export function getObjectFromCollection(arr, field,value) {
    if(arr==undefined){return {};}
    for (let i = 0; i < arr.length; i++)
    {
        if(arr[i][field]==value){
            return arr[i];
        }
    }
    return  {};
};

export function ParseToString(val){
    if (val == null) {
        return null;
    } else if (typeof val == 'string') {
        return val;
    } else {
        return val.toString();
    }
};




export function NumberFormat(number, decimals, dec_point, thousands_sep) {
    number = number * 1; //makes sure `number` is numeric value
    var str = number.toFixed(decimals ? decimals : 0).toString().split('.');
    var parts = [];
    for (var i = str[0].length; i > 0; i -= 3) {
        parts.unshift(str[0].substring(Math.max(0, i - 3), i));
    }
    str[0] = parts.join(thousands_sep ? thousands_sep : ',');
    str = str.join(dec_point ? dec_point : '.')
    str = str.replace("-.","-");
    return  str;
};


export function FormatedToNumber(numberFormated) {
    if(numberFormated==null || numberFormated===undefined){
        return 0;
    }
    let number;
    number = ParseToString(numberFormated).replace('.','').replace('.','').replace('.','').replace('.','').replace('.','').replace('.','').replace('.','').replace('.','').replace('.','').replace('.','').replace('.','').replace(',','.');
    number = ParseToString(number).replace("$").replace("%").replace("USD").replace("ARS");
    number = parseFloat(number);
    return number
};



export const COLORS = {
    PRIMARY: '#ff8c00',
    PRIMARY_DEGR: '#fcc7e6',
    LABEL: '#FE2472',
    INFO: '#2CA8FF',
    INFO_LIGHT: '#89c8fc',
    INFO_DARK: '#157fc8',
    ERROR: '#FF3636',
    ERROR_LIGHT: '#fababa',
    SUCCESS_LIGHT: '#d3efda',
    SUCCESS: '#18ce0f',
    SUCCESS_DARK: '#155724',
    WARNING: '#FFB236',
    WARNING_LIGHT: '#fce6cb',
    SECONDARY: '#013A58',
    ORANGE:'#eb8034',
    PRIMARY_DARKER : '#013A58',
    PRIMARY_LIGHT : 'rgba(55, 66, 74, 0.2)',
    PRIMARY_MEDIUM : 'rgba(55, 66, 74, 0.5)',
    NEUTRAL: 'rgba(255,255,255,0.2)',
    TABS: 'rgba(222, 222, 222, 0.3)',
    TEXT: '#32325D',
    MUTED: '#8898AA',
    INPUT: '#DCDCDC',
    INPUT_SUCCESS: '#1be611',
    INPUT_ERROR: '#ff3636',
    ACTIVE: '#f96332',
    BUTTON_COLOR: '#9C26B0',
    PLACEHOLDER: '#9FA5AA',
    THUMB_SWITCH_ON: '#f96332',
    SWITCH_ON: '#f96332',
    SWITCH_OFF: '#898989',
    GRADIENT_START: '#6B24AA',
    GRADIENT_END: '#AC2688',
    PRICE_COLOR: '#EAD5FB',
    BORDER_COLOR: '#E7E7E7',
    BLOCK: '#E7E7E7',
    ICON: '#172B4D',
    ICON_INPUT: '#555555',
    HEADER: '#2c2c2c',
    BORDER: '#CAD1D7',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    TWITTER: '#55acee',
    FACEBOOK: '#3b5998',
    DRIBBBLE: '#ea4c89',
    LINKEDIN: '#0077B5',
    PINTEREST: '#cc2127',
    YOUTUBE: '#e52d27',
    TUMBLR: '#35465c',
    GITHUB: '#333333',
    BEHANCE: '#1769ff',
    REDDIT: '#ff4500',
    GOOGLE: '#dd4b39',
    GRAY: '#4f4f4f',
    GRAY_LIGHT: '#c8c8c8',
    MODERN_BLUE: '#0071bc',
    MODERN_ORANGE: '#fb8500',
    MODERN_GREEN: '#98da1f',
    MODERN_RED: '#b21e35',
    MODERN_BLUE_LIGHT : 'rgba(0, 113, 188, 0.2)',

};


