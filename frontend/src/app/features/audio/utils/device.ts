import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceChecker {
  constructor() {}

  isRetina(): boolean {
    if (window.matchMedia) {
      const mq = window.matchMedia(
        'only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)'
      );
      return (mq && mq.matches) || window.devicePixelRatio > 1;
    }
    return false;
  }

  isMobile(): boolean {
    const check =
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        navigator.userAgent
      );
    return check;
  }
}
