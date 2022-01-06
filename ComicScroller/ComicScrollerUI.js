class ComicScrollerData {
    constructor(){
        this.WindowObj = null;
        this.DocumentObj = null;
        this.ContainerElement = null;

        this.RootElement = null;
        this.AspectRoot = null;
        this.CameraRoot = null;       
        this.Str_DataPath = "";
        this.Str_CookieName = "scrollerState";

        this.ComicData = null; //ComicData
        this.ComicInputManager = null; //ComicInputManager
        this.ComicScrollLocation_Location = null;
        this.Array_ComicPageUIs = [];

        this.Num_LastCameraScale = 1;
    }
    /**
     * @param {number} int_index 
     * @returns {ComicPageUI} or null
     */
    ComicPageUI_GetPageUIByIndex(int_index){
        if(this.Array_ComicPageUIs == null
                 || this.Array_ComicPageUIs.length <= int_index
                 || int_index < 0){

            return null;
        }
        return this.Array_ComicPageUIs[int_index];
    }
    /**
     * @param {number} int_index 
     * @returns {ComicPageData} or null
     */
    ComicPageData_GetPageDataByIndex(int_index){
        if(this.ComicData == null
                || this.ComicData.Array_ComicPageData == null
                || this.ComicData.Array_ComicPageData.length <= int_index){
            
            return null;
        }
        return this.ComicData.Array_ComicPageData[int_index];
    }

    /**
     * @param {number} int_index 
     * @param {boolean} bool_visible 
     * @returns {ComicPageUI}
     */
    ComicPageUI_GetPreviousPageByIndex(int_index, bool_visible){
        if(this.Array_ComicPageUIs == null
                || this.Array_ComicPageUIs.length <= int_index
                || int_index <= 0){

            return null;
        }
        //loops backwards
        for(var loop = int_index - 1; loop >= 0; loop--){
            var pageUI = this.Array_ComicPageUIs[loop];
            if(pageUI != null && (!bool_visible || pageUI.Bool_IsVisible())){
                return pageUI;
            }
        }
        return null;
    }
    /**
     * @param {number} int_index 
     * @param {boolean} bool_visible 
     * @returns {ComicPageUI}
     */
    ComicPageUI_GetNextPageByIndex(int_index, bool_visible){
        if(this.Array_ComicPageUIs == null
                || this.Array_ComicPageUIs.length <= (int_index + 1)
                || int_index < 0){

            return null;
        }
        for(var loop = int_index + 1; loop < this.Array_ComicPageUIs.length; loop++){
            var pageUI = this.Array_ComicPageUIs[loop];
            if(pageUI != null && (!bool_visible || pageUI.Bool_IsVisible())){
                return pageUI;
            }
        }
        return null;
    }


    //https://www.w3schools.com/js/js_cookies.asp
    /** 
     * @param {string} Str_Value 
     * @param {number} Num_Days 
     */
     SetCookie(Str_Value, Num_Days) {
        if(this.DocumentObj == null){
            return;
        }
        var Str_Name = this.Str_CookieName;
        if(Str_Name == null || Str_Name.length){
            Str_Name = "scrollerState";
        }
        var d = new Date();
        d.setTime(d.getTime() + (Num_Days * 24 * 60 * 60 * 1000));
        var Str_Expires = "expires="+d.toUTCString();

        //TODO: probubly will blow out other cookies
        this.DocumentObj.cookie = Str_Name + "=" + Str_Value + ";" + Str_Expires + ";path=/";
    }
    /**
     * @param {string} Str_Name 
     */
    Str_GetCookie() {
        if(this.DocumentObj == null){
            return;
        }
        var Str_Name = this.Str_CookieName;
        if(Str_Name == null || Str_Name.length){
            Str_Name = "scrollerState";
        }
        Str_Name = Str_Name + "=";
        var LstStr = this.DocumentObj.cookie.split(';');
        for(var loop = 0; loop < LstStr.length; loop++) {
            var current = LstStr[loop];
            while (current.charAt(0) == ' ') {
                current = current.substring(1);
            }
            if (current.indexOf(Str_Name) == 0) {
                return current.substring(Str_Name.length, current.length);
            }
        }
        return "";
    }
}

/** blatently copied from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/*/
String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

/**
 * @param {Window} WindowObj - window
 * @param {Document} DocumentObj - document,
 * @param {HTMLElement} ContainerElement - div or whatever defines the area this will use,
 * @param {string} ComicPath - "??"ComicScrollerUI.js
 * @param {string} DataPath - where ever the comic json livs
 * @param {string} CookieName - The name for the coockie to remember progress
 */
