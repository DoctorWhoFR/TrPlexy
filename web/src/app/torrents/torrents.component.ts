/*
 *   Copyright (c) 2020 4Azgin
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:

 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.

 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http"


export interface torrents {
  torrents: any
}

@Component({
  selector: 'app-torrents',
  templateUrl: './torrents.component.html',
  styleUrls: ['./torrents.component.css']
})
export class TorrentsComponent implements OnInit {


  torrents: torrents;
  headers: any;

  constructor(private HttpClient:HttpClient) { }

  getTorrents(){
    let url = "http://SERVER_IP:PORT/alls"
    this.HttpClient.get<torrents>(url).subscribe( item => {this.torrents = item.torrents; console.log(item)} )
  }

  refresh(){
    this.getTorrents()
  }

  start(id){
    let url = "http://SERVER_IP:PORT/start?id=" + id
    this.HttpClient.get<torrents>(url,  { headers: this.headers, responseType: 'text' as 'json' }).subscribe( item => {} )
    setTimeout(() => {
      this.getTorrents()
    }, 2000);
  }

  stop(id){
    let url = "http://SERVER_IP:PORT/stop?id=" + id
    this.HttpClient.get<torrents>(url,  { headers: this.headers, responseType: 'text' as 'json' }).subscribe( item => {} )
    setTimeout(() => {
      this.getTorrents()

    }, 2000);
  }

  remove(id){
    let url = "http://SERVER_IP:PORT/remove?id=" + id
    this.HttpClient.get<torrents>(url,  { headers: this.headers, responseType: 'text' as 'json' }).subscribe( item => {} )
    setTimeout(() => {
      this.getTorrents()

    }, 2000);
  }

  ngOnInit(): void {
    this.getTorrents()

    setTimeout(() => {
      this.ngOnInit()
    }, 15000);


  }

}
