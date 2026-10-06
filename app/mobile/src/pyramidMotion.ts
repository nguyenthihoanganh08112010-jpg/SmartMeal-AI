/** Continuous bounded resistance; never lets a long pointer drag invert the card. */
export function pyramidDrag(delta:number){return Number.isFinite(delta)?100*Math.tanh(delta/150):0;}
