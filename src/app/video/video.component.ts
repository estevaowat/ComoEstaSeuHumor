import { Component, OnInit, Provider } from '@angular/core';
import { Subject } from 'rxjs'
import { Observable } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam'
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
  public btnAnalisarRosto: boolean = false
  public mostraLoader: boolean = false
  public print: string
  private webcamImage: WebcamImage = null
  public errors: WebcamInitError[] = [];

  public mensagemErro: string = ""

  constructor(private googleVisionService: GoogleVisionService) { }

  ngOnInit() {

  }

  private trigger: Subject<void> = new Subject<void>();

  public triggerSnapshot(): void {
    this.toggleLoader();
    this.toggleBotaoAnalisarRosto();
    this.trigger.next();
    
  }
  public handleImage(webcamImage: WebcamImage): void {
    this.print = webcamImage.imageAsDataUrl
    this.googleVisionService.analisarFoto(webcamImage)
      .subscribe((resultadoImagem) => {

        if (Object.keys(resultadoImagem).length > 0) {
          if (resultadoImagem.faceAnnotations.length > 0) {
            // se deu certo 
            resultadoImagem = resultadoImagem.faceAnnotations[0]

            this.probabilidades.raiva = this.trocarTextoIngles(resultadoImagem.angerLikelihood)
            this.probabilidades.borrado = this.trocarTextoIngles(resultadoImagem.blurredLikelihood)
            this.probabilidades.acessoriosCabeca = this.trocarTextoIngles(resultadoImagem.headwearLikelihood)
            this.probabilidades.alegria = this.trocarTextoIngles(resultadoImagem.joyLikelihood)
            this.probabilidades.tristeza = this.trocarTextoIngles(resultadoImagem.sorrowLikelihood)
            this.probabilidades.surpresa = this.trocarTextoIngles(resultadoImagem.surpriseLikelihood)
          }
        }
        else {
          this.fotoDesconhecida()
        }
      },
        (error: any) => {
          this.fotoDesconhecida()
          this.toggleLoader()
          this.toggleBotaoAnalisarRosto()
        },
        () => {
          this.toggleLoader()
          this.toggleBotaoAnalisarRosto()
        }
      )
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
    
    this.mensagemErro = this.errors[0].message
    this.toggleBotaoAnalisarRosto()
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public trocarTextoIngles(texto: string): string {

    switch (texto) {
      case "UNKNOWN":
        return "Desconhecida"
      case "VERY_UNLIKELY":
        return "Muito Pouco Provável"
      case "UNLIKELY":
        return "Pouco Provável"
      case "POSSIBLE":
        return "Possível"
      case "LIKELY":
        return "Provável"
      case "VERY_LIKELY":
        return "Muito Provável"
    }
  }

  public toggleBotaoAnalisarRosto(): void {
    this.btnAnalisarRosto = !this.btnAnalisarRosto
  }

  public toggleLoader(): void {
    this.mostraLoader = !this.mostraLoader
  }
  public fotoDesconhecida(): void {
    this.probabilidades.raiva = this.trocarTextoIngles("UNKNOWN")
    this.probabilidades.borrado = this.trocarTextoIngles("UNKNOWN")
    this.probabilidades.acessoriosCabeca = this.trocarTextoIngles("UNKNOWN")
    this.probabilidades.alegria = this.trocarTextoIngles("UNKNOWN")
    this.probabilidades.tristeza = this.trocarTextoIngles("UNKNOWN")
    this.probabilidades.surpresa = this.trocarTextoIngles("UNKNOWN")
  }
}


