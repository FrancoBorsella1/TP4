import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import axios, { AxiosInstance, AxiosResponse, AxiosError, Axios } from 'axios';
import { Preferences } from '@capacitor/preferences';



interface Persona{
  key:any
  nombre:any,
  apellido:String,
  email:String,
  celular:String,
  localizacion:String,
}

interface Save{
  key:any,
  value:any
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

  //CONSUMICION DE LA API
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

    //ELIMINAMOS TAMBIEN DE LA BASE DE DATOS
    await Preferences.remove({key:item.key})

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

  //FUNCION GUARDAR EN LA BASE DE DATOS
  async guardar(data:Save){
    await Preferences.set(data)
  }

  //DAME TODAS LAS KEY GUARDADAS
  async dameLlaves(){
    return (await Preferences.keys()).keys
  }

  //DAME UN USUARIO GUARDADO
  async dameUsuario(item:any){
    return (await Preferences.get({key:item})).value
  }

  //DAME TODOS LOS DATOS DE LA BASE DE DATOS
  async dameTodo(){

    //ITERAMOS CON TODAS LAS LLAVES
    return (await this.dameLlaves()).forEach(async (e)=>{

        //BUSCAMOS EN AL BASE DE DATOS LOS USUAIROS CON SUS RESPECTIVAS LLAVES
        await this.dameUsuario(e).then((data:any)=>{

          //EL ALMACENARLAS COMO UN STRING, DEBEMOS CONVERTIRLO EN UN JSON
          var obj = JSON.parse(data)

          var item = {
            key:e,
            nombre: obj.nombre,
            apellido:obj.apellido,
            email:obj.email,
            celular:obj.celular,
            localizacion:obj.localizacion
          }

          //MOSTRAMOS EN LA INTERFACE
          this.agregarElemento(item);
        })
      })
  }

  //SI LA BD ESTA VACIA
  async esVacia(){
    if((await this.dameLlaves()).length > 0)
      return false
    else
      return true
  }

  //FUNCION PRINCIPAL
  async main(){

   var datos;
   var vacia = await this.esVacia();

   //SI LA BASE DE DATOS ESTA VACIA
   if(vacia){
      //CONSULTAMOS A LA API
      datos = await this.getData();
      //MAPEAMOS LOS VALORES DE LA API Y LOS AGREGAMOS AL ARRAY CREADO
      datos.map(async (e:any) =>{
        var key = `${Math.random()}`; // LAS KEY LAS GENERAMOS DE FORMA ALEATORIA
        var data = {
            key:key,
            nombre:e.name.first,
            apellido:e.name.last,
            email:e.email,
            celular:e.phone,
            localizacion:e.location.name
          }
          //LO AGREGAMOS A LA LISTA DE LA INTERFACE
          this.agregarElemento(data)

          //GUARDAMOS EN LA BASE DE DATOS
          await this.guardar({key:key,value:JSON.stringify(data)})

        }
      );
    }
    else{ //SINO
      //MOSTRAMOS LO GUARDADO
      await this.dameTodo()
    }
  }

  constructor(private toastController: ToastController) {
    this.main()

  }

}
