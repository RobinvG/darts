import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopupComponent } from '../popup/popup.component';
import { DartService } from '../services/dart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
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
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    //check if Game is still ongoing 
    // this.dartService.game.subscribe(game =>{
    //   if (game.legs > 0){
    //     this.router.navigate(['/game'])
    //   }
    // })

  }

  startGame(){
    //check if all names are entered and without duplicates
    this.error = false
    this.errorMessages = []
    let playerNames: string[] = []
    this.players.forEach(player =>{
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
      this.dartService.startGame(this.legs, this.gameType, this.players[0].name, this.players[1]?.name, this.players[2]?.name, this.players[3]?.name)
      this.router.navigate(['/game'])    
    }
  }

}


export interface player{
  name: string;
}