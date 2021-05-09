import { Component, Input, OnInit, Output , EventEmitter, ViewChild, ElementRef, AfterViewChecked, AfterContentChecked, OnChanges, SimpleChange} from '@angular/core';
import { DartPlayer, DartService } from 'src/app/services/dart.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.less']
})
export class PlayerComponent implements OnInit{
  @ViewChild('sc', {static: false}) inputEl!:ElementRef;
  prPlaying: number = 0;
  @Input() player: DartPlayer = {
    name: "",
    scores: [],
    won: 0,
    average:0,
    playerNumber: 0, 
    stats: {}
  };
  @Input() playing: number= 0;
  @Input() started: number= 0;
  @Output() getScore = new EventEmitter<playerScore>();
  setUndo: boolean = false
  constructor(
    public dartService: DartService,
  ) { }

  ngOnChanges() {
    setTimeout(()=>{
        if (this.inputEl)
          this.inputEl.nativeElement.focus()
    })
  }

  ngOnInit(): void {
  }

  setScore(inputValue:string){
    if (!inputValue){
      inputValue = "0"
    }
    this.inputEl.nativeElement.value = '';
    let score= parseInt(inputValue)
    if (score <= 180 && score >= 0){
      this.getScore.emit({player: this.player.playerNumber, score:score})
    }
  }
  Undo(inputValue:string){
    if (!inputValue){
      inputValue = "0"
    }
    this.inputEl.nativeElement.value = '';
    let score= parseInt(inputValue)
    this.dartService.revertLastScore(score, this.player.playerNumber)
    this.setUndo = false

  }
}


export interface playerScore{
  player: number
  score: number
}
