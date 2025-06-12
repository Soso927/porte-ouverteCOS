import { Popup } from "./classes/Popup.js";
import { updateClock, afficherDateAccueil} from "./classes/Date.js"

let popup = new Popup();
popup.initPopup();
setInterval(updateClock, 1000);
updateClock();
afficherDateAccueil();