Enum_ComicPageUIState = {
    UNLOADED: "UNLOADED",
    LOADING: "LOADING",
    VISIBLE: "VISIBLE"
};

class ComicPageUI {
    /**
     * @param {ComicScrollerData} ScrollerData 
     * @param {number} int_index 
     */
    constructor(ScrollerData, int_index){
        this.ScrollerData_data = ScrollerData;
        this.int_ComicIndex = int_index;

        this.div_Root = null;
        this.img_Page = null;

        this.Enum_State = Enum_ComicPageUIState.UNLOADED;
        this.bool_FlagVisible = false;
    }
    /**
     * @returns {number}
     */
    Int_GetIndex(){
        return this.int_ComicIndex;
    }
    /**
     * @returns {ComicPageData}
     */
    ComicPageData_GetPageData(){
        if(this.ScrollerData_data == null){
            return null;
        }
        return this.ScrollerData_data.ComicPageData_GetPageDataByIndex(this.int_ComicIndex);
    }
    /**
     * Is Visible now
     * @returns {boolean}
     */
    Bool_IsVisible(){
        return this.Enum_State == Enum_ComicPageUIState.VISIBLE;
    }
    /**
     * is visible or will be soon
     * @returns {boolean}
     */
    Bool_FlagedToBeVisible(){
        return this.bool_FlagVisible;
    }
    /**
     * @param {ComicPageData} NextPageData 
     * @returns {Vector2D}
     */
    Vector2D_GetAnchorNext(NextPageData){
        var retVal = new Vector2D();

        //idiot checks
        if(NextPageData == null){
            return retVal;
        }
        if(!this.Bool_IsVisible() 
                || this.img_Page == null
                || this.div_Root == null){

            console.log("ComicPageUI.Bool_IsVisible(): pageUI not visible");
            return retVal;
        }

        //get points that matter
        var Bool_SetX = false;
        var Num_Corner = 0;
        var Num_Length = 0; 
        var Num_UnmodifiedDimension = 0;
        
        //sides are oposite becuase this is the next pages data
        switch(NextPageData.Enum_selfConnectingSide){
        case Enum_ImageSide.RIGHT:
            Bool_SetX = false;
            Num_Corner = this.div_Root.offsetTop;
            Num_Length = this.img_Page.height;
            Num_UnmodifiedDimension = this.div_Root.offsetLeft;
            break;
        case Enum_ImageSide.LEFT:
            Bool_SetX = false;
            Num_Corner = this.div_Root.offsetTop;
            Num_Length = this.img_Page.height;
            Num_UnmodifiedDimension = this.div_Root.offsetLeft + this.img_Page.width;
            break;
        case Enum_ImageSide.BOTTOM:
            Bool_SetX = true;
            Num_Corner = this.div_Root.offsetLeft;
            Num_Length = this.img_Page.width;
            Num_UnmodifiedDimension = this.div_Root.offsetTop;
            break;
        case Enum_ImageSide.TOP:
            Bool_SetX = true;
            Num_Corner = this.div_Root.offsetLeft;
            Num_Length = this.img_Page.width;
            Num_UnmodifiedDimension = this.div_Root.offsetTop + this.img_Page.height;
            break;
        }
        //actually caculate retval
        switch(NextPageData.ViewAmount_previousConnectingAmount.Enum_Type){
        case Enum_AmountType.PIXEL:
            retVal.x = Bool_SetX ? Num_Corner + NextPageData.ViewAmount_previousConnectingAmount.int_Amount : Num_UnmodifiedDimension;
            retVal.y = Bool_SetX ? Num_UnmodifiedDimension : Num_Corner + NextPageData.ViewAmount_previousConnectingAmount.int_Amount;
            break;
        case Enum_AmountType.PERCENT:
            retVal.x = Bool_SetX ? (Num_Length * (NextPageData.ViewAmount_previousConnectingAmount.int_Amount * 0.01)) + Num_Corner : Num_UnmodifiedDimension;
            retVal.y = Bool_SetX ? Num_UnmodifiedDimension : (Num_Length * (NextPageData.ViewAmount_previousConnectingAmount.int_Amount * 0.01)) + Num_Corner;
            break;
        }
        return retVal;
    }

