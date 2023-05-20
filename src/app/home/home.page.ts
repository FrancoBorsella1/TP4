import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  //Bandera de modal
  isModalOpen = false;

  //Array que guarda los elementos de la lista
  items: any[] = [];

  //Funcion que cambia el estado de la bandera
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  //Agrega un elemento a la lista
  agregarElemento() {
    this.items.push('');
  }

  //Elimina un elemento de la lista
  async eliminarElemento(item: any) {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
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

  constructor(private toastController: ToastController) {}
}