function Comic_Init(WindowObj, DocumentObj, ContainerElement, ComicPath, DataPath, CookieName){
    if(DocumentObj == null || ContainerElement == null){
        //Becuase fuck you that's why
        return;
    }
    var comicScrollerData = new ComicScrollerData();
    comicScrollerData.WindowObj = WindowObj;
    comicScrollerData.DocumentObj = DocumentObj;
    comicScrollerData.ContainerElement = ContainerElement;
    comicScrollerData.Str_CookieName = CookieName;
    comicScrollerData.Str_DataPath = DataPath;

    //create root
    comicScrollerData.RootElement = comicScrollerData.DocumentObj.createElement("div");
    if(comicScrollerData.RootElement == null){
        //WAT
        return;
    }
    comicScrollerData.RootElement.style.width = "100%";
    comicScrollerData.RootElement.style.height = "100%";
    comicScrollerData.RootElement.style.margin = 0;
    comicScrollerData.RootElement.style.padding = 0;
    comicScrollerData.RootElement.style.overflow = "hidden";
    comicScrollerData.RootElement.style.touchAction = "pinch-zoom | pan-x | pan-y"; //TODO: remove pan options when three's a solution for the the mobile viewport bullshit 
    comicScrollerData.RootElement.style.backgroundColor = "#000000";
    comicScrollerData.ContainerElement.appendChild(comicScrollerData.RootElement);

    comicScrollerData.AspectRoot = comicScrollerData.DocumentObj.createElement("div");
    comicScrollerData.AspectRoot.style.width = "100%";
    comicScrollerData.AspectRoot.style.height = "100%";
    comicScrollerData.AspectRoot.style.margin = "0 auto";
    comicScrollerData.AspectRoot.style.padding = 0;
    comicScrollerData.AspectRoot.style.overflow = "hidden";
    comicScrollerData.AspectRoot.style.display = "table";
    comicScrollerData.RootElement.appendChild(comicScrollerData.AspectRoot);

    comicScrollerData.CameraRoot = comicScrollerData.DocumentObj.createElement("div");
    comicScrollerData.CameraRoot.style.position = "relative";
    comicScrollerData.CameraRoot.style.transformOrigin = "top left";
    comicScrollerData.CameraRoot.style.left = "0px";
    comicScrollerData.CameraRoot.style.top = "0px";
    comicScrollerData.CameraRoot.style.margin = 0;
    comicScrollerData.CameraRoot.style.padding = 0;
    
    comicScrollerData.AspectRoot.appendChild(comicScrollerData.CameraRoot);

    //This is the include order if your thing is in Comic and it is undefined this isWhy
    lstComicScripts = [(ComicPath + "/MathStuff.js")
                        , (ComicPath + "/ComicData.js")
                        , (ComicPath + "/ComicPageUI.js")
                        , (ComicPath + "/ComicInputManager.js")];
    Comic_LoadScripts(comicScrollerData, lstComicScripts, Comic_AfterScriptLoad);

    //actually start idle loop
    function Comic_AfterScriptLoad(){  
        comicScrollerData.ComicScrollLocation_Location = new ComicScrollLocation(comicScrollerData);
        
        //start loading pages
        Comic_LoadData(comicScrollerData.Str_DataPath, Commic_AfterDataLoad); 
    }
    function Commic_AfterDataLoad(data){
        comicScrollerData.ComicData = data;

        //setup input man
        comicScrollerData.ComicInputManager = new ComicInputManager();
        comicScrollerData.ComicInputManager.SetUpCallbacks(comicScrollerData);

        Comic_InitForNewData(comicScrollerData);
    }
}
/**
 * @param {ComicScrollerData} comicScrollerData 
 * @param {Array} lstPaths 
 * @param {function} isLoadedCallback
 */
