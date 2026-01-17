// Player & stats management
const players = [
 {num:11,name:"Doug Spencer"},
  {num:21,name:"Andrew Metheny"},
   {num:22,name:"Evan Norris"},
    {num:24,name:"Cristian Garcia"},
     {num:25,name:"Trenton Metheny"},
      {num:40,name:"Taylor Hines"}
      ];

      const stats = ["2pt Make","2pt Miss","3pt Make","3pt Miss","Assist","Rebound","Steal","Turnover","Block","Foul"];

      let game = {};
      players.forEach(p => game[p.num] = {name:p.name, stats:{}, shots:[]} );

      // Export/Import
      function exportGame(){ navigator.clipboard.writeText(JSON.stringify(game)); alert("Copied game data!"); }
      function importGame(){ let data=prompt("Paste game data:"); if(data) game=JSON.parse(data); render(); }