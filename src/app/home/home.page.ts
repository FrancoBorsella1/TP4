import { Component } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse, AxiosError, Axios } from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {


  async getData(): Promise<any> {
    return new Promise((resolve)=>{
      axios.get('https://randomuser.me/api/?results=10').then((response:AxiosResponse)=>{
        resolve(response.data.results)
      })
    })
  }

  async main(){
    var datos = await this.getData();

  }

  constructor() {

  }

}
