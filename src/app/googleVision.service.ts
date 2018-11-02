import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { map } from 'rxjs/operators'
import { Observable } from "rxjs";
import { WebcamImage } from "ngx-webcam";


const URL_GOOGLE_API = 'https://vision.googleapis.com/v1/images:annotate?key='
const TOKEN_GOOGLE_VISION = 'AIzaSyDGz2i9KZ2T_H8J3HumxAm0oxooLpNh69s'

@Injectable()
export class GoogleVisionService {
    constructor(private http: Http) { }

    public analisarFoto(imagem: WebcamImage): Observable<any> {
        var requisicao = {
            "requests": [
                {
                    "features": [
                        {
                            "type": "FACE_DETECTION"
                        }
                    ],
                    "image": {
                        "content": imagem.imageAsBase64
                    }
                }
            ]
        }

        return this.http.post(`${URL_GOOGLE_API} + ${TOKEN_GOOGLE_VISION}`, JSON.stringify(requisicao))
            .pipe(
                map((resposta: Response) => {
                    return resposta.json().responses[0]
                })
            )
    }
}