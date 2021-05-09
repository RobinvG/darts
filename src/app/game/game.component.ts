import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DartService, Game } from '../services/dart.service';
import { playerScore } from './player/player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent implements OnInit {
  stat = {
    scoreLeft: 501,
    scores: [],
    thrown: 0,
    highestOut: 0,
    180: 0,
    "140+": 0,
    "100+": 0,
    "60+": 0,
    lolly: 0,
  }

  game!: Game  
  constructor(
    private dartsService: DartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dartsService.game.subscribe(game => {
      if (!game.player1.name){
        this.router.navigate(["/"])
      }
      this.game = game
    })
  }

  setScore(score:playerScore){
    this.dartsService.setScore(score.player, score.score)
  }
}
