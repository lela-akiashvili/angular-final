import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Game } from '../../types/game';
import { GamesFirebaseService } from '../../shared/services/gamesFirebase.service';
@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
})
export class TicketsComponent implements OnInit {
  private gameService = inject(GamesFirebaseService);
  // ძალიან არასაჭიროა აქ სიგნალი. მნიშვნელობა ყოველთვის ერთი აქვს - API-ს დაბრუნებული ერთჯერადი შედეგი.
  // სიგნალი მაშინ გინდა, როცა მნიშვნელობა ცვალებადია.
  gamesSig = signal<Game[]>([]);
  ngOnInit(): void {
    this.gameService.getGames().subscribe((games) => {
      this.gamesSig.set(games);
    });
  }
}
