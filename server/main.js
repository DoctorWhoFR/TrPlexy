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

  const express = require('express')
  const { exec } = require("child_process");
  var bodyParser = require('body-parser');
  const app = express()
  const port = 3000

  
  ///////////////////////////////////////////////////////////////////////////////////////
  // [ TORRENT SEARCH API]
  // https://www.npmjs.com/package/torrent-search-api
  // Created by jimmylaurent (https://www.npmjs.com/~jimmylaurent)
	var Transmission = require('transmission');
	var transmission = new Transmission({
		port: '9091',			// DEFAULT : 9091
		host: 'SERVER_IP',			// DEAFULT : 127.0.0.1
		username: 'transmission',	// DEFAULT : BLANK
		password: 'transmission'	// DEFAULT : BLANK
	});
	
	
	function getTransmissionStats(){
	  transmission.sessionStats(function(err, result){
		  if(err){
			  return err;
		  } else {
			  return result;
		  }
	  });
	}
	/////////////////////////////////////////////////////////////////


  ///////////////////////////////////////////////////////////////////////////////////////
  // [ TORRENT SEARCH API]
  // https://www.npmjs.com/package/torrent-search-api
  // Created by jimmylaurent (https://www.npmjs.com/~jimmylaurent)
  
  // TORRENT SEARCH MODULE CONFIG 
  const TorrentSearchApi = require('torrent-search-api');
  TorrentSearchApi.enablePublicProviders();
  
  // You can enable private provider by using this function (list can be find on the module page.)
  // TorrentSearchApi.enableProvider('Yggtorrent', 'username', 'password');
  
  ////////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////
  // for parsing application/json
  app.use(bodyParser.json()); 
  ///////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////
  // for parsing application/xwww-
  app.use(bodyParser.urlencoded({ extended: true })); ;
  ///////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
////////////////// TRANSMISSION FUNCTIONS //////////////////////////////////////////////
  function getAllActiveTorrents(){
    transmission.active(function(err, result){
    if (err){
        console.log(err);
    }
    else {
        for (var i=0; i< result.torrents.length; i++){
            console.log(result.torrents[i].id);
            console.log(result.torrents[i].name);
        }
    }
    });
}

// To start a paused / stopped torrent which is still in queue
function startTorrent(id){
  transmission.start(id, function(err, result){});
}

 
// Pause / Stop a torrent
function stopTorrent(id){
    transmission.stop(id, function(err, result){});
}
 
// Pause / Stop all torrent
function stopAllActiveTorrents(){
    transmission.active(function(err, result){
    if (err){
        console.log(err);
    }
    else {
        for (var i=0; i< result.torrents.length; i++){
            stopTorrents(result.torrents[i].id);
        }
    }
    });
}
 
// Remove a torrent from download queue
// NOTE : This does not trash torrent data i.e. does not remove it from disk
function removeTorrent(id) {
    transmission.remove(id, function(err) {
        if (err) {
            throw err;
        }
        console.log('torrent was removed');
    });
}
////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
/////////////// EXPRESS ROUTES /////////////////////////////////////////////////////////
  app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.get('/status', async(req,res) =>{
    
    transmission.sessionStats(function(err, result){
      if(err){
          return err;
      } else {
          res.send(result);
      }
    })
  });


  app.get('/start', async(req, res)=>{
    var integer = parseInt(req.query.id, 10);
    startTorrent(integer)
    res.sendStatus(200)
  })

  app.get('/stop', async(req, res)=>{
    var integer = parseInt(req.query.id, 10);
    stopTorrent(integer)
    res.sendStatus(200)
  })

  app.get('/remove', async(req, res)=>{
    var integer = parseInt(req.query.id, 10);
    removeTorrent(integer)
    res.sendStatus(200)

  })

  app.get('/alls', async(req,res) =>{
    
    transmission.get(function(err, result){
      if(err){
          return err;
      } else {
          res.send(result);
      }
    })
  }); 
  app.get('/alls', async(req,res) =>{
    
    transmission.get(function(err, result){
      if(err){
          return err;
      } else {
          res.send(result);
      }
    })
  }); 
  app.get('/avaibles', async (req, res) => {
      const activeProviders = TorrentSearchApi.getActiveProviders();
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      res.send(activeProviders)
  })

  app.get('/search', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const torrents = await TorrentSearchApi.search(req.query.title, 'All', 100);
      res.send(torrents);
  })

  app.post('/try', async (req, res) =>{

      let torrent = req.body.torrent
      res.setHeader('Access-Control-Allow-Origin', '*');

      try{
        const magnet = await TorrentSearchApi.getMagnet(torrent);

        exec("transmission-remote -a -n 'transmission:transmission' '" + magnet + "'", (error, stdout, stderr) => {
    
          if (error) {
              console.log(`error: ${error.message}`);
              return;
          }
      
          if (stderr) {
              console.log(`stderr: ${stderr}`);
              return;
          }
      
        });

        res.send({status: "ok"})

      } catch(error) {
        res.send({status: "error"})
      }
      
  })

  app.listen(port, () => {
    console.log(`Torrents API IS [ON]`)
  })
////////////////////////////////////////////////////////////////////////////////////////

