Enum_MouseButtons = {
    INVALID_MOUSE_BUTTON: "NA",
    LEFT_MOUSE_BUTTON: "L",
    MIDDLE_MOUSE_BUTTON: "M",
    RIGHT_MOUSE_BUTTON: "R",
};
class ComicInputManager {
    constructor(){
        this.ComicScrollerData = null;
        this.requestAnimationFrame_ID = null;
        this.ArrayTouch_ongoing = []; //touch instances that have not seen down but not up yet
    
        this.Num_TotalElapsedTime = null;
        this.SaveTimer = 0;

        this.Num_LastTouchTime = null;

        this.Vector2D_scrollMomentum = new Vector2D();
        this.Num_MomentumStartTime = null;
        this.Num_MomentumProgressTime = 0;
    }
    
    /**
     * @param {ComicScrollerData} scrollerData 
     */
    SetUpCallbacks(scrollerData){
        if(scrollerData == null
                || scrollerData.DocumentObj == null
                || scrollerData.WindowObj == null
                || scrollerData.RootElement == null
                || scrollerData.AspectRoot == null
                || scrollerData.CameraRoot == null){
            
            return;
        }
        this.ComicScrollerData = scrollerData;

        var self = this;

        scrollerData.CameraRoot.addEventListener("touchstart", function (e) { self.callback_touchstart(e) }, false);
        scrollerData.CameraRoot.addEventListener("touchend", function (e) { self.callback_touchend(e) }, false);
        scrollerData.CameraRoot.addEventListener("touchcancel", function (e) { self.callback_touchcancel(e) }, false);
        scrollerData.CameraRoot.addEventListener("touchmove", function (e) { self.callback_touchmove(e) }, false);
        scrollerData.CameraRoot.addEventListener('wheel',  function (e) { self.callback_onwheel(e); });
        scrollerData.WindowObj.addEventListener("resize", function () { self.callback_resize(); });
        this.callback_requestAnimationFrame(null);
    }
    /**
     * @param {number} idToFind 
     * @returns {number}
     */
    ongoingTouchIndexById(idToFind) {
        for (var loop = 0; loop < this.ArrayTouch_ongoing.length; loop++) {
            var id = this.ArrayTouch_ongoing[loop].identifier;
        
            if (id == idToFind) {
                return loop;
            }
        }
        return -1;    // not found
    }
    /**
     * @param {Touch} param0 
     * @returns {Touch}
     */
    copyTouch({ identifier, pageX, pageY }) {
        return { identifier, pageX, pageY };
    }

    /**
     * @param {Vector2D} DeltaTime
     */
    ResetMomentum(newMomentum){
        if(this.Num_TotalElapsedTime == null){
            return;
        }
        if(newMomentum == null){
            newMomentum = new Vector2D();
        }
        this.Vector2D_scrollMomentum.Assign(newMomentum);
        this.Num_MomentumProgressTime = 0;

        if(this.Vector2D_scrollMomentum.x != 0
                || this.Vector2D_scrollMomentum.y != 0){
            
            this.Num_MomentumStartTime = this.Num_TotalElapsedTime;
        }
        else{
            this.Num_MomentumStartTime = null;
        }
    }