function Comic_LoadScripts(comicScrollerData, lstPaths, isLoadedCallback){
    if(comicScrollerData == null || comicScrollerData.WindowObj == null || comicScrollerData.DocumentObj == null
            || lstPaths == null || lstPaths.length <= 0
            || isLoadedCallback == null){
         //Becuase fuck you that's why
         return;
    }
    var local_lstPaths = [];
    lstPaths.forEach(element => {
        local_lstPaths.push(element);
    });

    //this assumes this never recieves a list of some obserd size
    LoadNextScript(local_lstPaths[0]);
    
    //TODO: loop better
    //need to load 1 at a time in case code files reference eachother
    function LoadNextScript(path) {
        var pathID = "ComicScript_" + path.hashCode();
        console.log("Comic_LoadScripts(): " + pathID + ":: " + path);
        var loadedScript = document.getElementById(pathID);

        //not loaded load it now
        if(loadedScript == null && path != null){
            var newScript = document.createElement("script");
            newScript.id = pathID;

            newScript.onreadystatechange = ComicLoop_LoadSuccessCallBack;
            newScript.onload = ComicLoop_LoadSuccessCallBack;
            newScript.onerror = ComicLoop_LoadFailCallBack;

            newScript.type = 'text/javascript';
            newScript.src = path;
            comicScrollerData.DocumentObj.head.appendChild(newScript);
        }
        //already loaded
        else{
            ComicLoop_LoadSuccessCallBack();
        }

        function ComicLoop_LoadSuccessCallBack(){
            ComicLocal_isLoadedCallBack(path, true);
        }
        function ComicLoop_LoadFailCallBack(){
            ComicLocal_isLoadedCallBack(path, false);
        }

    };
    function ComicLocal_isLoadedCallBack(path, bool_Success){
        if(!bool_Success){
            //we can't do anything about this error here were just going to load the rest and hope for the best
            console.log('Comic_LoadScripts(): Failed to load [' + path + ']');
        }
        local_lstPaths.splice(0, 1);
        if(local_lstPaths.length > 0){
            LoadNextScript(local_lstPaths[0]);
        }
        else{
            console.log("mainLoop.ComicLocal_isLoadedCallBack(): scriptLoad Complete");
            isLoadedCallback();
        }
    }
}

/**
 * isLoadedCallback(ComicData) is called on complete isLoadedCallback(this) == success, isLoadedCallback(null), failiure
 * @param {string} String_Path 
 * @param {function} isLoadedCallback  isLoadedCallback(ComicData)
 */
function Comic_LoadData(String_Path, isLoadedCallback){
    if(isLoadedCallback == null){
        return;
    }
    if(String_Path == null){
        isLoadedCallback(null);
    }

    var xhttp = new XMLHttpRequest();
    try{
        xhttp.onreadystatechange = Local_Isloaded;
        xhttp.open("GET", String_Path, true);
        xhttp.send(null);
    }
    catch(exception){
        console.log("Comic_LoadData(): Exception [" + exception + "] " + String_Path);
        isLoadedCallback(null);
    }

    function Local_Isloaded(){
        if(xhttp.readyState === 4){
            if (xhttp.status === 200) {
                var newData = null;
                 try{
                    newData = ComicData.ComicData_GetFromJsonData(JSON.parse(xhttp.response));
                 }
                 catch(exception){
                    console.log("Comic_LoadData(): Exception [" + exception + "] " + String_Path);
                }
                if(newData != null){
                    console.log("Comic_LoadData() data load Complete"); 
                }
                isLoadedCallback(newData);
            }
            else{
                console.log("Comic_LoadData(): Failed \"" + String_Path + "\" [" + xhttp.readyState + ", " +  xhttp.status + ", " + xhttp.statusText + "]"); 
                isLoadedCallback(null);
            }
        }
        else{
            //console.log("Comic_LoadData(): In Progress \"" + String_Path + "\" [" + xhttp.readyState + ", " +  xhttp.status + ", " + xhttp.statusText + "]"); 
        }
    }
}
/**
 * @param {ComicScrollerData} scrollerData 
 */
 function Comic_InitForNewData(scrollerData) {
    if(scrollerData == null || scrollerData.ComicData == null){
        return;
    }
    //make sure the pages that do exist update
    scrollerData.ComicData.Array_ComicPageData.forEach(function (pageData, index) {
        if(scrollerData.Array_ComicPageUIs.length <= index){
            scrollerData.Array_ComicPageUIs.push(new ComicPageUI(scrollerData, index))
        }
    });
    //hide the pages that are dead now
    scrollerData.Array_ComicPageUIs.forEach(function (pageUI, index) {
        if(index >= scrollerData.ComicData.Array_ComicPageData.length){
            pageUI.ReportClearUI();
        }
    });

    //update visible pages
    Comic_UpdateVisibleWindow(scrollerData);

    //update scale changes
    Comic_UpdateCamera(scrollerData);
}
/**
 * @param {ComicScrollerData} scrollerData 
 * @returns {boolean}
 */
function Comic_UpdateVisibleWindow(scrollerData){
    if(scrollerData == null
            || scrollerData.ComicData == null
            || scrollerData.ComicScrollLocation_Location == null){
                
        return false;
    }
    var VisibleFirstIndex = scrollerData.ComicScrollLocation_Location.Num_GetPageIndex() - Math.floor(scrollerData.ComicData.Num_visibleSetSize / 2);
    var VisibleWindowSize = scrollerData.ComicData.Num_visibleSetSize;
    var retVal = false;

    for(var loop = 0; loop < scrollerData.Array_ComicPageUIs.length; loop++){
        var PageUI = scrollerData.Array_ComicPageUIs[loop];
        if(loop >= VisibleFirstIndex && loop < (VisibleFirstIndex + VisibleWindowSize) ){
            retVal |= PageUI.bool_ReportShowUI();
        }
        else{
            retVal |= PageUI.bool_ReportClearUI();
        }
    }
    return retVal;
}
/**
 * @param {ComicScrollerData} scrollerData 
 */
