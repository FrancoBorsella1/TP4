import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import axios, { AxiosInstance, AxiosResponse, AxiosError, Axios } from 'axios';

interface Persona{
  nombre:String,
  apellido:String,
  email:String,
  celular:String,
  localizacion:String,
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  //Bandera de modal
  isModalOpen = false;

  personas: Persona[]=[];

  selectedPersona:Persona | undefined;


  //Funcion que cambia el estado de la bandera
  setModalOpen(item:Persona){
    this.selectedPersona = item;
    this.isModalOpen = true;
  }
  setModalClose(){
    this.isModalOpen = false;
  }

  //Agrega un elemento a la lista
  agregarElemento(item:Persona) {
    this.personas.push(item);
  }

  async getData(): Promise<any> {
    return new Promise((resolve)=>{
      axios.get('https://randomuser.me/api/?results=10').then((response:AxiosResponse)=>{
        resolve(response.data.results)
      }).catch(()=>{
        this.mostrarToast("ERROR EN LA CONECCION A LA API")
      })
    })
  }


  //Elimina un elemento de la lista
  async eliminarElemento(item: Persona) {
    const index = this.personas.indexOf(item);
    if (index > -1) {
      this.personas.splice(index, 1);
      await this.mostrarToast('Elemento eliminado correctamente');
    }
  }

  //Muestra mensaje de eliminación correcta de un elemento de la lista
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async main(){
    //TRAEMOS LOS VALORES DE LA API
    var datos = await this.getData();

    //MAPEAMOS LOS VALORES DE LA API Y LOS AGREGAMOS AL ARRAY CREADO
    datos.map((e:any) => this.agregarElemento({
      nombre:e.name.first,
      apellido:e.name.last,
      email:e.email,
      celular:e.phone,
      localizacion:e.location.name
    }));

  }

  constructor(private toastController: ToastController) {
    this.main()
  }

}
