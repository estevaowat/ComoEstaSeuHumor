import { Component, OnInit, Provider } from '@angular/core';
import { Subject } from 'rxjs'
import { Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam'
import { GoogleVisionService } from "../googleVision.service";
import { Probabilidades } from "../probabilidade.model";


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  providers: [GoogleVisionService]
})

export class VideoComponent implements OnInit {


  public probabilidades: Probabilidades = new Probabilidades()


  private webcamImage: WebcamImage = null

  constructor(private googleVisionService: GoogleVisionService) { }

  ngOnInit() {
  }

  private trigger: Subject<void> = new Subject<void>();

  public triggerSnapshot(): void {
    this.trigger.next();
  }
  public handleImage(webcamImage: WebcamImage): void {
    //  console.info('received webcam image', webcamImage);
    this.googleVisionService.analisarFoto(webcamImage)
      .subscribe((resultadoImagem) => {
        this.probabilidades.raiva = this.trocarTextoIngles(resultadoImagem.angerLikelihood)
        this.probabilidades.borrado = this.trocarTextoIngles(resultadoImagem.blurredLikelihood)
        this.probabilidades.acessoriosCabeca = this.trocarTextoIngles(resultadoImagem.headwearLikelihood)
        this.probabilidades.alegria = this.trocarTextoIngles(resultadoImagem.joyLikelihood)
        this.probabilidades.tristeza = this.trocarTextoIngles(resultadoImagem.sorrowLikelihood)
        this.probabilidades.surpresa = this.trocarTextoIngles(resultadoImagem.surpriseLikelihood)



      },
        (error: any) => console.log(error)
      )
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public trocarTextoIngles(texto: string): string {

    switch (texto) {
      case "UNKNOWN":
        return "Desconhecida"
      case "VERY_UNLIKELY":
        return "Muito pouco provavel"
      case "UNLIKELY":
        return "pouco provavel"
      case "POSSIBLE":
        return "Possivel"
      case "LIKELY":
        return "Provavel"
      case "VERY_LIKELY":
        return "Muito Provavel"
    }
  }
}