function Comic_UpdateCamera(scrollerData){
    if(scrollerData == null
            || scrollerData.RootElement == null
            || scrollerData.CameraRoot == null
            || scrollerData.AspectRoot == null
            || scrollerData.ComicData == null
            || scrollerData.ComicData.Num_imageScaleLength <= 0
            || scrollerData.ComicData.Num_imageMinAspect <= 0
            || scrollerData.ComicData.Num_imageMaxAspect <= 0
            || (scrollerData.ComicData.Enum_ImageScaleSide != Enum_XY.X && scrollerData.ComicData.Enum_ImageScaleSide != Enum_XY.Y)) {
        
        return;
    }
    //update aspect ratio
    var MinAspect = 1;
    var MaxAspect = 1;
    switch(scrollerData.ComicData.Enum_ImageScaleSide){
        case Enum_XY.X:
            MinAspect =  (1.0 * scrollerData.ComicData.Num_imageScaleLength) / scrollerData.ComicData.Num_imageMaxAspect;
            MaxAspect =  (1.0 * scrollerData.ComicData.Num_imageScaleLength) / scrollerData.ComicData.Num_imageMinAspect;
            break;
        case Enum_XY.Y:
            MaxAspect = (1.0 * scrollerData.ComicData.Num_imageMaxAspect) / scrollerData.ComicData.Num_imageScaleLength;
            MinAspect =  (1.0 * scrollerData.ComicData.Num_imageMinAspect) / scrollerData.ComicData.Num_imageScaleLength;
            break;
    }
    var RootAspect = scrollerData.RootElement.clientWidth / scrollerData.RootElement.clientHeight; 

    //smaller then smalles apply shrink aspect
    if(MinAspect > RootAspect) {
        //not wide enough
        scrollerData.AspectRoot.style.width = "100%";
        scrollerData.AspectRoot.style.height = ((RootAspect / MinAspect) * 100) + "%";
    }
    else if(MaxAspect < RootAspect) {
        //not tall enough
        scrollerData.AspectRoot.style.width = (MaxAspect * (1 / RootAspect) * 100) + "%";
        scrollerData.AspectRoot.style.height = "100%";
    }
    else {
        //within bounts
        scrollerData.AspectRoot.style.width = "100%";
        scrollerData.AspectRoot.style.height = "100%";
    }
    

    //scale and center camera
    var centerX = 0;
    var centerY = 0;
    var clientLength = 0;

    var MinAspect = 1;
    var MaxAspect = 1;
    switch(scrollerData.ComicData.Enum_ImageScaleSide){
        default:
            return;
        case Enum_XY.X:
            //center/scale camera
            clientLength = scrollerData.AspectRoot.clientWidth;
            centerX = scrollerData.ComicData.Num_imageScaleLength / 2;
            break;
        case Enum_XY.Y:
            //center/scale camera
            clientLength = scrollerData.AspectRoot.clientHeight;
            centerX = scrollerData.ComicData.Num_imageScaleLength / 2;
            centerY = -centerX;
            break;
    }
    var scale = (clientLength * 1.0) / scrollerData.ComicData.Num_imageScaleLength;
    scrollerData.Num_LastCameraScale = scale; 

    //TODO scroll position
    var CameraPosition = scrollerData.ComicScrollLocation_Location.Vector2D_GetScrollLocation(new Vector2D());

    //apply transforms
    //
    //transforms are applied from left to right
    scrollerData.CameraRoot.style.transform = "scale(" + scale + "," + scale + ")"
                                                + "translate(" + (centerX - CameraPosition.x) + "px," + (centerY - CameraPosition.y) + "px)";
}
/**
 * @param {ComicScrollerData} scrollerData 
 * @param {number} index 
 */
function Comic_UpdateLayoutFromIndex(scrollerData, index){
    if(scrollerData == null
            || scrollerData.Array_ComicPageUIs == null
            || index < 0
            || index >= scrollerData.Array_ComicPageUIs.length){

        return;
    }
    for(var loop = index; loop < scrollerData.Array_ComicPageUIs.length; loop++){
        var pageUI = scrollerData.Array_ComicPageUIs[loop];
        if(pageUI != null
                && pageUI.bool_ReportLayoutUpdate()
                && !pageUI.Bool_IsVisible()){
   
            break;
        }
    }
    Comic_UpdateCamera(scrollerData);
}