    /**
     * @param {number} DeltaTime //or null
     */
    callback_requestAnimationFrame(Num_TotalElapsedTime){
        //console.log("ComicInputManage.callback_requestAnimationFrame()");
        if(this.ComicScrollerData == null || this.ComicScrollerData.WindowObj == null){
            return;
        }

        //handle elapsed time
        var milisecondsPased = 0;
        if(Num_TotalElapsedTime != null){
            if(this.Num_TotalElapsedTime != null){
                milisecondsPased = Num_TotalElapsedTime - this.Num_TotalElapsedTime; 
            }
            this.Num_TotalElapsedTime = Num_TotalElapsedTime;
        }

        //handle momentum if no touches are in progress(for mobile)
        if(this.ComicScrollerData.ComicData != null
                && this.Num_MomentumStartTime != null
                && this.ArrayTouch_ongoing.length <= 0){
            
            var timeSinceLast = this.Num_TotalElapsedTime - this.Num_MomentumStartTime;
            this.Num_MomentumStartTime = this.Num_TotalElapsedTime;
            if(timeSinceLast > milisecondsPased && timeSinceLast > 700){
                this.Vector2D_scrollMomentum.SetToZero();
            }
            this.Num_MomentumProgressTime += timeSinceLast;
            if(this.Vector2D_scrollMomentum.x != 0
                    && this.Vector2D_scrollMomentum.y != 0
                    && this.Num_MomentumProgressTime > 0
                    && milisecondsPased > 0){

                var currentSpeed = new Vector2D();
                currentSpeed.Assign(this.Vector2D_scrollMomentum);
                currentSpeed.MultiplySelf(milisecondsPased * (1 / this.Num_MomentumProgressTime));
            
                if(currentSpeed.x == 0 && currentSpeed.y == 0){
                    this.Vector2D_scrollMomentum.SetToZero();
                }
                else {
                    //scroll position
                    var remainder = this.ComicScrollerData.ComicScrollLocation_Location.Vector2D_ScrollInDirection(currentSpeed);
                    
                    //kick visible pages
                    Comic_UpdateVisibleWindow(this.ComicScrollerData);

                    //kick camera
                    Comic_UpdateCamera(this.ComicScrollerData);

                    //stop momentum if scroll changed direction
                    this.Vector2D_scrollMomentum.SubtractFromSelf(remainder);
                }
            }
        }

        //handle cookie
        //
        //instead of updating the cookie every single time the user scrolls
        // we intead are going to try every few seonds to update to update if we have new data
        if(this.ComicScrollerData.ComicScrollLocation_Location != null){
            this.SaveTimer += milisecondsPased;
            if(this.SaveTimer >= 15000){
                this.SaveTimer = 0;

                this.ComicScrollerData.ComicScrollLocation_Location.Update_Cookie();
            }
        }

        //request next frame        
        var self = this;
        this.requestAnimationFrame_ID = this.ComicScrollerData.WindowObj.requestAnimationFrame(function (time) { self.callback_requestAnimationFrame(time); });

    }
    callback_resize(){
        //kick camera
        Comic_UpdateCamera(this.ComicScrollerData);
    }
    /**
     * @param {WheelEvent} event 
     */
    callback_onwheel(event){
        //console.log("ComicInputManage.callback_onwheel()");
        if(event == null
                || this.ComicScrollerData == null
                || this.ComicScrollerData.WindowObj == null
                || this.ComicScrollerData.ComicScrollLocation_Location == null
                || this.ComicScrollerData.ComicData == null){
            
            return;
        }
        event.preventDefault();

        var speedFactor = 1.0 * this.ComicScrollerData.ComicData.Num_scrollSpeed / this.ComicScrollerData.Num_LastCameraScale; 

        var remainder = this.ComicScrollerData.ComicScrollLocation_Location.Num_ScrollInDirection(event.deltaY * speedFactor);
        remainder /= this.ComicScrollerData.ComicData.Num_scrollSpeed;

        this.ComicScrollerData.WindowObj.scrollTo({ top: window.scrollY + remainder
                                                , left: window.scrollX + event.deltaX
                                                , behavior: "smooth"} );
      
        //arrest any momentum we have
        this.ResetMomentum(new Vector2D());
                                            
        //kick visible pages
        Comic_UpdateVisibleWindow(this.ComicScrollerData);

        //kick camera
        Comic_UpdateCamera(this.ComicScrollerData);
    }
    /**
     * @param {TouchEvent} event 
     */
    callback_touchstart(event){
        //console.log("ComicInputManage.callback_touchStart()");
        var touches = event.changedTouches;
        for (var loop = 0; loop < touches.length; loop++) {
            this.ArrayTouch_ongoing.push(this.copyTouch(touches[loop]));
        }

        this.Num_LastTouchTime = this.Num_TotalElapsedTime;
    }
    /**
     * @param {TouchEvent} event 
     */
    callback_touchend(event){
        //console.log("ComicInputManage.callback_touchEnd()");

        //update seen touches
        var touches = event.changedTouches;
        for (var loop = 0; loop < touches.length; loop++) {
            var idx = this.ongoingTouchIndexById(touches[loop].identifier);
            if (idx >= 0) {
                this.ArrayTouch_ongoing.splice(idx, 1);
            }
        }

        //update touch time
        this.Num_LastTouchTime = this.Num_TotalElapsedTime;
    }
    /**
     * @param {TouchEvent} event 
     */
    callback_touchcancel(event){
        //console.log("ComicInputManage.callback_touchCancel()");

        //update seen touches
        var touches = event.changedTouches;
        for (var loop = 0; loop < touches.length; loop++) {
            var idx = this.ongoingTouchIndexById(touches[loop].identifier);
            this.ArrayTouch_ongoing.splice(idx, 1);
        }

          //update touch time
          this.Num_LastTouchTime = this.Num_TotalElapsedTime;
    }
    /**
     * @param {TouchEvent} event 
     */
    callback_touchmove(event){
        //console.log("ComicInputManage.callback_touchmove()");
        var touches = event.changedTouches;

        var NumChanges = 0;
        var TotalMovement = new Vector2D();
        for (var loop = 0; loop < touches.length; loop++) {
            var newTouch = touches[loop];
            var idx = this.ongoingTouchIndexById(touches[loop].identifier);

            if (idx >= 0) {
                var oldTouch = this.ArrayTouch_ongoing[idx];

                var touchMovement = new Vector2D(newTouch.pageX - oldTouch.pageX
                                                , newTouch.pageY - oldTouch.pageY);

                if(touchMovement.x != 0 || touchMovement.y != 0){
                    TotalMovement.AddToSelf(touchMovement);
                    NumChanges++;
                }

                //update cached touch data
                this.ArrayTouch_ongoing.splice(idx, 1, this.copyTouch(touches[loop]));
            }
        }

        if(NumChanges <= 0
                || event == null
                || this.ComicScrollerData == null
                || this.ComicScrollerData.WindowObj == null
                || this.ComicScrollerData.ComicScrollLocation_Location == null
                || this.ComicScrollerData.ComicData == null){
        
            //if three are no changes or no data, bail
            return;
        }
        //average all changes
        TotalMovement.MultiplySelf(1.0 / NumChanges);
        TotalMovement.MultiplySelf(1.0 / this.ComicScrollerData.Num_LastCameraScale);
        TotalMovement.MultiplySelf(-1);
        

        //kick scroll
        var MovementRemainder = this.ComicScrollerData.ComicScrollLocation_Location.Vector2D_ScrollInDirection(TotalMovement);
       
        //update momentum
        if(this.Num_LastTouchTime != null && this.Num_LastTouchTime != this.Num_TotalElapsedTime){
            var newMomentum = new Vector2D();
            newMomentum.Assign(TotalMovement);
            newMomentum.SubtractFromSelf(MovementRemainder);

            //scroll momentum is in unite per milisecond
            newMomentum.MultiplySelf(this.Num_TotalElapsedTime - this.Num_LastTouchTime)
        
            this.ResetMomentum(newMomentum);
        }

        MovementRemainder.MultiplySelf(this.ComicScrollerData.Num_LastCameraScale); //remove speed factor
        MovementRemainder.MultiplySelf(-1);

        
        //kick visible pages
        Comic_UpdateVisibleWindow(this.ComicScrollerData);

        //kick camera
        Comic_UpdateCamera(this.ComicScrollerData);

        //Setting the scaleFactor as follows causes the viewport to zoom out
        //as far as possible
        var scaleFactor = 1 / window.devicePixelRatio;
        //this.ScaleMetaViewport(scaleFactor);
        
        this.ComicScrollerData.WindowObj.scrollTo({ top: window.scrollY + MovementRemainder.y
                                                , left: window.scrollX + MovementRemainder.x
                                                , behavior: "smooth"});
                                                
        //update touch time
        this.Num_LastTouchTime = this.Num_TotalElapsedTime;
    }
}