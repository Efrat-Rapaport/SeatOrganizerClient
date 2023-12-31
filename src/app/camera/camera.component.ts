import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ImgDataUrl } from 'src/models/ImgDataUrl';
import { RecognitionService } from '../recognition/recognition.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
// export class CameraComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

export class CameraComponent implements OnInit {
constructor(private _recognitionService:RecognitionService, private _snackBar:MatSnackBar){

}
@Output()
public pictureTaken = new EventEmitter<WebcamImage>();
// toggle webcam on/off
public _fromComponent ="";
public showWebcam = true;
public allowCameraSwitch = true;
public multipleWebcamsAvailable = false;
public deviceId!: string;
private _imgData:ImgDataUrl={ };
public videoOptions: MediaTrackConstraints = {
// width: {ideal: 1024},
// height: {ideal: 576}
};
public errors: WebcamInitError[] = [];
// webcam snapshot trigger
private trigger: Subject<void> = new Subject<void>();
// switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
public ngOnInit(): void {
this._fromComponent = (sessionStorage.getItem("component")!)

console.log(this._fromComponent)
WebcamUtil.getAvailableVideoInputs()
.then((mediaDevices: MediaDeviceInfo[]) => {
this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
});
}
public triggerSnapshot(): void{
this.trigger.next();

}
public toggleWebcam(): void {
this.showWebcam = !this.showWebcam;
}
public handleInitError(error: WebcamInitError): void {
this.errors.push(error);
}
public showNextWebcam(directionOrDeviceId: boolean|string): void {
// true => move forward through devices
// false => move backwards through devices
// string => move to device with given deviceId
this.nextWebcam.next(directionOrDeviceId);
}
public handleImage(webcamImage: WebcamImage): void {
console.info('received webcam image', webcamImage);
sessionStorage.setItem("guestImg", JSON.stringify(webcamImage));
this.pictureTaken.emit(webcamImage);
if(this._fromComponent== "fr"){
  this._snackBar.open('Captured succesfully', '✔',{duration:4000,  verticalPosition: 'top',  panelClass: ['success']});

}
}
public cameraWasSwitched(deviceId: string): void {
console.log('active device: ' + deviceId);
this.deviceId = deviceId;
}
public get triggerObservable(): Observable<void> {
return this.trigger.asObservable();
}
public get nextWebcamObservable(): Observable<boolean|string> {
return this.nextWebcam.asObservable();
}



}
