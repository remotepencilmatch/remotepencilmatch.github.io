//[x]
//[y]
class Vector2D{
    constructor(x = 0.0, y = 0.0){
        this.x = x;
        this.y = y;
    }
    /** @param {Vector2D} other */
    Assign(other){
        if(other == null){
            return;
        }
        this.x = other.x;
        this.y = other.y;
    }
    SetToZero(){
        this.x = 0;
        this.y = 0;
    }
    Normalize(){
        var Length = this.Num_GetLength();
        if(Length == 0){
            return;
        }
        this.x /= Length;
        this.y /= Length;
    }
    /** @param {Vector2D} other */
    AddToSelf(other){
        if(other == null){
            return;
        }
        this.x += other.x;
        this.y += other.y;
    }
    /** @param {Vector2D} other */
    SubtractFromSelf(other){
        if(other == null){
            return;
        }
        this.x -= other.x;
        this.y -= other.y;
    }
    MultiplySelf(Num_Amount){
        this.x *= Num_Amount;
        this.y *= Num_Amount;
    }
    ReverseXY(){
        var temp = this.x;
        this.x = this.y;
        this.y = temp;
    }
    Num_GetLength(){
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    Num_GetManhattan(){
        return Math.abs(this.x) + Math.abs(this.y);
    }
    Num_GetRadians(){
        var self = this;
        if(self.Num_GetLength() != 1){
            self = new Vector2D();
            self.Assign(this);
            self.Normalize();
        }
        var RetVal = -Math.acos(self.x);
        if(self.y < 0){
            RetVal = (Math.PI - RetVal) + Math.PI;
        }

        return RetVal;
    }
    /**
     * @param {Vector2D} other 
     */
    bool_isEqual(other){
        if(this == other){
            return true;
        }
        if(other == null){
            return false;
        }
        return this.x == other.x && this.y == other.y;
    }
    /**
     * @param {Object} JSONObject 
     */
     bool_LoadFromFileData(JSONObject){
        if(typeof JSONObject !== "object" || JSONObject == null){                   
            return false;   
        }
        /*
         {
             "x": 5,
             "y": 5
         } 
        */
        this.SetToZero();
        if(typeof JSONObject.x === 'number'){
            this.x = JSONObject.x;
        }
        if(typeof JSONObject.y === 'number'){
            this.y = JSONObject.y;
        }
        return true;
    }
}

/**
 * @param {Vector2D} a 
 * @param {Vector2D} b 
 */
function Num_DotProduct(a, b){
    if(a == null || b == null){
        return 0;
    }
    return (a.x * b.x) + (a.y * b.y);
}

/**
 * return a unit vetcor in the direction given
 * @param {number} Num_Radians 
 */
function Vector_GetNormal(Num_Radians){
    var RetVal = new Vector2D();
    RetVal.x = Math.cos(Num_Radians);
    RetVal.y = -Math.sin(Num_Radians);
    return RetVal;
}

function Num_Clamp(Num, min, max){
    if(Num < min){
        return min;
    }
    else if(Num > max){
        return max;
    }
    return Num;
}
function Num_ClampRadians(Num){
    var Tau = Math.PI * 2;
    if(Num > Tau){
        return Num - (Tau * Math.trunc(Num / Tau))
    }
    if(Num < 0){
        if(Num < -Tau){
            Num = -Num_ClampRadians(-Num);
        }
        return Tau + Num;
    }
    return Num;
}
/**
 * returns true if the line Segment defined by (a1, a2) intersects the line segment defined by (b1, b2)
 * @param {Vector2D} a 
 * @param {Vector2D} b
 * @param {number} Perc
 */
function Vector2D_GetPointBetween(a, b, Perc){
    if(a == null || b == null){
        return null;
    }
    var retVal = new Vector2D();
    retVal.x = ((b.x - a.x) * Perc) + a.x;
    retVal.y = ((b.y - a.y) * Perc) + a.y;

    return retVal; 
}
/**
 * returns true if the line Segment defined by (a1, a2) intersects the line segment defined by (b1, b2)
 * @param {Vector2D} a1 
 * @param {Vector2D} a2 
 * @param {Vector2D} b1 
 * @param {Vector2D} b2 
 */
function Bool_DoesLineIntersect(a1, a2, b1, b2){
    if(a1 == null
            || a2 == null
            || b1 == null
            || b2 == null){
        return false;
    }
    
    //(a1, a2) -> ax + c = y
    //(b1, b2) -> bx + d = y
    //x = (d - c)/(a - b)
    //Profit

    if(a2.x != a1.x){
        var a = (a2.y - a1.y) / (a2.x - a1.x);
        var c = a1.y - (a * a1.x);

        if(b2.x != b1.x){
            var b = (b2.y - b1.y) / (b2.x - b1.x);
            var d = b1.y - (b * b1.x);

            //parellel?
            if(a == b){
                //diffenrent lines
                if(c != d){
                    return false;
                }
                //same line do they overlap
                return Bool_IsPointBetween(a1, a2, b1) ||  Bool_IsPointBetween(a1, a2, b2);
            }
        }
    }
    //a and b are vertical (parellel)
    else if(b2.x == b1.x){
        //diffenrent lines
        if(a1.x != b1.x){
            return false;
        }
        //same line do they overlap
        return Bool_IsPointBetween(a1, a2, b1) || Bool_IsPointBetween(a1, a2, b2);
    }

    var intersect = Vector_GetIntersection(a1, a2, b1, b2);

    //they do intersect if intersect is beween (a1, a2) and (b1, b2) 
    return Bool_IsPointBetween(a1, a2, intersect) && Bool_IsPointBetween(b1, b2, intersect);
}
/**
 * given the lines (a1, a2) and (b1, b2) returns the point they intersect. otherwise returns null
 * @param {Vector2D} a1 
 * @param {Vector2D} a2 
 * @param {Vector2D} b1 
 * @param {Vector2D} b2 
 */
function Vector_GetIntersection(a1, a2, b1, b2){
    if(a1 == null
            || a2 == null
            || b1 == null
            || b2 == null){
        return null;
    }
    //no line for a
    if(a1.x == a2.x && a1.y == a2.y){
        return null;
    }
    //no line for b
    if(b1.x == b2.x && b1.y == b2.y){
        return null;
    }

    //(a1, a2) -> ax + c = y
    //(b1, b2) -> bx + d = y
    //x = (d - c)/(a - b)
    //Profit
    var RetVal = new Vector2D();

    //a is vertical
    if(a1.x == a2.x){
        //b is vertical
        if(b1.x == b2.x){
            return null;
        }
        //b is horizontal
        else if(b1.y == b2.y){
            RetVal.x = a1.x;
            RetVal.y = b1.y;
        }
        //b is diagonal
        else{
            var b = (b2.y - b1.y) / (b2.x - b1.x);
            var d = b1.y - (b * b1.x);

            RetVal.x = a1.x;
            RetVal.y = (b * RetVal.x) + d;
        }
    }
    //a is horizontal
    else if(a1.y == a2.y){
        //b is vertical
        if(b1.x == b2.x){
            RetVal.x = b1.x;
            RetVal.y = a1.y; 
        }
        //b is horizontal
        else if(b1.y == b2.y){
            return null;
        }
        //b is diagonal
        else{
            var b = (b2.y - b1.y) / (b2.x - b1.x);
            var d = b1.y - (b * b1.x);

            RetVal.y = a1.y;
            RetVal.x = (RetVal.y - d) / b;
        }
    }
    //a is diagonal
    else{
        var a = (a2.y - a1.y) / (a2.x - a1.x);
        var c = a1.y - (a * a1.x);

        //b is vertical
        if(b1.x == b2.x){
            RetVal.x = b1.x;
            RetVal.y = (a * RetVal.x) + c;
        }
        //b is horizontal
        else if(b1.y == b2.y){
            RetVal.y = b1.y;
            RetVal.x = (RetVal.y - c) / a;
        }
        //b is diagonal
        else{
            var b = (b2.y - b1.y) / (b2.x - b1.x);
            var d = b1.y - (b * b1.x);

            RetVal.x = (d - c) / (a - b);
            RetVal.y = (a * RetVal.x) + c;
        }
    }

    //if retVal is in both segments then return it. otherwise null
    if(Bool_IsPointBetween(a1, a2, RetVal) && Bool_IsPointBetween(b1, b2, RetVal)){
        return RetVal;
    }
    return null;
}

/**
 * returns true if c is between a and b, (it is assumed that a, b, and c are on the same line)
 * @param {Vector2D} a 
 * @param {Vector2D} b 
 * @param {Vector2D} c 
 */
function Bool_IsPointBetween(a, b, c){
    if(a == null
            || b == null
            || c == null){
        return false;
    }
    var MinX = Math.min(a.x, b.x);
    var MinY = Math.min(a.y, b.y);
    var MaxX = Math.max(a.x, b.x);
    var MaxY = Math.max(a.y, b.y);

    return MinX <= c.x && MaxX >= c.x && MinY <= c.y && MaxY >= c.y;
}
/**
 * return true if test1 is on the same side of the line defined by (a1, a2) as test2, if either are on the line then this will return true
 * @param {Vector2D} a1 
 * @param {Vector2D} a2 
 * @param {Vector2D} test1 
 * @param {Vector2D} test2 
 */
function bool_IsOnSameSide(a1, a2, test1, test2){
    if(a1 == null
            || a2 == null
            || test1 == null
            || test2 == null){
        return false;
    }
    //a is vertical
    if(a2.x == a1.x){
        return (bool_SameSign(test1.x - a1.x) == bool_SameSign(test2.x - a1.x));
    }
    //a is vertical
    if(a2.y == a1.y){
        return (bool_SameSign(test1.y - a1.y) == bool_SameSign(test2.y - a1.y));
    }
     //(a1, a2) -> ax + c = y -> (y - c) / a = x
     var a = (a2.y - a1.y) / (a2.x - a1.x);
     var c = a1.y - (a * a1.x);

     return bool_SameSign((test1.y - ((a * test1.x) + c)), (test2.y - ((a * test2.x) + c)))
            && bool_SameSign((test1.x - ((test1.y - c) / a)), (test2.x - ((test2.y - c) / a)));
}
/**
 * returns true if a has the same sign as b. if either a or b are 0 this returns true
 * @param {Number} a 
 * @param {Number} b 
 */
function bool_SameSign(a, b){
    return (a == 0) || (b == 0) || (a > 0 == b > 0); 
}