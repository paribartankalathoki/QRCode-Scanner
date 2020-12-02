import { Component } from '@angular/core';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  scanSubscription;
  
  constructor(
    private qrScanner: QRScanner,
    private toastCtrl: ToastController
  ) {}
  
  ionViewWillEnter() {
    // this.a();
    this.scan();
  }
  ionViewWillLeave() {
    this.stopScanning();
  }
  a() {
    // Optionally request the permission early
this.qrScanner.prepare()
.then((status: QRScannerStatus) => {
   if (status.authorized) {
     // camera permission was granted


     // start scanning
     let scanSub = this.qrScanner.scan().subscribe((text: string) => {
       console.log('Scanned something', text);

       this.qrScanner.hide(); // hide camera preview
       scanSub.unsubscribe(); // stop scanning
     });

   } else if (status.denied) {
     // camera permission was permanently denied
     // you must use QRScanner.openSettings() method to guide the user to the settings page
     // then they can grant the permission from there
   } else {
     // permission was denied, but not permanently. You can ask for permission again at a later time.
   }
})
.catch((e: any) => console.log('Error is', e));
  }

  scan() {
    console.log('calling the scanner');
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.qrScanner.show();
          this.scanSubscription = this.qrScanner.scan().subscribe(async (text:string) => {
            let toast =  await this.toastCtrl.create({
              color: 'dark',
              message: `${text}`,
              duration: 2000,
            });
            toast.present();

            // let toast = this.toastCtrl.create({
            //   message: `${text}`,
            //   position: 'top',
            //   duration: 3000,
            //   closeButtonText: 'OK'
            // });
            // toast.present();
          });
        } else {
          console.error('Permission Denied', status);
        }
      })
      .catch((e: any) => {
        console.error('Error', e);
      });
  }

  stopScanning() {
    (this.scanSubscription) ? this.scanSubscription.unsubscribe() : null;
    this.scanSubscription=null;
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    this.qrScanner.hide();
    this.qrScanner.destroy();
  }
}
