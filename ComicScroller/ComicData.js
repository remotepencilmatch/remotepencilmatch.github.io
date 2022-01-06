Enum_ImageSide = {
    RIGHT: 'R',
    TOP: 'T',
    LEFT: 'L',
    BOTTOM: 'B',

    /**
     * @param {string} string_val 
     * @param {Enum_ImageSide} defualt 
     * @returns {Enum_XY} 
     */
    Enum_GetFromString(string_val, Enum_defualt){
        if(string_val == null || typeof string_val !== 'string'){
            console.log("Enum_ImageSide.Enum_GetFromString() invalid input");
            return Enum_defualt;
        }
        string_val = string_val.trim().toUpperCase();
        switch(string_val){
            default:
                console.log("Enum_ImageSide.Enum_GetFromString() invalid input [" + string_val + "]");
                return Enum_defualt;

            case 'RIGHT':
            case 'R':
                return Enum_ImageSide.RIGHT;

            case 'TOP':
            case 'T':
                return Enum_ImageSide.TOP;

            case 'LEFT':
            case 'L':
                return Enum_ImageSide.LEFT;

            case 'BOTTOM':
            case 'BOT':
            case 'B':
                return Enum_ImageSide.BOTTOM;
        } 
    }
};
Enum_XY = {
    X: 'X',
    Y: 'Y',

    /**
     * @param {string} string_val 
     * @param {Enum_XY} defualt
     * @returns {Enum_XY} 
     */
    Enum_GetFromString(string_val, Enum_defualt){
        if(string_val == null || typeof string_val !== 'string'){
            console.log("Enum_XY.Enum_GetFromString() invalid input");
            return Enum_defualt;
        }
        string_val = string_val.trim().toUpperCase();
        switch(string_val){
            default:
                console.log("Enum_XY.Enum_GetFromString() invalid input [" + string_val + "]");
                return Enum_defualt;

            case 'WIDTH':
            case 'W':
            case 'X':
                return Enum_XY.X;

            case 'HEIGHT':
            case 'H':
            case 'Y':
                return Enum_XY.Y;
        } 
    }
};
Enum_AmountType = {
    PIXEL: 'px',
    PERCENT: '%'
}
class ViewAmount {
    constructor(){
        this.Clear();
    }
    Clear(){
        this.int_Amount = 0;
        this.Enum_Type = Enum_AmountType.PIXEL;
    }
    /**
     * 
     * @param {string} string_val 
     * @param {ViewAmount} ViewAmount_defualt 
     * @returns {string}
     */
    static ViewAmount_GetFromString(string_val, ViewAmount_defualt){
        if(string_val == null || typeof string_val !== 'string'){
            console.log("ViewAmount.ViewAmount_GetFromString() invalid input");
            return ViewAmount_defualt;
        }
        
        string_val = string_val.trim().toUpperCase();

        //return if everything parces
        var ViewAmount_retVal = new ViewAmount(); 

        //get type
        //
        //expecting "50px"
        var index = string_val.indexOf('PX');
        if(index >= 0){
            ViewAmount_retVal.Enum_Type = Enum_AmountType.PIXEL;
        }
        //expecting "50%"
        else{
            index = string_val.indexOf('%');  

            if(index >= 0){
                ViewAmount_retVal.Enum_Type = Enum_AmountType.PERCENT;
            }
            //can't parse "???"
            else{
                console.log("ViewAmount.ViewAmount_GetFromString() invalid input [" + string_val + "]");
                return ViewAmount_defualt;
            }   
        }

        //get num
        var string_Num = string_val.substr(0, index);
        ViewAmount_retVal.int_Amount = parseInt(string_Num, 10);
        if (isNaN(ViewAmount_retVal.int_Amount)){
            console.log("ViewAmount.ViewAmount_GetFromString() invalid input [" + string_val + "]");
            return ViewAmount_defualt;
        }

        return ViewAmount_retVal;

    }
};

