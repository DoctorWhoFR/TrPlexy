/*
 *   Copyright (c) 2020 OGK Kommunity

 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.

 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.

 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cpuUsage } from 'process';
import {DataTable} from "simple-datatables"

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})

export class MoviesComponent implements OnInit {

  data: any;
  selected: any;
  
  constructor(private HttpClient:HttpClient){}


  ngOnInit(): void {

  }

  chercher(){
    const test = (<HTMLInputElement>document.getElementById("test")).value;

    let url= "http://SERVER_IP:PORT/search?title=" + test;
    this.HttpClient.get(url).subscribe(item => {this.data = item })

    console.log(test)
  }

  reset(){
    this.data = null;
  }

  tryDownload(value) {

    let url = "http://SERVER_IP:PORT/try";
    let options = {responseType: "text"}

    this.HttpClient.post<any>(url, { torrent: value }).subscribe(data => {
        if(data.status === "ok"){
          const try_btn = (<HTMLButtonElement>document.getElementById(value.desc))
          try_btn.innerText = "VALIDER"
          try_btn.style.backgroundColor = "green";
        } else {

        }


    })
  }

}
