import { Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DartService } from '../services/dart.service';
import { TrainingService } from '../services/training.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {
  Games: Game[]= [
    {name: "Normal", types: [101, 201, 301, 501, 1001], selected_type: 501,  legs:3, max_players: 4, players: [{name:""},{name:""}]},
    {name: "121", max_players:0 , start_score: 121, players:[], easy_mode:false},
    // {name: "JDC Challenge", max_players: 4},
  ]
  
  selectedGame: Game= this.Games[0];
  gameTypes: number[] =[101, 201, 301, 501, 1001]
  gameType: number = 501;
  legs: number = 3;
  players: player[] = [{name:""},{name:""}];
  error: boolean = false
  errorMessages: string[] = []
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private dartService: DartService,
    private trainingService: TrainingService,
  ) { }


  startGame(){
    //check if all names are entered and without duplicates
    this.error = false
    this.errorMessages = []
    let playerNames: string[] = []
    this.selectedGame.players.forEach(player =>{
      if (player.name === ""){
        this.error= true
        this.errorMessages.push("Player name is empty")
      }
      if (playerNames.indexOf(player.name) !== -1){
        this.error= true
        this.errorMessages.push("Duplicate player name")
      }
      playerNames.push(player.name)
    })

    if (!this.error){
      if (this.selectedGame.name == "Normal"){
        let legs = this.selectedGame.legs ? this.selectedGame.legs : 0
        let gameType =  this.selectedGame.selected_type ? this.selectedGame.selected_type : 501
        this.dartService.startGame(legs, gameType, this.selectedGame.players[0].name, 
          this.selectedGame.players[1]?.name, this.selectedGame.players[2]?.name, this.selectedGame.players[3]?.name)
          this.router.navigate(['/game'])    
      }else if (this.selectedGame.name == "121"){
        let startScore = this.selectedGame.start_score ? this.selectedGame.start_score : 100
        this.trainingService.startTraining(startScore, this.selectedGame.easy_mode)
        this.router.navigate(['/training'])    
      }
     
    }
  
  }

}


export interface player{
  name: string;
}

interface Game {
  name: string
  max_players: number
  players: player[]
  types?: any[]
  selected_type?: number
  legs?: number
  start_score?: number
  easy_mode?: boolean
}