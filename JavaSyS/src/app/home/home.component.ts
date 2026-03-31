import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  emailLink: string = 'https://mail.google.com/mail/?view=cm&fs=1&to=jp.becerradiaz@gmail.com';

  ngOnInit() {
    this.checkDevice();
  }

  checkDevice() {
    if (typeof navigator !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        this.emailLink = 'mailto:jp.becerradiaz@gmail.com';
      }
    }
  }
}
