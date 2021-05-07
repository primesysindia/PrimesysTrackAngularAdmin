import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-command-table',
  templateUrl: './command-table.component.html',
  styleUrls: ['./command-table.component.css']
})
export class CommandTableComponent implements OnInit {
  searchText: string;
  filters: Object;
  
  constructor() { }

  ngOnInit() {
  }

}