    /**
     * @returns {Vector2D}
     */
    Vector2D_GetAnchorPrevious(){
        var retVal = new Vector2D();

        //idiot checks
        if(!this.Bool_IsVisible() 
                || this.img_Page == null
                || this.div_Root == null
                || this.ScrollerData_data == null){

            console.log("ComicPageUI.Vector2D_GetAnchorPrevious(): pageUI not visible");
            return retVal;
        }
        var data = this.ScrollerData_data.ComicPageData_GetPageDataByIndex(this.int_ComicIndex);
        if(data == null){
            console.log("ComicPageUI.Vector2D_GetAnchorPrevious(): no page data");
            return retVal;
        }

        //get points that matter
        var Bool_SetX = false;
        var Num_Corner = 0;
        var Num_Length = 0; 
        var Num_UnmodifiedDimension = 0;
        
        switch(data.Enum_selfConnectingSide){
        case Enum_ImageSide.LEFT:
            Bool_SetX = false;
            Num_Corner = this.div_Root.offsetTop ;
            Num_Length = this.img_Page.height;
            Num_UnmodifiedDimension = this.div_Root.offsetLeft;
            break;
        case Enum_ImageSide.RIGHT:
            Bool_SetX = false;
            Num_Corner = this.div_Root.offsetTop ;
            Num_Length = this.img_Page.height;
            Num_UnmodifiedDimension = this.div_Root.offsetLeft + this.img_Page.width;
            break;
        case Enum_ImageSide.TOP:
            Bool_SetX = true;
            Num_Corner = this.div_Root.offsetLeft;
            Num_Length = this.img_Page.width;
            Num_UnmodifiedDimension = this.div_Root.offsetTop;
            break;
        case Enum_ImageSide.BOTTOM:
            Bool_SetX = true;
            Num_Corner = this.div_Root.offsetLeft;
            Num_Length = this.img_Page.width;
            Num_UnmodifiedDimension = this.div_Root.offsetTop + this.img_Page.height;
            break;
        }
        //actually caculate retval
        switch(data.ViewAmount_selfConnectingAmount.Enum_Type){
        case Enum_AmountType.PIXEL:
            retVal.x = Bool_SetX ? Num_Corner + data.ViewAmount_selfConnectingAmount.int_Amount : Num_UnmodifiedDimension;
            retVal.y = Bool_SetX ? Num_UnmodifiedDimension : Num_Corner + data.ViewAmount_selfConnectingAmount.int_Amount;
            break;
        case Enum_AmountType.PERCENT:
            retVal.x = Bool_SetX ? (Num_Length * (data.ViewAmount_selfConnectingAmount.int_Amount * 0.01)) + Num_Corner : Num_UnmodifiedDimension;
            retVal.y = Bool_SetX ? Num_UnmodifiedDimension : (Num_Length * (data.ViewAmount_selfConnectingAmount.int_Amount * 0.01)) + Num_Corner;
            break;
        }
        return retVal;
    }

