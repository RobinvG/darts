import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DartService } from '../services/dart.service';
import { TrainingService, training, finishes } from '../services/training.service';

@Component({
  selector: 'app-traning',
  templateUrl: './traning.component.html',
  styleUrls: ['./traning.component.scss']
})
export class TraningComponent implements OnInit {
  @ViewChild('sc', {static: false}) inputEl!:ElementRef;
  game!: training
  currentCheckout!: finishes;
  dataSource = new MatTableDataSource<finishes>();
  displayedColumns: string[] = ['checkout', 'throw1', 'throw2', 'throw3'];
  score!: number;
  constructor(
    private trainingService: TrainingService,
    public dartService:  DartService
  ) { }

  ngOnInit(): void {
    this.trainingService.training.subscribe(game => {
      this.game = game
      this.currentCheckout = game.finishes[game.finishes.length -1]
      let dataList = [...this.game.finishes]
      this.dataSource.data=  dataList.reverse()
    })
  }

  keyBoard(key: number | string){
    if (key === "clear"){
      this.score = 0
    }
    else if (key === "check"){
      this.sentScore() 
      this.score = 0
    }
    else{
      let score = this.score ? this.score : 0
      let tmp =  score.toString() + key.toString()

      this.score = Number(tmp)
    }
  }


  sentScore(){
    this.trainingService.setScore(this.score)
    this.score;
    this.inputEl.nativeElement.value = ''
  }
}