class ComicPageData {
    constructor(){
        this.Clear();
    }
    Clear(){
        this.string_imgSrc = "";
        this.Enum_selfConnectingSide = Enum_ImageSide.TOP;
        this.ViewAmount_selfConnectingAmount = ViewAmount.ViewAmount_GetFromString("50%", new ViewAmount());
        this.ViewAmount_previousConnectingAmount = ViewAmount.ViewAmount_GetFromString("50%", new ViewAmount());
    }
}

class ComicData {
    constructor(){
        this.Clear();
    }
    Clear(){
        this.string_backgroundColor = "xffffff";
        this.Enum_ImageScaleSide = Enum_XY.X;
        this.Num_imageScaleLength = 1000;
        this.Num_imageMinAspect = 500;
        this.Num_imageMaxAspect = 2000;
        this.Num_scrollSpeed = 1;
        this.Num_visibleSetSize = 10;
        this.Array_ComicPageData = [];
    }

    /**
     * @param {object} object_json 
     * @returns {ComicData}
     */
    static ComicData_GetFromJsonData(object_json){
        var ComicData_RetVal =  new ComicData();

        if(object_json == null || typeof object_json !== 'object'){
            console.log("ComicData.ComicData_GetFromJsonData() invalid input");
            return new ComicData();
        }
        
        //fill in data
        if(typeof object_json.backgroundColor === "string"){
            ComicData_RetVal.string_backgroundColor = object_json.backgroundColor;
        }
        if(typeof object_json.imageScaleSide === "string"){
            ComicData_RetVal.Enum_ImageScaleSide = Enum_XY.Enum_GetFromString(object_json.imageScaleSide, this.Enum_ImageScaleSide);
        }
        if(typeof object_json.imageScaleLength === "number"){
            ComicData_RetVal.Num_imageScaleLength = object_json.imageScaleLength;
        }
        if(typeof object_json.imageMinAspect === "number"){
            ComicData_RetVal.Num_imageMinAspect = object_json.imageMinAspect;
        }
        if(typeof object_json.imageMaxAspect === "number"){
            ComicData_RetVal.Num_imageMaxAspect = object_json.imageMaxAspect;
        }
        if(typeof object_json.scrollSpeed === "number"){
            ComicData_RetVal.Num_scrollSpeed = object_json.scrollSpeed;
        }
        if(typeof object_json.visibleSetSize === "number"){
            ComicData_RetVal.Num_visibleSetSize = object_json.visibleSetSize;
        }
        if(ComicData_RetVal.Num_visibleSetSize < 4){
            ComicData_RetVal.Num_visibleSetSize = 6; 
            //becuase get position needs the current page and the next page to caclulate anchers
            //we need at least 2 pages ahead of the current one to scroll
        }

        //fill in data (parrellel arrays depending on how big it gets)
        if(Array.isArray(object_json.pages)){
            object_json.pages.forEach(function (item, index) {
                var newPage = new ComicPageData();

                //parce page data
                if(typeof item.imgSrc === "string"){
                    newPage.string_imgSrc = item.imgSrc;
                }
                if(typeof item.selfConnectingSide === "string"){
                    newPage.Enum_selfConnectingSide = Enum_ImageSide.Enum_GetFromString(item.selfConnectingSide, newPage.Enum_selfConnectingSide);
                }
                if(typeof item.selfConnectingAmount === "string"){
                    newPage.ViewAmount_selfConnectingAmount = ViewAmount.ViewAmount_GetFromString(item.selfConnectingAmount, newPage.ViewAmount_selfConnectingAmount);
                }
                if(typeof item.previousConnectingAmount === "string"){
                    newPage.ViewAmount_previousConnectingAmount = ViewAmount.ViewAmount_GetFromString(item.previousConnectingAmount, newPage.ViewAmount_previousConnectingAmount);
                }
                
                //add pages in order
                ComicData_RetVal.Array_ComicPageData.push(newPage);
            });
        }
        
        return ComicData_RetVal;
    }
}