    /**
     * @param {Enum_ComicPageUIState} Enum_NewState 
     */
    SetState(Enum_NewState){
        if(this.ScrollerData_data == null){
            return;
        }

        this.Enum_State = Enum_NewState;

        switch(this.Enum_State){
            default:
            case Enum_ComicPageUIState.UNLOADED:
                //remove all of our UI
                if(this.img_Page != null){
                    if(this.img_Page.parentNode){
                        this.img_Page.parentNode.removeChild(this.img_Page);
                    }
                    this.img_Page = null;
                }    
                if(this.div_Root != null){
                    if(this.div_Root.parentNode){
                        this.div_Root.parentNode.removeChild(this.div_Root);
                    }
                    this.div_Root = null;
                }    
                break;

            case Enum_ComicPageUIState.LOADING:
                {
                    if(this.ScrollerData_data.CameraRoot == null || !this.bool_FlagVisible){
                        //root not set up yet
                        SetState(Enum_ComicPageUIState.UNLOADED);
                        return;
                    }
                    var data = this.ScrollerData_data.ComicPageData_GetPageDataByIndex(this.int_ComicIndex);
                    if(data == null){
                        //no data no UI
                        SetState(Enum_ComicPageUIState.UNLOADED);
                        return;
                    }
                    //add elements hidden and start image load
                    if(this.div_Root == null){
                        this.div_Root = this.ScrollerData_data.DocumentObj.createElement("div");
                        
                        //defualt settings
                        this.div_Root.style.margin = 0;
                        this.div_Root.style.padding = 0;
                        this.div_Root.style.position = "absolute";
                        this.div_Root.style.top = "0px";
                        this.div_Root.style.left = "0px";

                        this.ScrollerData_data.CameraRoot.appendChild(this.div_Root);
                    }         
                    if(this.img_Page == null){
                        this.img_Page = this.ScrollerData_data.DocumentObj.createElement("img");
                        
                        this.div_Root.appendChild(this.img_Page);
                    }
                    //start off as hidden
                    this.div_Root.style.visibility = "hidden";
                    
                    //update image
                    if( this.img_Page.src != data.string_imgSrc){
                        var self = this; //TODO: not the dumb way

                        this.img_Page.src = data.string_imgSrc;
                        this.img_Page.onload = function(){
                            console.log("ComicPageUI.SetState(Enum_ComicPageUIState.LOADING) Succesfully loaded [" + this.src + "]");
                            self.SetState(Enum_ComicPageUIState.VISIBLE);
                        };
                        this.img_Page.onerror = function() {
                            console.log("ComicPageUI.SetState(Enum_ComicPageUIState.LOADING) FAILED to load [" + this.src + "]");
                            self.SetState(Enum_ComicPageUIState.UNLOADED);
                        };
                    }
                }
                break;

            case Enum_ComicPageUIState.VISIBLE:
                {
                    var data = this.ScrollerData_data.ComicPageData_GetPageDataByIndex(this.int_ComicIndex);
                    if(data == null
                            || this.div_Root == null
                            || this.img_Page == null
                            || !this.bool_FlagVisible){

                        //no UI... mo UI
                        SetState(Enum_ComicPageUIState.UNLOADED);
                        return;
                    }
                    if(!this.img_Page.src.includes(data.string_imgSrc)){
                        //wrong image
                        this.SetState(Enum_ComicPageUIState.LOADING);
                        return; 
                    }
                    //this will update as and all following pages
                    Comic_UpdateLayoutFromIndex(this.ScrollerData_data, this.int_ComicIndex)
                
                    //make visible (not till after we are in the correct position)
                    this.div_Root.style.visibility = "visible";
                }
                break;
        }
    }
    Bool_ReportNewData(){
        switch(this.Enum_State){
            default:
            case Enum_ComicPageUIState.UNLOADED:
            case Enum_ComicPageUIState.LOADING:
                //don't care yet
                return false;

            case Enum_ComicPageUIState.VISIBLE: 
                if(this.img_Page != null && this.ScrollerData_data != null) {
                    var data = this.ScrollerData_data.ComicPageData_GetPageDataByIndex(this.int_ComicIndex);
                    if(data == null){
                        this.SetState(Enum_ComicPageUIState.UNLOADED);
                        return true;
                    }
                    if(this.img_Page.src != data.string_imgSrc){
                        this.SetState(Enum_ComicPageUIState.LOADING);
                        return true; 
                    }

                    return false; 
                }
                break;
        }
    }
    bool_ReportLayoutUpdate(){
        switch(this.Enum_State){
            default:
            case Enum_ComicPageUIState.UNLOADED:
            case Enum_ComicPageUIState.LOADING:
                //don't care yet
                return false;
                
            case Enum_ComicPageUIState.VISIBLE: 
                if(this.img_Page != null 
                        && this.div_Root != null 
                        && this.ScrollerData_data != null) {

                    var ComicPageUI_previous = this.ScrollerData_data.ComicPageUI_GetPreviousPageByIndex(this.int_ComicIndex, true)
                    var Vector2D_AnchorPrevious;
                    if(ComicPageUI_previous != null){
                        Vector2D_AnchorPrevious = ComicPageUI_previous.Vector2D_GetAnchorNext(this.ScrollerData_data.ComicPageData_GetPageDataByIndex(this.int_ComicIndex));
                    }
                    else{
                        Vector2D_AnchorPrevious = new Vector2D();//[0,0]
                    }
                    var Vector2D_AnchorSelf = this.Vector2D_GetAnchorPrevious();
                    
                    if(Vector2D_AnchorPrevious.bool_isEqual(Vector2D_AnchorSelf)){
                        return false;
                    }
                    Vector2D_AnchorPrevious.SubtractFromSelf(Vector2D_AnchorSelf);

                    this.div_Root.style.left = (this.div_Root.offsetLeft + Vector2D_AnchorPrevious.x) + "px";
                    this.div_Root.style.top = (this.div_Root.offsetTop + Vector2D_AnchorPrevious.y) + "px";

                    return true;
                }
                break;
        }   
    }
    bool_ReportShowUI(){
        this.bool_FlagVisible = true;

        switch(this.Enum_State){
        case Enum_ComicPageUIState.UNLOADED:
            this.SetState(Enum_ComicPageUIState.LOADING);
            return true;
        default:
        case Enum_ComicPageUIState.LOADING:
        case Enum_ComicPageUIState.VISIBLE:
            //already visible or wil be
            return false;
        }
    }
    bool_ReportClearUI(){
        this.bool_FlagVisible = false;

        switch(this.Enum_State){
        default:
        case Enum_ComicPageUIState.UNLOADED:
        case Enum_ComicPageUIState.LOADING:
            //already hidden
            return false;

        case Enum_ComicPageUIState.VISIBLE:
            this.SetState(Enum_ComicPageUIState.UNLOADED);
            return true;
        }
    }
}

class ComicScrollLocation {
    /**
     * @param {ComicScrollerData} ScrollerData 
     */
    constructor(ScrollerData){
        //scroller data ref
        this.ScrollerData_data = ScrollerData;

        //defualt data
        this.Num_PageIndex = -1;
        this.Num_PercentProgress = 0;
        
        if(this.ScrollerData_data == null){
            return;
        }
        //update data from cookie
        var str_cookie = this.ScrollerData_data.Str_GetCookie();
        if(str_cookie == null || str_cookie === ""){
            str_cookie = "{}";
        }
        var obj_cookie = JSON.parse(str_cookie);
        if(obj_cookie == null){
            obj_cookie = {};
        }
        if(typeof obj_cookie.Num_PageIndex === "number"){
            this.Num_PageIndex = obj_cookie.Num_PageIndex;
        }
        if(typeof obj_cookie.Num_PercentProgress === "number"){
            this.Num_PercentProgress = obj_cookie.Num_PercentProgress;
        }

        this.Update_Cookie();
    }
    Update_Cookie(){
        //push new data to cookie
        if(this.ScrollerData_data == null){
            return;
        }
        var str_cookie = this.ScrollerData_data.Str_GetCookie();
        if(str_cookie == null || str_cookie === ""){
            str_cookie = "{}";
        }
        var obj_cookie = JSON.parse(str_cookie);
        if(obj_cookie != null
                && typeof obj_cookie.Num_PageIndex === "number"
                && obj_cookie.Num_PageIndex == this.Num_PageIndex
                && typeof obj_cookie.Num_PercentProgress === "number"
                &&  obj_cookie.Num_PercentProgress == this.Num_PercentProgress){

            //all up to date
            return;
        }

        //update cookie
        this.ScrollerData_data.SetCookie(JSON.stringify({Num_PageIndex: this.Num_PageIndex, Num_PercentProgress: this.Num_PercentProgress}), 364);
    }
    /**
     * @returns {Vector2D}
     */
    Num_GetPageIndex(){
        return this.Num_PageIndex;
    }
    /**
     * @returns {Vector2D}
     */
    Vector2D_GetScrollLocation(Vector2D_WindowSize){
        if(Vector2D_WindowSize == null){
            Vector2D_WindowSize = new Vector2D();
        }
        //don't do anything if no data
        if(this.ScrollerData_data == null 
                || this.ScrollerData_data.ComicData == null
                || this.ScrollerData_data.ComicData.Array_ComicPageData == null
                || this.ScrollerData_data.ComicData.Array_ComicPageData.length < 0){

            return new Vector2D();
        }
        //clamp page to one that exists
        if(this.Num_PageIndex < 0){
            this.Num_PageIndex = 0
        }
        if(this.Num_PageIndex >= this.ScrollerData_data.ComicData.Array_ComicPageData.length){
            this.Num_PageIndex = this.ScrollerData_data.ComicData.Array_ComicPageData.length - 1;
        }
        //try to get relevent anchors
        var currentPageUI = this.ScrollerData_data.ComicPageUI_GetPageUIByIndex(this.Num_PageIndex);
        var closestNextPage = this.ScrollerData_data.ComicPageUI_GetNextPageByIndex(this.Num_PageIndex, true);
        if(currentPageUI == null || !currentPageUI.Bool_IsVisible()){
            //current page either does not exist or is not visible yet,
            //
            //will center on anchor on closest visible page
            var closestPreviousPage = this.ScrollerData_data.ComicPageUI_GetPreviousPageByIndex(this.Num_PageIndex, true);
            if(closestNextPage != null){
                if(closestPreviousPage != null){
                    return closestPreviousPage.Vector2D_GetAnchorNext(closestNextPage.ComicPageData_GetPageData());
                }
                return closestNextPage.Vector2D_GetAnchorPrevious();
            }
            return new Vector2D();
        }
        if(closestNextPage == null){
            //we don't know where the next anchor use the furst anchor
            return currentPageUI.Vector2D_GetAnchorPrevious();
        }
        //get our current position between both anchors
        var AnchorPrevious = currentPageUI.Vector2D_GetAnchorPrevious();
        var AnchorNext = currentPageUI.Vector2D_GetAnchorNext(closestNextPage.ComicPageData_GetPageData());
        var AnchorRetval = Vector2D_GetPointBetween(AnchorPrevious, AnchorNext, this.Num_PercentProgress);
        if(closestNextPage.Int_GetIndex() == currentPageUI.Int_GetIndex() + 1){
            //if the actual next page is not visible yet don't try to fit the window to the page yet
            return AnchorRetval;
        }
        //scroll up or down to fit the window the ancher
        return new Vector2D();
    }
    /**
     * @param {Vector2D} Vector2D_ScrollAmount 
     * @returns {Vector2D} remainder
     */
    Vector2D_ScrollInDirection(Vector2D_ScrollAmount){
        if(Vector2D_ScrollAmount == null){
            return Vector2D_ScrollAmount;
        }
        Vector2D_ScrollAmount = new Vector2D(Vector2D_ScrollAmount.x, Vector2D_ScrollAmount.y);

         //don't do anything if no data
         if(this.ScrollerData_data == null 
                || this.ScrollerData_data.ComicData == null
                || this.ScrollerData_data.ComicData.Array_ComicPageData == null
                || this.ScrollerData_data.ComicData.Array_ComicPageData.length < 0){

            return Vector2D_ScrollAmount;
        }
        
        while(true){ //will iterate until either we run out of scroll amount or we run out of images
            var currentPageUI = this.ScrollerData_data.ComicPageUI_GetPageUIByIndex(this.Num_PageIndex);
            var NextPageUI = this.ScrollerData_data.ComicPageUI_GetNextPageByIndex(this.Num_PageIndex, true);
            if(currentPageUI == null
                    || NextPageUI == null
                    || !currentPageUI.Bool_IsVisible()
                    || !NextPageUI.Bool_IsVisible()){

                //can't scroll if relevent anchers are not visible yet
                return Vector2D_ScrollAmount;
            }
            //get scroll points
            var AnchorPrevious = currentPageUI.Vector2D_GetAnchorPrevious();
            var AnchorNext = currentPageUI.Vector2D_GetAnchorNext(NextPageUI.ComicPageData_GetPageData());
            var AnchorCurrent = Vector2D_GetPointBetween(AnchorPrevious, AnchorNext, this.Num_PercentProgress);
            var ScrollDirectionNormal = new Vector2D(AnchorPrevious.x, AnchorPrevious.y);
            ScrollDirectionNormal.SubtractFromSelf(AnchorNext);
            var ScrollBoundsLength = ScrollDirectionNormal.Num_GetLength();
            ScrollDirectionNormal.Normalize();

            //get amount scrolled
            var AnchorScrolled = new Vector2D(ScrollDirectionNormal.x, ScrollDirectionNormal.y);
            AnchorScrolled.MultiplySelf(Num_DotProduct(ScrollDirectionNormal, Vector2D_ScrollAmount))
            var RawAmountScrolled = new Vector2D(AnchorScrolled.x, AnchorScrolled.y);
            AnchorScrolled.AddToSelf(AnchorCurrent);

            if(RawAmountScrolled.x == 0 && RawAmountScrolled.y == 0){
                //no scroll, bail
                return Vector2D_ScrollAmount
            }

            //get vectors to check bounds
            var FromPrevious = new Vector2D(AnchorPrevious.x, AnchorPrevious.y);
            FromPrevious.SubtractFromSelf(AnchorScrolled);
            var FromNext = new Vector2D(AnchorNext.x, AnchorNext.y);
            FromNext.SubtractFromSelf(AnchorScrolled); 
  
            //is beyond bounds of next page
            if(FromPrevious.Num_GetLength() > ScrollBoundsLength){
                //calculate remainder
                AnchorScrolled.Assign(AnchorNext);
                AnchorScrolled.SubtractFromSelf(AnchorCurrent);
                Vector2D_ScrollAmount.SubtractFromSelf(AnchorScrolled);

                //bail if we can't scroll any further
                var NextNextPageTest = this.ScrollerData_data.ComicPageUI_GetNextPageByIndex(this.Num_PageIndex + 1, true);
                if(NextNextPageTest == null
                        || !NextNextPageTest.Bool_IsVisible()
                        || NextNextPageTest.Int_GetIndex() != this.Num_PageIndex + 2
                        || AnchorScrolled.Num_GetLength() == 0){
                    
                    //were can't scroll from the next page. so don't go there and return remainder
                    return Vector2D_ScrollAmount;
                }
                //go to next page and iterate again
                this.Num_PageIndex++;
                this.Num_PercentProgress = 0;
            }
            //is beyond bounds of previous page
            else if(FromNext.Num_GetLength() > ScrollBoundsLength){
                //calculate remainder
                AnchorScrolled.Assign(AnchorPrevious);
                AnchorScrolled.SubtractFromSelf(AnchorCurrent);
                Vector2D_ScrollAmount.SubtractFromSelf(AnchorScrolled);

                //bail if we can't scroll any further
                var PreviousPageTest = this.ScrollerData_data.ComicPageUI_GetPreviousPageByIndex(this.Num_PageIndex, true);
                if(PreviousPageTest == null
                        || !PreviousPageTest.Bool_IsVisible()
                        || PreviousPageTest.Int_GetIndex() != this.Num_PageIndex - 1
                        || AnchorScrolled.Num_GetLength() == 0){
                    
                    //were can't scroll back any more return remainder
                    return Vector2D_ScrollAmount;
                }
                //go to previous page and iterate again
                this.Num_PageIndex--;
                this.Num_PercentProgress = 0.99999;
            } 
            //is within bounds 
            else{
                this.Num_PercentProgress = FromPrevious.Num_GetLength() / ScrollBoundsLength;
                Vector2D_ScrollAmount.SubtractFromSelf(RawAmountScrolled);
                
                return Vector2D_ScrollAmount;
            }
        } 

        //we should never get here
        return Vector2D_ScrollAmount;
    }
        /**
     * @param {number} Num_ScrollAmount 
     * @returns {number} unscrolled remainder
     */
    Num_ScrollInDirection(Num_ScrollAmount){
        if(Num_ScrollAmount == 0){
            return Num_ScrollAmount;
        }
         //don't do anything if no data
         if(this.ScrollerData_data == null 
                || this.ScrollerData_data.ComicData == null
                || this.ScrollerData_data.ComicData.Array_ComicPageData == null
                || this.ScrollerData_data.ComicData.Array_ComicPageData.length < 0){

            return Num_ScrollAmount;
        }
        //We want to Always scroll "forward" but if "forward" is up we want the scroll to match that
        var ScrollDirection = new Vector2D(1,1);
        ScrollDirection.Normalize();
        
        var ScrollAmount = new Vector2D();
        ScrollAmount.Assign(ScrollDirection);
        ScrollAmount.MultiplySelf(Num_ScrollAmount);

        var remainder = this.Vector2D_ScrollInDirection(ScrollAmount);

        var projectedRemainder = new Vector2D();
        projectedRemainder.Assign(ScrollDirection);
        projectedRemainder.MultiplySelf(Num_DotProduct(ScrollAmount, projectedRemainder));
        
        var retVal = projectedRemainder.Num_GetLength();
        if(bool_SameSign(ScrollAmount.x, projectedRemainder.x) 
                && bool_SameSign(ScrollAmount.y, projectedRemainder.y)){

            return Num_ScrollAmount > 0 ? retVal : -retVal;
        }
        else{
            return Num_ScrollAmount > 0 ? -retVal : retVal;
        } 
    }
}